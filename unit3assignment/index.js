var DEBUG = false;

var path = require("path");
var folderArg = process.argv[2];

log(process.argv);
log(folderArg);

// ensures that relative paths are resolved to absolute paths
var absPath = path.resolve(folderArg);

var processedFolder = folderArg + "/processed";
var processedFodler2 = path.join(folderArg, "processed", "2014");


function log(msg){
	if(DEBUG){
		console.log(msg);
	}
}
