// requires
var request = require("request");

var urls = [
    "https://www.quandl.com/api/v3/datasets/GOOG/NASDAQ_GOOG.json",
    "https://www.quandl.com/api/v3/datasets/GOOG/NASDAQ_MSFT.json",
    "https://www.quandl.com/api/v3/datasets/GOOG/NASDAQ_AAPL.json"
];

console.log("starting ...");
/*
request('http://www.google.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage. 
  }
});
*/
request('https://www.quandl.com/api/v3/datasets/GOOG/NASDAQ_GOOG.json', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body); // Show the HTML for the Google homepage.
    var parsedJson = JSON.parse(body); 
    console.log(parsedJson);
  }
});

