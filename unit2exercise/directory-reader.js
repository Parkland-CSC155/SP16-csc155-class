var fs = require("fs");
var colors = require("colors");

exports.readDir = function (){
	var files = fs.readdirSync(__dirname);
	console.log(colors.green(files));
}