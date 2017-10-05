var texts = document.getElementsByClassName('glitch');
var strings = ['Code. Compile. Run.','Another subtopic'];
var istring = 0;

Array.prototype.forEach.call(texts, function(text){

	setInterval(myMethod, 140);
	var i=0;

	function myMethod(){
		var string = strings[istring];
		text.innerHTML = string.substring(0,i) + '/';
		i++;
		if (i==string.length+1){
			setTimeout(function myMethod2(){}, 10000);
			i--;
		}
	istring++;
	}
});
