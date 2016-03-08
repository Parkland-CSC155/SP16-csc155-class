// requires
var fs      = require("fs");
var path    = require("path");

console.log("starting ...");

var inputFolder = getParam("-input");
inputFolder = cleanUpPath(inputFolder);

fs.readdir(inputFolder, function(err, files){
   if(err){
       console.error(err);
       return;
   }
   
   // we have to keep track of how many files we've processed
   // because they happen asynchronously. We'll check each time
   // a file finishes getting processed to see if we're done
   var fileCount = files.length;
   var fileProgress = 0;
   
   // could use a loop here, just a preference thing
   files.forEach(function(file){
      
      var fullFilePath = path.join(inputFolder, file);
      
      // remember, this is async!
      fs.readFile(fullFilePath, "utf8", function(fileReadErr, fileContents){
         if(fileReadErr){
             console.error(fileReadErr);
             return;
         }
         
         console.log("Reading File: " + file);
         var parsedJson = JSON.parse(fileContents);
         
         var datasetName = parsedJson.dataset.name;
         var datasetDesc = parsedJson.dataset.description;
         
         // print out to the console the information about the dataset
         console.log(datasetName + ": " + datasetDesc);
         
         // now check if we're done processing files because we don't know 
         // what order each one may have completed in
         fileProgress += 1;
         if(fileCount == fileProgress){
             
             // print to the console that we're done.
             // we could also call another async function from here
             console.log("DONE!");
         }
      });
      
   });   
   
});

///////////////////////////////////////////////////////////////////////////////
// Helper Functions

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
    
    if(!path.isAbsolute(pathName)){
        pathName = path.resolve(pathName);
    }
    
    return pathName;
}