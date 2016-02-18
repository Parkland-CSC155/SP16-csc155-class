console.log("starting ...");

var fs = require("fs");
var path = require("path");
var colors = require("colors");

var _dir = path.resolve(process.argv[2]);

console.log("creating [processed] directories if not exists...");

createDirectoryIfNotExists(path.join(_dir, "processed"));
createDirectoryIfNotExists(path.join(_dir, "processed/2014"));
createDirectoryIfNotExists(path.join(_dir, "processed/2015"));
createDirectoryIfNotExists(path.join(_dir, "processed/2016"));

var rawLogs = path.join(_dir, "raw");
var processed = path.join(_dir, "processed");

var files = fs.readdirSync(rawLogs);

console.log("sorting files...".green);
files.forEach(function(file){
    var oldPath = path.resolve(rawLogs, file);

    if(file.startsWith("2014")){
        fs.renameSync(oldPath, path.join(processed, "2014", file));
    }
    if(file.startsWith("2015")){
        fs.renameSync(oldPath, path.join(processed, "2015", file));
    } 
    if(file.startsWith("2016")){
        fs.renameSync(oldPath, path.join(processed, "2016", file));
    }
});

// counts
var cnt2014 = fs.readdirSync(path.join(processed, "2014")).length;
var cnt2015 = fs.readdirSync(path.join(processed, "2015")).length;
var cnt2016 = fs.readdirSync(path.join(processed, "2016")).length;

console.log(("moved [" + cnt2014 + "] logs into processed\\2014").cyan);
console.log(("moved [" + cnt2015 + "] logs into processed\\2015").cyan);
console.log(("moved [" + cnt2016 + "] logs into processed\\2016").cyan);

console.log("...finished!".green);

function createDirectoryIfNotExists(dir){
    try{
        fs.mkdirSync(dir);
    }
    catch(e){}
}
