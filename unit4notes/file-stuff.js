var fs = require("fs");
var path = require("path");

var filePath = path.join(__dirname, "index.js");
console.log(filePath);

var contents = fs.readFileSync(filePath, "utf8");
console.log(contents);

var newPath = path.join(__dirname, "index-copy.js");
fs.writeFileSync(newPath, contents);

console.log("done!");
