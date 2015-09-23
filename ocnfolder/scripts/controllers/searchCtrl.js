var app = angular.module('onctoolsSearchApp');

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

app.controller('SearchCtrl', function($scope, $q, $http) {
    $http.get('books.json').then(function(result) {
        $scope.contents = result.data;
        $scope.indent = 0;

        var documentDb = new PouchDB('documents');
        var sentenceDb = new PouchDB('sentences');

        var promises = (function readFiles(data, directory) {
            directory = directory || '';
            var path = directory + (directory ? '/' : '');
            var promises = [];
            data.files.forEach(function(f) {
                var filename = path + f.name;
                if (filename.endsWith('.pdf') || filename.endsWith('.docx')) return;
                promises.push($http.get(filename, {transformResponse: undefined}).then(function(result) {
                    documentDb.put({
                        _id: f.id.toString(),
                        url: filename,
                        timestamp: f.modified
                    });
                }));
            });
            data.directories.forEach(function(d) {
                promises = promises.concat(readFiles(d.contents, path + d.name));
            });
            return promises;
        }($scope.contents, '../sample'));

        $q.all(promises).then(function() {
            documentDb.allDocs({include_docs: true}).then(function(result) {
                console.log(result);
            })
        });
    });
});
