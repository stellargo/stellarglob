var texts 	= document.getElementsByClassName('glitch');
var strings = ['Code. Compile. Run.','Another subtopic'];
var istring = 0;

Array.prototype.forEach.call(texts, function(text){

	setInterval(myMethod, 140);
	var i=0;

	function myMethod(){
		text.innerHTML = strings[istring].substring(0,i) + '/';
		i++;
		if (i==strings[istring].length+1){
			setTimeout(function myMethod2(){}, 10000);
			i--;
		}
	istring++;
	}
});
