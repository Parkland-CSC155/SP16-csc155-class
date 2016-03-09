
var fs = require("fs");

console.log("starting...");
/*
// This is the wrong way to ensure 
// that Step 2 and 3 only start after
// Step 1 has finished
// STEP 1
doWorkAsync(function(err, result){
    console.log("STEP 1 DONE");    
});
console.log("STEP 1 STARTED");

// STEP 2
doWorkAsync(function(err, result){
    console.log("STEP 2 DONE");    
});
console.log("STEP 2 STARTED");

// STEP 3
doWorkAsync(function(err, result){
    console.log("STEP 3 DONE");    
});
console.log("STEP 3 STARTED");
*/
/*
// The Correct way to ensure ordering
// STEP 1
doWorkAsync(function(err1, result1){
    console.log("STEP 1 DONE");
    
    // STEP 2
    doWorkAsync(function(err2, result2){
        console.log("STEP 2 DONE");
        
        // STEP 3
        doWorkAsync(function(err3, result3){
            console.log("STEP 3 DONE");    
        });
        console.log("STEP 3 STARTED");
            
    });
    console.log("STEP 2 STARTED");
    
});
console.log("STEP 1 STARTED");
*/

/* Basic Promise syntax

var promise = new Promise(function(resolve, reject){
    
    // do some work asynchronously
    // if an error occurs
    // reject()
    
    // if its successful
    // resolve()
});

promise.then(function(result){
   // do another step 
});
promise.then(function(result){
   // ... and another step 
});
promise.then(function(result){
   // ...... and another step 
});
promise.catch(function(err){
    // handle the error
})
*/

// wrapper that turns an async
// function into a Promise-based
// function
function doWorkAsyncPromise(){
    
    var promise = new Promise(function(resolve, reject){
        
        // call our original async function
        // but then make sure to either call
        // our resolve or reject callbacks
        doWorkAsync(function(err, result){
            if(err){
                reject(err);
            }else {
                resolve(result);
            }            
        });
        
    });
    
    return promise;
}

var prom = doWorkAsyncPromise();
console.log("STEP 1 STARTED");

prom.then(function(result){
    console.log("STEP 1 DONE!");
});

prom.then(function(){
    var prom2 = doWorkAsyncPromise();
    console.log("STEP 2 STARTED");
    return prom2;
});

prom.then(function(result){
    console.log("STEP 2 DONE!");
});

prom.then(function(){
    var prom3 = doWorkAsyncPromise();
    console.log("STEP 3 STARTED");
    return prom3;
});

prom.then(function(result){
    console.log("STEP 3 DONE!");
});

prom.catch(function(err){
    console.log(err);
});

// how to do async loops
var allPromises = [];
for(var i = 0; i < 25; i++){
    var prom = doWorkAsyncPromise();
    allPromises.push(prom);
}
// I don't know when all of these promises will finish,
// but I need to wait and do my next steps once they have
// ... Promise.all helps me do that
Promise.all(allPromises).then(function(){
    console.log("all the promises are done!"); 
})
.catch(function(err){
    console.log(err);
});


// just a helper function to simulate
// doing async work
function doWorkAsync(callback){
    
    var data = new Date().toISOString();
    fs.appendFile(".\work.txt", data, function(err){
        callback(err, data);
    });
    
}