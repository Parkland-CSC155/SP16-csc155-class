
var express = require("express");
var path = require('path');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));


app.get("/", function(req, res, next){
   res.send("hello world");
});

app.use("/api", require("./routes/api"));