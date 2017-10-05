var texts = document.getElementsByClassName('glitch');

Array.prototype.forEach.call(texts, function(text){

	setInterval(myMethod, 140);
	var i=0;

	function myMethod(){
		var string = 'Code. Compile. Run.';
		text.innerHTML = string.substring(0,i) + '/';
		i++;
		if (i==string.length+1){
			setTimeout(function myMethod2(){}, 10000);
			i--;
		}
	}
});
