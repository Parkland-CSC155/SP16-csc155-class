// requires
var request = require("request");

var urls = [
    "https://www.quandl.com/api/v3/datasets/GOOG/NASDAQ_GOOG.json",
    "https://www.quandl.com/api/v3/datasets/GOOG/NASDAQ_MSFT.json",
    "https://www.quandl.com/api/v3/datasets/GOOG/NASDAQ_AAPL.json"
];

console.log("starting ...");