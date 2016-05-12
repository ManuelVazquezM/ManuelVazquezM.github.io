var x, y, line, yAxis;

function crearlineal(){
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	x = d3.scale.linear()
	    .range([50, width]);

	y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	line = d3.svg.line()
	    .x(function(d) { return x(d.anio); })
	    .y(function(d) { return y(d.cantidad); });

	var svg = d3.select("#graf_lineal").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("datos.csv", function(error, csv) {

		var datos = [];
      	csv.forEach(function(x) { if(x.Gas == "CO2 (t)"){ generardatos(x) } });
      	function generardatos(x) { //Generar cantidades totales por año
        	var i, existente = 0;
        	for(i=0;i<datos.length;i++){
          		if(x.Anio == datos[i].anio){
            		existente = 1;
            		datos[i].cantidad += +x.Cantidad;
          		};
          	};
        	if(!existente){
          		datos.push({anio: +x.Anio, cantidad: +x.Cantidad});
        	};
      	};

	  x.domain(d3.extent(datos, function(d) { return d.anio; }));
	  y.domain(d3.extent(datos, function(d) { return d.cantidad; }));

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "y axis")
	      .attr("transform", "translate(50,0)")
	      .call(yAxis)
	    .append("text")
	      .attr("id", "y_axis_text")
	      //.attr("transform", "rotate(-90)")
	      .attr("x", 6)
	      .attr("dy", ".71em")
	      //.style("text-anchor", "end")
	      .text("CO2 (t)");

	  svg.append("path")
	      .datum(datos)
	      .attr("class", "line")
	      .attr("d", line);

	  svg.append("g").selectAll("circle")
	  	.data(datos)
	  	.enter()
	  	.append("circle")
	  	.attr("cx",function(d){return x(d.anio);})
	  	.attr("cy",function(d){return y(d.cantidad);})
	  	.attr("r",3)
	  	.style("fill","blue")
	  	.style("opacity",.5)
	  	.on("mouseover",
	  		function(d){
	  			d3.select(this)
	  				.style("opacity",1);
	  			svg.append("text")
					.attr("class", "etiqueta")
					.attr('x',x(d.anio))
					.attr('y',y(d.cantidad))
					.text(d.cantidad)
					.filter(function() { return x(d.anio) > width / 2; })
        			.attr("text-anchor", "end");
	  		})
	  	.on("mouseleave",
	  		function(d){
	  			d3.select(this)
	  				.style("opacity",.5);
	  			svg.select(".etiqueta")
	  				.remove();
	  		})
	  	.on("click", function(d){actualizarsankey(d.anio);})
	  	.filter(function(d){return d.anio == 1990})
	  	.attr("r",5)
	  	.style("fill","red")
	  	.style("opacity",.8)
	  	.on("mouseleave",
	  		function(d){
	  			d3.select(this)
	  				.style("opacity",.8);
	  			svg.select(".etiqueta")
	  				.remove();
	  		});
	});
}

function actualizarlineal(d){
	d3.csv("datos.csv", function(error, csv) {

		var datos = [];
      	csv.forEach(function(x) { if(x.Tipo == d || x.Tipo + " (t)" == d || x.Sector == d || x.Sector + " (t)" == d || x.Gas == d){ generardatos(x) } });
      	function generardatos(x) { //Generar cantidades totales por año
        	var i, existente = 0;
        	for(i=0;i<datos.length;i++){
          		if(x.Anio == datos[i].anio){
            		existente = 1;
            		datos[i].cantidad += +x.Cantidad;
          		};
          	};
        	if(!existente){
          		datos.push({anio: +x.Anio, cantidad: +x.Cantidad});
        	};
      	};

	  y.domain(d3.extent(datos, function(d) { return d.cantidad; }));

	  d3.select(".y.axis")
	  	.call(yAxis)
	  	.select("#y_axis_text")
	  		.text(function (){
	  			if(d.endsWith('(t)')){return d;}
	  			else{return d + ' (t)';}
	  		});

	  d3.select(".line")
	  	.datum(datos)
	  	.transition()
	  	.duration(1500)
	  	.attr("d", line);

	  var selection = d3.selectAll("circle")
	  	.data(datos);

	  selection.transition()
	  	.duration(1500)
	  	.attr("cx",function(d){return x(d.anio);})
	  	.attr("cy",function(d){return y(d.cantidad);})
	  	.attr("r",3)
	  	.style("fill","blue")
	  	.style("opacity",.5)
	  	.filter(function(d){return d.anio == document.getElementById("slider").value})
	  	.attr("r",5)
	  	.style("fill","red")
	  	.style("opacity",.8);

	  selection.on("mouseleave",
	  		function(d){
	  			d3.select(this)
	  				.style("opacity",.5);
	  			d3.select(".etiqueta")
	  				.remove();
  			})
	  	.filter(function(d){return d.anio == document.getElementById("slider").value})
	  	.on("mouseleave",
	  		function(d){
	  			d3.select(this)
	  				.style("opacity",.8);
	  			d3.select(".etiqueta")
	  				.remove();
	  		});
	});
}