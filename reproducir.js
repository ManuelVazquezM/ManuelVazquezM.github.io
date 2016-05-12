var reproduccion
function reproducir(){
	document.getElementById("stop").removeAttribute("hidden");
	document.getElementById("play").setAttribute("hidden",true);
	reproduccion = setInterval(function() {
		anio = document.getElementById("slider").value;
		if(anio<2013){
			anio++;
		}
		else{
			anio = 1990;
		}
		actualizarsankey(anio);
	}, 10 * 1000);
}

function finreproducir(){
	clearInterval(reproduccion);
	document.getElementById("stop").setAttribute("hidden",true);
	document.getElementById("play").removeAttribute("hidden");
}