var fs = require("fs");

var contents = fs.readFileSync("C:/temp/some_file.txt", "utf8");
console.log("Sync version: " + contents);

// basic async IO example
var contents2 = null;
fs.readFile("C:/temp/some_file.txt", "utf8", function(err, result){
	if(err){
		console.error(err);
		return;
	}
	
	contents2 = result;
	console.log("callback finished!: " + contents2);
});
console.log("immediately after the async call");

// how to guarantee ordering in async calls
fs.mkdir("C:/temp/processed", function(err1){
	if(err1){
		console.error(err1);
		return;
	}
	
	fs.mkdir("C:/temp/processed/2014", function(err2){
		if(err2){
			console.error(err2);
			return;
		}
	});
	
	mkdirIfNotExists("C:/temp/processed/2015", function(){
		console.log("2015 folder created");
	});
	
	mkdirIfNotExists("C:/temp/processed/2016", function(){
		console.log("2016 folder created");
	});
	
	readAndParseJson("C:/temp/CH2015.json", function(err3, data){
		if(err3){
			console.error(err3);
			return;
		}
		
		console.log("received back the parsed JSON");
		console.log(data);
	});
});

// how to make async helper functions
function mkdirIfNotExists(directoryPath, callback){
	fs.mkdir(directoryPath, function(err){
		if(err){
			// we don't care if an error happens
			// because it probably means the directory 
			// already exists
		}
		
		// execute the callback
		callback();
	});	
}

// helper function that can have potential errors
// and a return value
function readAndParseJson(filePath, callback){
	
	fs.readFile(filePath, "utf8", function(err, result){
		if(err){
			console.error(err); // not always necessary
			
			// handback the error to whoever called us
			callback(err);
			return;
		}
		
		// we know, beforehand, that result is a UTF-8 JSON string
		var parsedObject = JSON.parse(result);
		
		// give back the parsedObject
		callback(null, parsedObject);
	});
	
}


/* pseudo-code

// sync
var something  = getSomething();

// async
var somethingAsync = null;

function callback(result){
	somethingAsync = result;
	console.log("callback called");
}
getSomethingAsync(callback);
console.log("hello from async");


*/


function getParameter(flagName, argv){
	// hande the file output flag
	if(argv.indexOf(flagName) > -1){
		
		var argIndex = argv.indexOf(flagName);
		argIndex = argIndex + 1;
		
		// this grabs the next parameter in our arguments array
		// e.g. -output "C:\temp\logs\file.txt"
		var param = argv[argIndex];
		return param;
	}
}
