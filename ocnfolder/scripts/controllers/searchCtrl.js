var app = angular.module('ocntoolsSearchApp');

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.getSentences = function() {
    return this.replace(/([a-z])[.!?]\s*['"‘“]?([A-Z])/g, '$1|$2').split('|');
};

app.controller('SearchCtrl', function($scope, $q, $http) {
    $http.get('books.json').then(function(result) {
        $scope.contents = result.data;
        $scope.indent = 0;

        var documentDb = new PouchDB('documents');
        var sentenceDb = new PouchDB('sentences');

        var sentencesIndex = lunr(function() {
            this.field('text', {boost: 10});
            this.ref('_id');
        });

        var promises = (function readFiles(data, directory) {
            directory = directory || '';
            var path = directory + (directory ? '/' : '');
            var promises = [];
            data.files.forEach(function(f) {
                var filename = path + f.name;
                if (filename.endsWith('.pdf') || filename.endsWith('.docx')) return;
                promises.push($http.get(filename, {transformResponse: undefined}).then(function(result) {
                    var text = result.data;
                    var docId = f.id.toString();
                    var name = $('<div>' + text + '</div>').find('title').text();
                    console.log(name || 'not html');
                    if (!name) {
                        var urlParts = filename.split('/');
                        name = urlParts[urlParts.length - 1];
                    }
                    documentDb.put({
                        _id: docId,
                        url: filename,
                        name: name,
                        timestamp: f.modified
                    });
                    var sentences = [];
                    var createRecord = function(sentence, index) {
                        return {
                            _id: docId + ':' + index,
                            text: sentence,
                            docId: docId,
                            blockId: undefined
                        };
                    };
                    if (filename.endsWith('.html')) {
                        $(text).find('p').each(function() {
                            var self = this;
                            $.merge(sentences, $(self).text().getSentences().map(createRecord).map(function(s) {
                                s.blockId = $(self).attr('id');
                                s._id += ':' + s.blockId;
                                return s;
                            }));
                        });
                    } else {
                        $.merge(sentences, text.getSentences().map(createRecord));
                    }
                    sentenceDb.bulkDocs(sentences);
                    sentences.forEach(function(s) {
                        sentencesIndex.add(s);
                    });
                }));
            });
            data.directories.forEach(function(d) {
                $.merge(promises, readFiles(d.contents, path + d.name));
            });
            return promises;
        }($scope.contents, '../sample'));

        $q.all(promises).then(function() {
            $scope.search = function() {
                var search = sentencesIndex.search($scope.fulltextSearch);
                $scope.searchResults = {};
                sentenceDb.allDocs({
                    include_docs: true,
                    keys: search.map(function(e) { return e.ref; })
                }).then(function(result) {
                    result.rows.forEach(function(r) {
                        var row = r.doc;
                        if (!$scope.searchResults[row.docId]) {
                            $scope.searchResults[row.docId] = {sentences: []};
                            documentDb.get(row.docId).then(function(doc) {
                                $scope.searchResults[row.docId].doc = doc;
                                $scope.$apply();
                            });
                        }
                        $scope.searchResults[row.docId].sentences.push(row);
                    });
                    $scope.$apply();
                });
            };
        });

        $scope.search = function() {
            $scope.searchResults = {};
        };

        $scope.blockIdNumeric = function(sentence) {
            return parseInt(sentence.blockId);
        };
    });
});
