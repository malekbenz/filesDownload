
var path = require("path"),
    fs = require('fs'),
    utils = require('./utils');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'src', alias: 's', type: String },
    { name: 'dest', alias: 'd', type: String },
    { name: 'day', type: Boolean },
    { name: 'week', type: Boolean },
    
    { name: 'all', type: Boolean },
];

const options = commandLineArgs(optionDefinitions)

console.log('options', options);

var url = options['src'] || 'https://vs1.someurl/015.mp4';
var distPath = options['dest'] || __dirname;
var all = options['all'] || false;

var day = (new Date).getDate();

if(options['day']){
    day = (new Date).getDate();
}
if(options['week']){
    day = (new Date).getDay() + 1;
}

distPath = path.join(distPath, day.toString());


console.log(day);
console.log(distPath);

if (distPath == __dirname) {
    distPath = path.join(distPath, utils.dirnameFromUrl(url));

}

if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}


function extractPath(url, next) {

    var ext = path.extname(url);
    var fileName = path.basename(url, ext);
    var url = path.dirname(url);

    if (next) {
        var url2 = url + '/' + utils.getNext(fileName) + ext;
        var filePath = path.join(distPath, utils.getNext(fileName) + ext);
        return {
            url: url2,
            filePath: filePath
        }

    }
    var url2 = url + '/' + fileName + ext;
    var filePath = path.join(distPath, fileName + ext);
    return {
        url: url2,
        filePath: filePath
    }
}

currentFile = extractPath(url)

utils.download(currentFile.url, currentFile.filePath, fileDownload);

function fileDownload(url, filePath) {

    if (!all) {
        return
    }
    if (fs.statSync(filePath).size > 5000) {
        var file = extractPath(url, all);
        utils.download(file.url, file.filePath, fileDownload);
    } else
        fs.unlinkSync(filePath);

}