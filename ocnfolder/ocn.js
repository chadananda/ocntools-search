var fs = require('fs');


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

var data = readDirectory('../sample');
data.count = id;
data.totalSize = 1 * (totalSize / 1000000).toFixed(1);

fs.writeFileSync('books.json', JSON.stringify(data, null, 2));
