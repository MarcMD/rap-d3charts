/*******************************************************************************
 * Copyright (c) 2013 EclipseSource and others. All rights reserved. This
 * program and the accompanying materials are made available under the terms of
 * the Eclipse Public License v1.0 which accompanies this distribution, and is
 * available at http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors: Ralf Sternberg - initial API and implementation
 ******************************************************************************/

d3chart.VerticalBarChart = function(parent) {
	this._chart = new d3chart.Chart(parent, this);
	this._data = [];
	this._description = "Fraction";
	this._color = "CornflowerBlue";
	this._font = "12px sans-serif";
	this._yAxisLabelWidth = 60;
	this._paddingRight = 20;
	this._percentageDigitsAfterDecimalPoint = 5;
	this._tooltipBoxWidth = 75;
	this._tooltipBoxHeight = 40;
	this._tooltipPadding = 15;
	this._displayGridLines = false;
};

d3chart.VerticalBarChart.prototype = {

	destroy : function() {
		this._chart.destroy();
	},

	initialize : function() {
		this._layer = this._chart.getLayer("layer");
	},

	render : function() {
		this._createSegment(this._layer);
	},
	
	setValues : function (values) {
		this._data = values;
	},
	
	setDescription : function (description) {
		this._description = description;
	},
	
	setFont : function (font) {
		this._font = font;
	},
	
	setYAxisLabelWidth : function(yAxisLabelWidth) {
		this._yAxisLabelWidth = yAxisLabelWidth;
	},
	
	setPaddingRight : function(paddingRight) {
		this._paddingRight = paddingRight;
	},
	
	setColor : function(color) {
		this._color = color;
	},
	
	setPercentageDigitsAfterDecimalPoint : function(percentageDigitsAfterDecimalPoint) {
		this._percentageDigitsAfterDecimalPoint = percentageDigitsAfterDecimalPoint;
	},
	
	setTooltipBoxWidth : function(tooltipBoxWidth) {
		this._tooltipBoxWidth = tooltipBoxWidth;
	}, 
	
	setTooltipBoxHeight : function(tooltipBoxHeight) {
		this._tooltipBoxHeight = tooltipBoxHeight;
	}, 
	
	setTooltipPadding : function(tooltipPadding) {
		this._tooltipPadding = tooltipPadding;
	}, 
	
	setDisplayGridLines : function(displayGridLines) {
		this._displayGridLines = displayGridLines;
	},
	
	_createSegment : function(selection) {

		var data = this._data;

	//Layout
		/** Sets the layout data */
		var margin = {
			top : this._tooltipBoxHeight + this._tooltipPadding,
			right : this._paddingRight,
			bottom : 30,
			left : this._yAxisLabelWidth
		}
		var width = this._chart._width - margin.left - margin.right;
		var height = this._chart._height - margin.top - margin.bottom;
		
	//Coordinate system
		/** Creates the axes and their scale */
		var x = d3.scale.ordinal().rangeRoundBands([ 15, width ], .1);
		var y = d3.scale.linear().range([ height, this._tooltipBoxHeight + this._tooltipPadding ]);
		var xAxis = d3.svg.axis().scale(x).orient("bottom");
		var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10, "%");
		
		/** Retrieves the names of the numerator and the denominator */
		var factorNames = d3.keys(data[0]).filter(function(key) {
			return key !== "name";
		});
		var numeratorName = factorNames[0];
		var denominatorName = factorNames[1];

		/** Creates the SVG that will contain this chart's elements */
		var svg = selection.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height",	height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		x.domain(data.map(function(d) {
			return d.name;
		}));
		y.domain([ 0, d3.max(data, function(d) {
			return (rate(d));
		}) ]);

		/** Appends the x-axis */
		svg.append("g")
			.attr("class", "x_axis")
			.attr("transform", "translate(0," + height + ")").call(xAxis);

		/** Appends the y-axis */
		svg.append("g")
			.attr("class", "y_axis")
			.call(yAxis).append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6).attr("dy", ".71em")
			.attr("x", - margin.top)
			.style("text-anchor", "end")
			.text(this._description);
		
		/** Creates the grid lines (if this._displayGridLines is true) */
		if(this._displayGridLines) {
			
			/**
	  		 * Creates a new vertical axis, sets the scale to y. 
	  		 * Also sets the orientation of the ticks and the tick format 
	  		 * so that the ticks are displayed horizontal grid lines. 
	  		 * tickFormat("") results in no text as labels are 
	  		 * displayed by the y-axis. 
	  		 */
			var gridLines = d3.svg.axis()
	  			.scale(y).
	  			orient("right").
	  			tickSize(width).
	  			tickFormat("");
			
			/** Appends the grid lines to the SVG */
			svg.append("g")
				.attr("class", "gridLines")
				.call(gridLines);
		}

	//Bars
		/** Appends and creates the bars. 
		The attribute "id" is used to identify the bars 
		(when the mouse hovers over a percentage text or a bar) */
		var bar = svg.selectAll(".bar")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", function(d) {return x(d.name);})
			.attr("width", x.rangeBand())
			.attr("y", function(d) {return y((rate(d)));})
			.attr("height", function(d) {return height - y(rate(d));})
			.attr("id", function(d,i) {return "barNbr"+i;});
		
		/** Displays and hides the tooltip on mouseover-event
		 * and mouse-out, respectively */
		bar.on("mouseover", function(d,i) { mOver(d,i); });
		bar.on("mouseout" , function(d,i) { mOut(d,i); });
		
	//Percentage text above bars
		/** Creates and sets the percentage text above the bars */
		var n = this._percentageDigitsAfterDecimalPoint;
		var percentage = svg.selectAll(".percentage")
			.data(data)
			.enter()
			.append("text")
			.attr("x", function(d) {return x(d.name) + x.rangeBand()/2;})
			.attr("y", function(d) {return y((rate(d))) - 10;})
			.style("text-anchor", "middle")
			.text(function(d) {return d3.round(rate(d)*100, n) + "%";});
	
		/** Displays and hides the tooltip on mouseover-event
		 * and mouse-out, respectively */
		percentage.on("mouseover", function(d,i) { mOver(d,i); });
		percentage.on("mouseout" , function(d,i) { mOut(d,i); });
			
	//Tooltip
		/** Sets variables that are used for tooltip */
		var tooltipBoxWidth = this._tooltipBoxWidth;
		var tooltipBoxHeight = this._tooltipBoxHeight;
		var tooltipPadding = this._tooltipPadding;
		var yAxisLabelWidth = this._yAxisLabelWidth;
		
		/** The box that contains the text. The box will be relocated 
		 * on mouseover-event and hidden on mouseout-event. */
		var tooltipBox = selection.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", tooltipBoxWidth)
			.attr("height", tooltipBoxHeight)
			.attr("dy", ".35em")
			.style("fill", "white")
			.style("opacity", "0.8")
			.style("stroke", "black")
			.style("stroke-width", "1")
			.style("display", "none");
	
		/** The text that will be displayed in the tooltip. The text 
		 * will be relocated on mouseover-event and hidden on mouseout-event. */
		var tooltipTextLine1 = selection.append("text")
			.attr("x", width/2)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("fill", "black")
			.style("text-anchor", "middle")
			.style("display", "none");
		var tooltipTextLine2 = selection.append("text")
			.attr("x", width/2)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("fill", "black")
			.style("text-anchor", "middle")
			.style("display", "none");

	//Style using CSS
		/** Sets the color */
		selection.selectAll(".bar").style("fill", this._color);
		
		/** Hides the path. Coordinate system is black if this line is omitted */
		selection.selectAll("path").style("display", "none");
		
		/** Styles the x-axis. */
		selection.selectAll(".x_axis")
			.style("fill", "black")
			.style("stroke", "black")
			.style("shape-rendering", "crispEdges");

		/** Styles the text */
		selection.selectAll("text")
			.style("stroke", "black")
			.style("font", this._font);
		
		/** Styles Grid lines. If any. */ 
		selection.selectAll(".gridLines")
			.selectAll(".tick")
			.style("stroke", "#777")
			.style("stroke-dasharray", "2,2");
		
	//Functions
		/** Returns the percentage value */
		function rate(d) {
			var number; 
			if(d[denominatorName] == 0) {
				return 0;
			} else {
				return (d[numeratorName] / d[denominatorName]);
			}
		}
		
		/** Creates a black border around the specified bar. 
		 * Also relocates and shows the tooltip and its text when called by 
		 * percentage.on("mouseover", ...) and bar.on("mouseover", ...) */
		function mOver(d,i) {
			var myBar = d3.select("#barNbr" +i);
			
			//Creates a black border around the specified bar
			d3.select("#barNbr" +i).style("stroke", "black");
			//Set a tooltip text
			tooltipTextLine1.style("display", "block");
			tooltipTextLine1.text(denominatorName + ": " + d[denominatorName]);
			tooltipTextLine1.attr("y", parseInt(myBar.attr("y")) - tooltipPadding + tooltipBoxHeight/2 - 10 + 'px')
					   .attr("x", (
							parseInt(myBar.attr("width"))/2 +
							parseInt(myBar.attr("x")) + 
							yAxisLabelWidth) 
							+"px");
			tooltipTextLine2.style("display", "block");
			tooltipTextLine2.text(numeratorName+ ": " + d[numeratorName]);
			tooltipTextLine2.attr("y", parseInt(myBar.attr("y")) - tooltipPadding + tooltipBoxHeight/2 + 10 + 'px')
					   .attr("x", (
							parseInt(myBar.attr("width"))/2 +
							parseInt(myBar.attr("x")) + 
							yAxisLabelWidth) 
							+"px");
			//set a tooltip box
			tooltipBox.attr("y", parseInt(myBar.attr("y")) - tooltipPadding  + 'px')
					  .attr("x", (
						parseInt(myBar.attr("x")) + 
						parseInt(myBar.attr("width"))/2 +
						yAxisLabelWidth
						- (parseInt(tooltipBoxWidth)) / 2)
						+"px");
			tooltipBox.style("display", "block");		
		}
		
		/** Removes the black border around the specified bar 
		 * as well as the tooltip's elements. */
		function mOut(d,i) {
			var myBar = d3.select("#barNbr" +i);
			//remove the black border of the bar
			myBar.style("stroke", "none");
			//make the tooltip's elements invisible
			tooltipTextLine1.style("display", "none");
			tooltipTextLine2.style("display", "none");
			tooltipBox.style("display", "none");
		}
	},
};

// TYPE HANDLER

rap.registerTypeHandler("d3chart.VerticalBarChart", {

	factory : function(properties) {
		var parent = rap.getObject(properties.parent);
		return new d3chart.VerticalBarChart(parent);
	},

	destructor : "destroy",

	properties : [ "values", "color", "description", "font", "yAxisLabelWidth", 
	               "paddingRight", "percentageDigitsAfterDecimalPoint", "tooltipBoxWidth", 
	               "tooltipBoxHeight", "tooltipPadding", "displayGridLines"],
	
	events : [ "Selection" ]

});
