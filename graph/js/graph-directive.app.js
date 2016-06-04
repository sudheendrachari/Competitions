(function () {
	 'use strict';
	angular.module('app')
		.directive('myGraph', myGraph);
		myGraph.$inject = [];
		function myGraph() {
		    const directive = {
		            link: link,
		            scope:{
		            	data : '=',
		            	render: '='
		            },
		            template: '<div id="graph" style="background:white" > </div>',
		            restrict: 'E'
		        };
		    return directive;

		    function link(scope, element, attrs) {
	            let d3 = window.d3, width = 960,   height = 500;

            	let svg = d3.select("#graph").append("svg").attr("width", width).attr("height", height);
	            function reDraw() {
	            	svg.attr("width", window.innerWidth ).attr("height", 500);  
            		renderGraph(scope.data);
	            }
	            window.addEventListener('resize', reDraw);
	            scope.$watch('render', reDraw);	
	            function renderGraph(graphData) {
	            	svg.selectAll('*').remove();
	            	let color = d3.scale.category20();

	            	let force = d3.layout.force()
	            	    .charge(-500)
	            	    .linkDistance(link => graphData.nodes[0].value +  link.value )
	            	    .size([width, height]);

	            	    force.nodes(graphData.nodes)
	            	        .links(graphData.links)
	            	        .start()
	            	        .friction(0.9);

	            	    let link = svg.selectAll(".link")
	            	        .data(graphData.links)
	            	        .enter().append("line")
	            	        .attr("class", "link")
	            	        .style("stroke-width", 1);
	            	    let gnodes = svg.selectAll('g.gnode')
	            	       .data(graphData.nodes)
	            	       .enter()
	            	       .append('g')
	            	       .classed('gnode', true);
	            	    let node = gnodes.append("circle")
	            	        .attr("class", "node")
	            	        .attr("r", d => d.value)
	            	        .style("fill", d => color(d.group))
	            	        .call(force.drag);

	            	    gnodes.append("title")
	            	        .text(d => d.name);

	            	    force.on("tick", function() {
	            	        link.attr("x1", d => d.source.x)
	            	            .attr("y1", d => d.source.y)
	            	            .attr("x2", d => d.target.x)
	            	            .attr("y2", d => d.target.y);

	            	        node.attr("cx", d => d.x)
	            	            .attr("cy", d => d.y);
	            	    });
	            }
		    }
		}
})();