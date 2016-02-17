var fs = require("fs");

var folderArg = process.argv[2];

console.log(process.argv);

// handle the -v flag
if(process.argv.indexOf("-v") > -1){
	// the -v flag has been included
}

// hande the file output flag
if(process.argv.indexOf("-output") > -1){
	
	var argIndex = process.argv.indexOf("-output");
	argIndex = argIndex + 1;
	
	// this grabs the next parameter in our arguments array
	// e.g. -output "C:\temp\logs\file.txt"
	var outputFile = process.argv[argIndex];
}

function mkdirIfNotExists(path){
	
	// check if directory exists first
	try {
		fs.mkdirSync(path);
	}
	catch(e /* exception object */){
		// test to make sure "directory already exists" error
		// eat it
	}
}

