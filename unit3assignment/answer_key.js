console.log("starting ...");

var fs = require("fs");
var path = require("path");
var colors = require("colors");

// make sure we know where the folder is that 
// we'll be working from
var pathArg = process.argv[2];
var _dir = cleanUpPath(pathArg);

console.log("creating [processed] directories if not exists...");

// make sure we have the directories (folders) created for 
// our file moving logic
createDirectoryIfNotExists(path.join(_dir, "processed"));
createDirectoryIfNotExists(path.join(_dir, "processed/2014"));
createDirectoryIfNotExists(path.join(_dir, "processed/2015"));
createDirectoryIfNotExists(path.join(_dir, "processed/2016"));

// create some helper variables that point to folders
// that we'll be working with
var rawLogs = path.join(_dir, "raw");
var processed = path.join(_dir, "processed");

// get a list of all the log files from the /raw folder so we can sort it
var files = fs.readdirSync(rawLogs);

// start sorting
console.log("sorting files...".green);
files.forEach(function(file){
    
    // build out the absolute path to where the current log file is sitting
    var oldPath = path.join(rawLogs, file);
    // create a variable to hold the absolute path for where the file will be moved
    var newPath = '';

    // sort the file based upon its name
    // and then move the file (Node uses the 'rename' function to do this)
    if(file.startsWith("2014")){
        newPath = path.join(processed, "2014", file);
        fs.renameSync(oldPath, newPath);
    }
    if(file.startsWith("2015")){
        newPath = path.join(processed, "2015", file);
        fs.renameSync(oldPath, newPath);
    } 
    if(file.startsWith("2016")){
        newPath = path.join(processed, "2016", file);
        fs.renameSync(oldPath, newPath);
    }
});

// after we've sorted and moved all the files, now let's see 
// where we moved them by counting the number of files in each folder
var files2014 = fs.readdirSync(path.join(processed, "2014"));
var files2015 = fs.readdirSync(path.join(processed, "2015"));
var files2016 = fs.readdirSync(path.join(processed, "2016")); 

// use the length of each file array as a way to count the # of files in the array
var cnt2014 = files2014.length;
var cnt2015 = files2015.length;
var cnt2016 = files2016.length;

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

// just a helper to make sure we're always
// working with correctly structured, absolute paths
function cleanUpPath(pathName){
    pathName = path.normalize(pathName);
    
    if(!path.isAbsolute(pathName)){
        pathName = path.resolve(pathName);
    }
    
    return pathName;
}