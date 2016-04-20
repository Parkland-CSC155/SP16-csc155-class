var express = require("express");
var router = express.Router();

router.get("search", function(req, res){
    res.send("Hello World");
});

router.get("list", function(req, res){
    res.send("Hello World");
});