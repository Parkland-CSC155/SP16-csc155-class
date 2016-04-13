
var express = require("express");
var path = require('path');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

// super basic logging
app.use(function(req, res, next){
    
    var log = "REQUEST URL: " + req.url;
    console.log(log);
    next();
});

app.get("/", function(req, res, next){
   res.send("hello world");
});

app.get("/nutrition/:id", function(req, res){
    var id = req.params.id;
    var page = req.query.page;
    
    var data = /* query db */ { id: id };
    res.send(data);
});

app.get("/my-page", function(req, res){
   res.render("index", { myName: "Eric" } ); 
});

// create 404 errors for URLs that don't exist
app.use(function(req, res, next){
   var err = new Error("Page Not Found!");
   err.status = 404;
   next(err); 
});

// handle any and all errors
app.use(function(err, req, res, next){
   res.status(err.status || 500);
   res.send(err.message);
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});