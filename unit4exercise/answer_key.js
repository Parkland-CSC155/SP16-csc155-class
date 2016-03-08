var fs = require("fs");
var path = require('path');

// get the parameters that were passed
// e.g. node index.js -folder "C:\temp\files" -output "C:\temp\output.txt"
var inputFolder = getParam("-folder");
var outputFile = getParam("-output");

inputFolder = cleanUpPath(inputFolder);
outputFile = cleanUpPath(outputFile);

var inputFiles = fs.readdirSync(inputFolder);

for(var i = 0; i < inputFiles.length; i++ ){

    var file = inputFiles[i];
    var fullPath = path.join(inputFolder, file);
    
    var contents = fs.readFileSync(fullPath);
    fs.appendFileSync(outputFile, contents);
}

console.log("done!");

// just a helper to pull args out of the process.argv array
function getParam(flagName){
    var indx = process.argv.indexOf(flagName);
    if(indx < 0){
        return;
    }
    
    var param = process.argv[indx + 1];
    return param;
}

// just a helper to make sure we're always
// working with correctly structured, absolute paths
function cleanUpPath(pathName){
    pathName = path.normalize(pathName);
    
    if(path.isAbsolute(pathName)){
        pathName = path.resolve(pathName);
    }
    
    return pathName;
}