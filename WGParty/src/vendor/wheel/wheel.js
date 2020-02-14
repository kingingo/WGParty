var padding, data, svg, container, vis, pie, arc, arcs;
var init=false;

	function initWheel(){
	 		if(!init){
	 			padding = {top:20, right:40, bottom:0, left:0},
	            w = 500 - padding.left - padding.right,
	            h = 500 - padding.top  - padding.bottom,
	            radius = Math.min(w, h)/2,
	            rotation = 0,
	            oldrotation = 0,
	            picked = 100000,
	            oldpick = [],
	            color = d3.scale.category20();
	       
	        data = [
	                    {"label":"Vodka",  "value":1,  pic:"vodka.png"}, 
	                    {"label":"Jägermeister",  "value":1,  pic:"jaegermeister.png"},
	                    {"label":"Teqila",  "value":1,  pic:"tequila.png"},
	                    {"label":"Whiskey",  "value":1,  pic:"whiskey.png"}, 
	                    {"label":"Berliner Luft",  "value":1,  pic:"berliner_luft.png"}, 
	                    {"label":"Bergman Bier",  "value":1,  pic:"bergmann.png"},
	                    {"label":"Astra Rakete",  "value":1,  pic:"astra.png"}, 
	                    {"label":"Gin",  "value":1,  pic:"gin.png"}, 
	                    {"label":"Rum",  "value":1,  pic:"rum.png"},
	                    {"label":"Glühwein", "value":1, pic:"gluehwein.png"},
	        ];


	        svg = d3.select('#chart')
	            .append("svg")
	            .data([data])
	            .attr("width",  w + padding.left + padding.right)
	            .attr("height", h + padding.top + padding.bottom);

	        container = svg.append("g")
	            .attr("class", "chartholder")
	            .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

	        vis = container
	            .append("g");
	            
	        pie = d3.layout.pie().sort(null).value(function(d){return 1;});

	        // declare an arc generator function
	        arc = d3.svg.arc().outerRadius(radius);

	        // select paths, use arc generator to draw
	        arcs = vis.selectAll("g.slice")
	            .data(pie)
	            .enter()
	            .append("g")
	            .attr("class", "slice");
	            

	        arcs.append("path")
	            .attr("fill", function(d, i){ return color(i); })
	            .attr("d", function (d) { return arc(d); });

	        // add the text
	        arcs.append("text").attr("transform", function(d){
	                d.innerRadius = 0;
	                d.outerRadius = radius;
	                d.angle = (d.startAngle + d.endAngle)/2;
	                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
	            })
	            .attr("text-anchor", "end")
	            .text( function(d, i) {
	                return ""+data[i].label;
	            });

	        d3.select("#chart").attr("style","");
	        d3.select("#question").attr("style","display:none");
	        
	      // make arrow
	        svg.append("g")
	            .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
	            .append("path")
	            .attr("d", "M-" + (radius*.15) + ",0L0," + (radius*.05) + "L0,-" + (radius*.05) + "Z")
	            .style({"fill":"black"});

	        // draw spin circle
	        container.append("circle")
	            .attr("cx", 0)
	            .attr("cy", 0)
	            .attr("r", 60)
	            .style({"fill":"white","cursor":"pointer"});

	        // spin text
	        container.append("text")
	            .attr("x", 0)
	            .attr("y", 15)
	            .attr("text-anchor", "middle")
	            .text("SPIN")
	            .style({"font-weight":"bold", "font-size":"30px"});
	 		}
	 		init=true;
		}

		function activateWheel(){
	        container.on("click", spin);
		}

        function spin(d){
            
            container.on("click", null);

            // all slices have been seen, all done
// console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
            if(oldpick.length == data.length){
                console.log("done");
                container.on("click", null);
                return;
            }

            var  ps       = 360/data.length,
                 pieslice = Math.round(1440/data.length),
                 rng      = Math.floor((Math.random() * 1440) + 360);
                
            rotation = (Math.round(rng / ps) * ps);
            
            picked = Math.round(data.length - (rotation % 360)/ps);
            picked = picked >= data.length ? (picked % data.length) : picked;


            if(oldpick.indexOf(picked) !== -1){
                d3.select(this).call(spin);
                return;
            } else {
                oldpick.push(picked);
            }

            rotation += 90 - Math.round(ps/2);

            vis.transition()
                .duration(3000)
                .attrTween("transform", rotTween)
                .each("end", function(){

                    // mark question as seen
                    d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                        .attr("fill", "#111");

                    // populate question
                    d3.select("#question").attr("style","");
                    d3.select("#question img").attr("src","images/alk/"+data[picked].pic);
                    d3.select("#question strong").text(data[picked].label);
                    oldrotation = rotation;
                
                    container.on("click", spin);
                    d3.select("#chart").attr("style","display:none");
                    d3.select("#chart").html("");
                    init=false;
                });
        }

        function rotTween(to) {
          var i = d3.interpolate(oldrotation % 360, rotation);
          return function(t) {
            return "rotate(" + i(t) + ")";
          };
        }
        
        function getRandomNumbers(){
            var array = new Uint16Array(1000);
            var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);

            if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
                window.crypto.getRandomValues(array);
            } else {
                // no support for crypto, get crappy random numbers
                for(var i=0; i < 1000; i++){
                    array[i] = Math.floor(Math.random() * 100000) + 1;
                }
            }

            return array;
        }