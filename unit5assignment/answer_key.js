
// requires
var fs      = require("fs");
var path    = require("path");
var log4js  = require('log4js');

// configure logging
log4js.configure({
  appenders: [
    { type: 'file', filename: './log.txt', category: 'file-logger' }
  ]
});

var logger = log4js.getLogger('file-logger');

// command args
var verbose     = (process.argv.indexOf("-v") > -1);
var inputFolder = getParam("-input");
var outputFile  = getParam("-output");

inputFolder     = cleanUpPath(inputFolder);
outputFile      = cleanUpPath(outputFile);

// verbose is just a variable to hold whether the '-v' flag was passed
if(verbose){
    logger.setLevel("TRACE");
}else{
    logger.setLevel("INFO");
}

console.log("starting...");
logger.info("starting...");

logger.info("Reading directory: " + inputFolder);
var files = fs.readdirSync(inputFolder);
logger.info("Found " + files.length + "files to process...");

// holds the statistics from each file
var calculatedStats = [];

files.forEach(function(file){
    
    try {
        var fullFilePath = path.join(inputFolder, file);
        
        logger.info("processing file: " + fullFilePath);
        var contents = fs.readFileSync(fullFilePath, "utf8");
        
        logger.trace("file contents: ");
        logger.trace(contents);
        
        logger.info("parsing JSON from file...");
        var parsedJson = JSON.parse(contents);
        logger.info("successfully parsed JSON from file!");
        
        logger.info("computing statistics for file...");
        var stats = computeStats(parsedJson);
        calculatedStats.push(stats);
        logger.info("successfully computed statistics for file: " + fullFilePath);
    }
    catch(err){
        logger.error(err);
    }
    
});

// finish things up    
logger.info("writing stats to file: " + outputFile);

// file headers
fs.writeFileSync(outputFile, "*** Overall Statistics ***\r\n");
fs.appendFileSync(outputFile, "CONTRACT | HIGH | LOW | AVERAGE SETTLE | TOTAL TRADING DAYS\r\n");

calculatedStats.forEach(function(row){
    
    // concatenate a line together
    var line = row.code +  " | " + row.high +  " | " + row.low +  " | " +row.average +  " | " +row.tradingDays + "\r\n";    
    fs.appendFileSync(outputFile, line);
});

logger.info("finished writing stats to file: " + outputFile);
logger.info("done!")
console.log("done!");

///////////////////////////////////////////////////////////////////////////////
// Functions

// calculates all the needed stats for a JSON dataset 
function computeStats(obj){
    
    var code  = obj.dataset.dataset_code;
    var data  = obj.dataset.data;
    var cnt   = data.length;
    
    // stats
    var high  = 0;
    var low   = Number.MAX_VALUE;
    var total = 0; // used to calculate the average
    var avg   = 0; // average Settle price
    
    logger.info("computing stats for dataset: " + code);    
        
    data.forEach(function(item){
       
       logger.trace("processing: [" + code + "] for date: " + item[0]);
       
       var hi     = item[2];
       var lo     = item[3];
       var settle = item[6];
       
       if(hi > high){ high = hi; }
       if(lo < low && lo > 0){ low = lo; }
       
       total = total + settle;
    });
    
    avg = total / cnt;
    
    // return the calculated stats
    return {
        code:     code,
        high:     high.toFixed(2),
        low:      low.toFixed(2),
        average:  avg.toFixed(2),
        tradingDays: cnt
    };
}

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