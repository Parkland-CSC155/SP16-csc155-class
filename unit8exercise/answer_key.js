// requires
var fs      = require("fs");
var path    = require("path");

console.log("starting ...");

var inputFolder = getParam("-input");
inputFolder = cleanUpPath(inputFolder);

// The Promise Chain... much more succinct 
readdirPromise(inputFolder)
    .then(processListOfFiles)
    .then(function(){
        console.log("done!");
    })
    .catch(function(err){
        console.error(err);
    });

///////////////////////////////////////////////////////////////////////////////
// Logic functions
function processListOfFiles(files){
   var allPromises = []; // we can use Promise.all to when all the async work has completed
   
   // could use a loop here, just a preference thing
   files.forEach(function(file){
      
      var fullFilePath = path.join(inputFolder, file);
      
      // remember, this is async!
      var promise = readFilePromise(fullFilePath, "utf8").then(function(fileContents){
         
         console.log("Reading File: " + file);
         var parsedJson = JSON.parse(fileContents);
         
         var datasetName = parsedJson.dataset.name;
         var datasetDesc = parsedJson.dataset.description;
         
         // print out to the console the information about the dataset
         console.log(datasetName + ": " + datasetDesc);
         
      });
      
      allPromises.push(promise);
   });
   
   return Promise.all(allPromises);  
}

///////////////////////////////////////////////////////////////////////////////
// Promise Wrappers Functions

function readFilePromise(filePath, encoding){
    var prom = new Promise(function(resolve, reject){
       
       fs.readFile(filePath, encoding, function(err, contents){
          if(err){
              reject(err);
              return;
          }
          
          resolve(contents);
       });        
    });
    
    return prom;
}

function readdirPromise(folderPath){
    var prom = new Promise(function(resolve, reject){
       
       fs.readdir(folderPath, function(err, files){
          if(err){
              reject(err);
              return;
          }
          
          resolve(files);
       });        
    });
    
    return prom;
}

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