//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
var PORT = process.env.port || 3000;

//We need a function which handles requests and send response
function handleRequest(request, response){
	
	if(request.url.indexOf("specialPath") > -1){
		response.end('You hit my special path!!');
		return;
	}
	
	if(request.url.indexOf("fancyHtml") > -1){
		var html = `
<html>
<head></head>
<body>
	<p>Whoa - this is some awesome HTML!</p>
</body>
</html>`;
		response.setHeader('Content-Type', 'text/html');
		response.end(html);
		return;
	}
	
	// GET: /someJson
	if(request.url.indexOf("someJson") > -1){
		var me = {
			name: "john doe",
			age: "none of your business"	
		};
		var json = JSON.stringify(me);
		
		response.setHeader('Content-Type', 'application/json');
		response.end(json);
		return;
	}
	
	
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});