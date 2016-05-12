var margin, width, height;
var formatNumber, format, color;
var sankey, path;

function crearsankey(){
  var units = "tons";
   
  margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 1200 - margin.left - margin.right,
  height = 740 - margin.top - margin.bottom;
   
  formatNumber = d3.format(",.0f"),    // zero decimal places
  format = function(d) { return formatNumber(d) + " " + units; },
  color = d3.scale.category20();
   
  // append the svg canvas to the page
  var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
   
  // Set the sankey diagram properties
  sankey = d3.sankey()
      .nodeWidth(36)
      .nodePadding(10)
      .size([width, height]);
   
  path = sankey.link();
   
  // load the data
  d3.csv("datos.csv", function(error, csv) {

      var datos = {links:[], nodes:[]};
      csv.forEach(function(x) { if(x.Anio == 1990){ comprobarnodos(x.Tipo); comprobarnodos(x.Sector); comprobarnodos(x.Gas); comprobarlinks(x) } });
      function comprobarnodos(x) { //Comprobar existencia y añadir nuevos nodos
        var i, existente = 0;
        for(i=0;i<datos.nodes.length;i++){
          if(x == datos.nodes[i].name){
            existente = 1;
          };
        };
        if(!existente){
          datos.nodes.push({name: x});
        };
      };
      function comprobarlinks(x) { //Comprobar exitencia y añadir nuevos/incrementar valor de enlaces
        var i, extiposector = 0;
        for(i=0;i<datos.links.length;i++){
          if(datos.links[i].source == x.Tipo && datos.links[i].target == x.Sector){ //Tipo -> Sector
            datos.links[i].value = (+datos.links[i].value + +x.Cantidad).toString();
            extiposector = 1;
          };
        };
        if(!extiposector){ //Tipo -> Sector
          datos.links.push({source: x.Tipo, target: x.Sector, value: x.Cantidad});
        };
        datos.links.push({source: x.Sector, target: x.Gas, value: x.Cantidad}); //Sector -> Gas
      };

      var nodeMap = {}; //Enlazar datos
      datos.nodes.forEach(function(x) { nodeMap[x.name] = x; });
      datos.links = datos.links.map(function(x) {
        return {
          source: nodeMap[x.source],
          target: nodeMap[x.target],
          value: x.value
        };
      });
   
    sankey
        .nodes(datos.nodes)
        .links(datos.links)
        .layout(0);
   
  // add in the links
    var link = svg.append("g").selectAll(".link")
        .data(datos.links)
        .enter().append("path")
        .attr("class", "link");

    link.filter(function(d,i){return d.dy > 0.0})
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .on("click",
        function (d){
          //actualizarlineal(d.source.name);
        });
   
  // add the link titles
    link.append("title")
          .text(function(d) {
          return d.source.name + " → " + 
                  d.target.name + "\n" + format(d.value); });
   
  // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(datos.nodes)
      .enter().append("g")
        .attr("class", "node")

    node.filter(function(d){return d.dy > 0.0})
        .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; })
      .on("click",
        function (d){
          actualizarlineal(d.name);
        });
   
  // add the rectangles for the nodes
    var node_rect = node.append("rect");

    node_rect.filter(function(d){return d.dy > 0.0})
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) { 
        return d.color = color(d.name.replace(/ .*/, "")); })
        .style("stroke", function(d) { 
        return d3.rgb(d.color).darker(2); });

    node_rect.append("title")
        .text(function(d) { 
        return d.name + "\n" + format(d.value); });
   
  // add in the title for the nodes
    node.append("text")
      .filter(function(d){return d.dy > 0.0})
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("font-size", "10")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
      .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");
  });
}

function actualizarsankey(d){
  document.getElementById("slider").value = d;
  document.getElementById("anio").innerHTML = d;
  try{
    actualizarlineal(document.getElementById("y_axis_text").innerHTML);
  }catch(e){};

  // load the data
  d3.csv("datos.csv", function(error, csv) {

	  var datos = {links:[], nodes:[]};
      csv.forEach(function(x) { if(x.Anio == d){ comprobarnodos(x.Tipo); comprobarnodos(x.Sector); comprobarnodos(x.Gas); comprobarlinks(x) } });
      function comprobarnodos(x) { //Comprobar existencia y añadir nuevos nodos
        var i, existente = 0;
        for(i=0;i<datos.nodes.length;i++){
          if(x == datos.nodes[i].name){
            existente = 1;
          };
        };
        if(!existente){
          datos.nodes.push({name: x});
        };
      };
      function comprobarlinks(x) { //Comprobar exitencia y añadir nuevos/incrementar valor de enlaces
        var i, extiposector = 0;
        for(i=0;i<datos.links.length;i++){
          if(datos.links[i].source == x.Tipo && datos.links[i].target == x.Sector){ //Tipo -> Sector
            datos.links[i].value = (+datos.links[i].value + +x.Cantidad).toString();
            extiposector = 1;
          };
        };
        if(!extiposector){ //Tipo -> Sector
          datos.links.push({source: x.Tipo, target: x.Sector, value: x.Cantidad});
        };
        datos.links.push({source: x.Sector, target: x.Gas, value: x.Cantidad}); //Sector -> Gas
      };

      var nodeMap = {}; //Enlazar datos
      datos.nodes.forEach(function(x) { nodeMap[x.name] = x; });
      datos.links = datos.links.map(function(x) {
        return {
          source: nodeMap[x.source],
          target: nodeMap[x.target],
          value: x.value
        };
      });
 
    sankey
        .nodes(datos.nodes)
        .links(datos.links)
        .layout(0);
 
  // modify the links
    var link = d3.selectAll(".link")
        .data(datos.links);

    link.filter(function(d,i){return d.dy > 0.0})
      .transition()
        .duration(1500)
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); });

    link.filter(function(d){return d.dy <=0.0})
      .attr("d", null)
      .style("stroke-width", null)
 
  // modify the nodes
    var node = d3.selectAll(".node")
        .data(datos.nodes);

    var node_visible = node.filter(function(d){return d.dy > 0.0})
      .transition()
      .duration(1500)
        .attr("transform", function(d) { 
		    return "translate(" + d.x + "," + d.y + ")"; });

    node_visible.select("rect")
        	.attr("height", function(d) { return d.dy; })
        	.attr("width", sankey.nodeWidth())
        	.style("fill", function(d) { 
		    	return d.color = color(d.name.replace(/ .*/, "")); })
        	.style("stroke", function(d) { 
		    	return d3.rgb(d.color).darker(2); })
          .select("title")
            .text(function(d) { 
            return d.name + "\n" + format(d.value); });

    node_visible.select("text")
          .attr("x", -6)
        	.attr("y", function(d) { return d.dy / 2; })
        	.attr("dy", ".35em")
          .attr("font-size", "10")
        	.attr("text-anchor", "end")
        	.attr("transform", null)
        	.text(function(d) { return d.name; })
      	.filter(function(d) { return d.x < width / 2; })
        	.attr("x", 6 + sankey.nodeWidth())
        	.attr("text-anchor", "start");

    var node_invisible = node.filter(function(d){return d.dy <= 0.0})
      .attr("transform", null);

    node_invisible.select("rect")
        .attr("height", null)
        .attr("width", null)
        .style("fill", null)
        .style("stroke", null)
        .select("title")
          .text(function(d) { 
          return d.name + "\n" + format(d.value); });

    node_invisible.select("text")
        .attr("x", null)
        .attr("y", null)
        .attr("dy", null)
        .attr("font-size", null)
        .attr("text-anchor", null)
        .text(null);
  });
}