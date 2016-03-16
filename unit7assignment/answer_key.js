// requires
var fs = require("fs");
var path = require("path");
var colors = require("colors");

console.log("starting ...");

var pathArg     = process.argv[2];
var _dir        = cleanUpPath(process.argv[2]);
var rawLogs     = path.join(_dir, "raw");
var processed   = path.join(_dir, "processed");

console.log("creating [processed] directories if not exists...");

// Step 1. 
ensureDirectoriesExist(function() {

    // Step 2.
    getAllRawLogFiles(function(err2, files) {
        if (err2) {
            console.error(err2);
            return;
        }

        // Step 3. 
        sortFiles(files, function(err3) {
            if (err3) {
                console.error(err3);
                return;
            }

            // Step 4.
            performCounts(function(err4) {
                if (err4) {
                    console.error(err4);
                    return;
                }

                // Step 5.
                console.log("...finished!".green);
            });

        })
    });

});

///////////////////////////////////////////////////////////////////////////////
// Async Helper functions

/*
* Contains logic for counting the files in the directories
*/
function performCounts(callback) {

    // counts
    var cnt2014 = 0;
    var cnt2015 = 0;
    var cnt2016 = 0;

    // 2014
    fs.readdir(path.join(processed, "2014"), function(err1, files1) {
        if (err1) {
            console.error(err1);
            return;
        }

        cnt2014 = files1.length;
        console.log(("moved [" + cnt2014 + "] logs into processed\\2014").cyan);

        // 2015
        fs.readdir(path.join(processed, "2015"), function(err2, files2) {
            if (err2) {
                console.error(err2);
                return;
            }

            cnt2015 = files2.length;
            console.log(("moved [" + cnt2015 + "] logs into processed\\2015").cyan);

            // 2016
            fs.readdir(path.join(processed, "2016"), function(err3, files3) {
                if (err3) {
                    console.error(err3);
                    return;
                }

                cnt2016 = files3.length;
                console.log(("moved [" + cnt2016 + "] logs into processed\\2016").cyan);

                // We're done
                callback();
            });
        });
    });
}


/* 
 * This function does the hardwork of moving and sorting all 
 * of our logfiles. Since we have so many, we can't easily
 * use a nested callback approach. We have to resort to keeping track
 * of how many files have moved and how many still have to get moved
 */
function sortFiles(files, callback) {

    var totalFiles = files.length;
    var counter = 0;
    var errored = false; // prevents us from continuing if an error occurs

    // this is re-usable callback
    // we call this every time a fs.rename completes
    function fileMovedCallback(err) {
        // don't keep processing if we hit an error
        if (errored) { return; }
        if (err) {
            errored = true;
            console.error(err);
            callback(err);
            return;
        }

        counter += 1;
        if (counter == totalFiles) {
            // signal that we're done!
            callback();
        }
    }

    console.log("sorting files...".green);
    files.forEach(function(file) {
        var oldPath = path.join(rawLogs, file);
        var newPath = "";

        if (file.startsWith("2014")) {
            newPath = path.join(processed, "2014", file);
            fs.rename(oldPath, newPath, fileMovedCallback);
        }
        if (file.startsWith("2015")) {
            newPath = path.join(processed, "2015", file);
            fs.rename(oldPath, newPath, fileMovedCallback);
        }
        if (file.startsWith("2016")) {
            newPath = path.join(processed, "2016", file);
            fs.rename(oldPath, newPath, fileMovedCallback);
        }
    });

}

/* 
 * Just simply reads the directory ... probably don't need this,
 * but it helps keep things tidy
 */
function getAllRawLogFiles(callback) {

    fs.readdir(rawLogs, function(err, files) {
        if (err) {
            console.error(err);
        }

        callback(err, files);
    });
}

/* 
 * This function encapsulates the creation
 *  of the 'processed' folder and its subdirectories
 */
function ensureDirectoriesExist(doneCallback) {

    createDirectoryIfNotExists(processed, function() {

        createDirectoryIfNotExists(path.join(processed, "2014"), function() {

            createDirectoryIfNotExists(path.join(processed, "2015"), function() {

                createDirectoryIfNotExists(path.join(processed, "2016"), function() {
                    // at this point, we're done!
                    doneCallback();
                });
            });
        });
    });

}

/* 
 * this helper function ensures a directory exists, and creates 
 * one if it doesn't
 */
function createDirectoryIfNotExists(dir, done) {
    fs.mkdir(dir, function(err) {
        // eat the err
        done();
    })
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