// requires
var request = require("request");

var urls = [
    "https://www.quandl.com/api/v3/datasets/GOOG/NASDAQ_GOOG.json",
    "https://www.quandl.com/api/v3/datasets/GOOG/NASDAQ_MSFT.json",
    "https://www.quandl.com/api/v3/datasets/GOOG/NASDAQ_AAPL.json"
];

console.log("starting ...");

urls.forEach(function(url) {

    // we have to keep track of how many requests we've processed
    // because they happen asynchronously. We'll check each time
    // a request finishes getting processed to see if we're done
    var reqCount = urls.length;
    var progress = 0;

    // we need to define where the request is going, how it should get
    // there and what type of data we're expecting
    // https://github.com/request/request#requestoptions-callback
    var opts = {
        url: url,
        method: 'GET',
        json: true
    };
    
    console.log("requesting URL: " + url);
    request(opts, function(err, resp, json){
        if(err){
            console.error(err);
            return;
        }

        console.log("received response from URL: " + url);
        
        var datasetName = json.dataset.name;
        var datasetDesc = json.dataset.description;

        // print out to the console the information about the dataset
        console.log(datasetName + ": " + datasetDesc);

        // now check if we're done processing files because we don't know 
        // what order each one may have completed in
        progress += 1;
        if (reqCount == progress) {

            // print to the console that we're done.
            // we could also call another async function from here
            console.log("DONE!");
        }
    });

});