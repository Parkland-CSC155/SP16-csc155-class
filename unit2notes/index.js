console.log("Hello World!");

function someFunc(a, b, c, d){
	
	//if(typeof(a) == "string")
	
	console.log("hello from someFunc");
	
	return 1;
}

var someFuncVariable = someFunc;
var someVariable = someFunc();

var someAnonymousFunc = function(){
	return 2;
}

function doSomethingAsync(callback){
	// do something asynchronously
	
	callback(2);
}

doSomethingAsync(function(result){
	
	// now we know its done, and we have a result
});


var me = {
	someNewFunc: function(){
		
	}
}