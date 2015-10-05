var fs = require('fs');
var path = require('path');
var program = require('commander');
var uglifycss = require('uglifycss');
var uglifyjs = require('uglify-js');


var currentDir = process.cwd();


program
    .command('buildIndex')
    .description('create index.html file')
    .action(function() {
        var addDirname = function(e) {
            return path.join(__dirname, e);
        };

        var templateName = 'ocntools-search-index.tpl';
        var templatePath = path.join(currentDir, templateName);
        if (!fs.existsSync(templatePath)) {
            templatePath = addDirname(templateName);
        }

        var templateData = fs.readFileSync(templatePath, {encoding: 'utf8'});
        var style = uglifycss.processFiles(['styles/main.css'].map(addDirname));
        var script = uglifyjs.minify(['scripts/app.js', 'scripts/controllers/searchCtrl.js'].map(addDirname)).code;

        var index = fs.readFileSync(addDirname('index.tpl'), {encoding: 'utf8'})
            .replace('<%= search-index-template %>', templateData)
            .replace('<%= main-css %>', style)
            .replace('<%= app-js %>', script);

        fs.writeFileSync(path.join(currentDir, 'index.html'), index);
    });

program.parse(process.argv);


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
            if (['books.json', 'index.html'].indexOf(f) == -1) {
                data.files.push({
                    id: ++id,
                    name: f,
                    modified: stats.mtime
                });
                totalSize += stats.size;
            }
        }
    });
    return data;
}

var data = readDirectory(currentDir);
data.count = id;
data.totalSize = 1 * (totalSize / 1000000).toFixed(1);

fs.writeFileSync(path.join(currentDir, 'books.json'), JSON.stringify(data, null, 2));
