var fs = require('fs');
var exec = require('child_process').exec;


var id = 0;
var totalSize = 0;

function readDirectory(dirName) {
    var data = {files: [], directories: []};
    var files = fs.readdirSync(dirName);

    files.forEach(function(f) {
        var name = dirName + '/' + f;
        var stats = fs.statSync(name);
        if (stats.isDirectory()) {
            data.directories.push({
                name: f,
                contents: readDirectory(name)
            });
        } else {
            data.files.push({
                id: ++id,
                name: f,
                modified: stats.mtime
            });
            totalSize += stats.size;
        }
    });
    return data;
}

var data = readDirectory('sample');
data.count = id;
data.totalSize = 1 * (totalSize / 1000000).toFixed(1);

fs.writeFileSync('ocnfolder/books.json', JSON.stringify(data, null, 2));

if (process.argv[2] == 'buildIndex') {
    var templatePath = 'ocntools-search-index.tpl';
    if (!fs.existsSync(templatePath)) {
        templatePath = 'ocnfolder/' + templatePath;
    }
    var indexPath = 'ocnfolder/index';

    var templateData = fs.readFileSync(templatePath, {encoding: 'utf8'});
    var index = fs.readFileSync(indexPath + '.tpl', {encoding: 'utf8'});
    index = index.replace('<%= search-index-template %>', templateData);
    fs.writeFileSync(indexPath + '.html', index);
    exec('./build');
}
