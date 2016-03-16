// requires
var fs = require("fs");
var path = require("path");
var colors = require("colors");

console.log("starting ...");

var pathArg         = process.argv[2];
var _dir            = cleanUpPath(process.argv[2]);
var rawLogs         = path.join(_dir, "raw");
var processedLogs   = path.join(_dir, "processed");

console.log("creating [processed] directories if not exists...");

// the Promise Chain - each step of our logic, chained together
mkdirIfNotExists(processedLogs)
.then(function(){ 
    // returning a promise inside of 'then' makes the next 'then' function
    // wait to execute until this promise has been resolved!
    return mkdirIfNotExists(path.join(processedLogs, "2014"));
})
.then(function(){
    return mkdirIfNotExists(path.join(processedLogs, "2015"));
})
.then(function(){
    return mkdirIfNotExists(path.join(processedLogs, "2016"));
})
.then(function(){
    return readdir(rawLogs);
})
.then(function(listOfLogFiles){ // `listOfLogFiles` is the value returned from the previous Promise (readdir)
    return sortFiles(listOfLogFiles);
})
.then(function(){
    // this is a good example of a helper function that builds 
    // a more complex promise chain, but then returns it and 
    // allows us to ensure our logic is still correctly ordered
    return performCounts();
})
.then(function(){
    console.log("...finished!".green);
})
.catch(function(err){ // any error within our Promise chain will come into here
    console.error(err);
});

///////////////////////////////////////////////////////////////////////////////
// Async Helper functions

/*
* Contains logic for counting the files in the directories
*/
function performCounts() {

   // another example of a Promise chain
   // this helps us keep things ordered without trying to use callbacks
   var prom = readdir(path.join(processedLogs, "2014"))
   .then(function(files2014){
        var cnt2014 = files2014.length;
        console.log(("moved [" + cnt2014 + "] logs into processed\\2014").cyan);
   })
   .then(function(){
       return readdir(path.join(processedLogs, "2015"));
   })
   .then(function(files2015){
        var cnt2015 = files2015.length;
        console.log(("moved [" + cnt2015 + "] logs into processed\\2015").cyan);
   })
   .then(function(){
       return readdir(path.join(processedLogs, "2016"));
   })
   .then(function(files2016){
        var cnt2016 = files2016.length;
        console.log(("moved [" + cnt2016 + "] logs into processed\\2016").cyan);
   });
   
   // this promise has the whole chain above baked into it. 
   // when we return it, others can then further chain on to it with 'then' 
   // if they want
   return prom;
}

function sortFiles(files) {

    console.log("sorting files...".green);

    var allPromises = [];
    files.forEach(function(file) {
        
        var prom = sortFile(file);
        allPromises.push(prom);
        
    });
    
    // Promise.all creates a special Promise that only resolves
    // if all the promises in the array passed to it resolve successfully
    // and it rejects if any of the promises passed to it fail
    return Promise.all(allPromises);
}

///////////////////////////////////////////////////////////////////////////////
// Promise Wrappers Functions

/* 
* Helper to do the logic of sorting the logfiles
* returns a Promise that is resolved when the moving of the file completes
*/
function sortFile(file){
    
    return new Promise(function(resolve, reject){
        
        var oldPath = path.join(rawLogs, file);
        var newPath = "";

        if (file.startsWith("2014")) {
            newPath = path.join(processedLogs, "2014", file);
        }
        if (file.startsWith("2015")) {
            newPath = path.join(processedLogs, "2015", file);
        }
        if (file.startsWith("2016")) {
            newPath = path.join(processedLogs, "2016", file);
        }
        
        // just rename the file and resolve/reject the promise 
        // accordingly
        fs.rename(oldPath, newPath, function(err){
            if(err){
                reject(err);
            }else{
                resolve();
            }            
        });
    });
}

function readFile(filePath, encoding){
    return new Promise(function(resolve, reject){
       
       fs.readFile(filePath, encoding, function(err, contents){
          if(err){
              reject(err);
              return;
          }
          
          resolve(contents);
       });        
    });
}

function readdir(folderPath){
    return new Promise(function(resolve, reject){
       
       fs.readdir(folderPath, function(err, files){
          if(err){
              reject(err);
              return;
          }
          
          resolve(files);
       });        
    });
}

/* 
 * this helper function ensures a directory exists, and creates 
 * one if it doesn't
 */
function mkdirIfNotExists(dir) {
    return new Promise(function(resolve, reject){
    
        fs.mkdir(dir, function(err) {
            // eat the err
            resolve();
        });
    
    });
}

///////////////////////////////////////////////////////////////////////////////
// Helper Functions

// just a helper to make sure we're always
// working with correctly structured, absolute paths
function cleanUpPath(pathName){
    pathName = path.normalize(pathName);
    
    if(!path.isAbsolute(pathName)){
        pathName = path.resolve(pathName);
    }
    
    return pathName;
}