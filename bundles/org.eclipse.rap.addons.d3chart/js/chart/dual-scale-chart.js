/*******************************************************************************
 * Copyright (c) 2013 EclipseSource and others. All rights reserved. This
 * program and the accompanying materials are made available under the terms of
 * the Eclipse Public License v1.0 which accompanies this distribution, and is
 * available at http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors: Ralf Sternberg - initial API and implementation
 ******************************************************************************/

d3chart.DualScaleChart = function(parent) {
	this._chart = new d3chart.Chart(parent, this);
	this._data = [];
	this._descriptionTotal = "Total"; 
	this._descriptionPercentage = "Percentage";
	this._colorTotal = "CornflowerBlue";
	this._colorPercentage = "red";
	this._font = "12px sans-serif";
	this._yAxisLabelWidth = 60;
	this._paddingRight = 20;
	this._percentageDigitsAfterDecimalPoint = 2;
	this._tooltipBoxWidth = 75;
	this._tooltipBoxHeight = 40;
	this._tooltipPadding = 15;
	this._displayGridLines = false;
	this._thresholdValue = 0.01;
};

d3chart.DualScaleChart.prototype = {

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
	
	setDescriptionTotal : function(descriptionTotal) {
		this._descriptionTotal = descriptionTotal;
	},
	
	setDescriptionPercentage : function (descriptionPercentage) {
		this._descriptionPercentage = descriptionPercentage;
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
	
	setColorTotal : function(colorTotal) {
		this._colorTotal = colorTotal;
	},
	
	setColorPercentage : function(colorPercentage) {
		this._colorPercentage = colorPercentage;
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
	
	setThresholdValue : function(thresholdValue) {
		this._thresholdValue = thresholdValue;
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
		var x = d3.scale.ordinal().rangeRoundBands([ 15, width - margin.right ], .1);
		var yPercentage = d3.scale.linear().range([ height, this._tooltipBoxHeight + this._tooltipPadding ]);
		var yTotal = d3.scale.linear().range([ height, this._tooltipBoxHeight + this._tooltipPadding ]);
		var xAxis = d3.svg.axis().scale(x).orient("bottom");
		var yAxisTotal = d3.svg.axis().scale(yTotal).orient("left").tickFormat(d3.format(".2s"));
		var yAxisPercentage = d3.svg.axis().scale(yPercentage).orient("right").ticks(10, "%");
		
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
		
		yTotal.domain(
				[0,d3.max(data, function(d) {
					return d[denominatorName];
				})]);
		
		var maxPercentageValue = d3.max(data, function(d) {return rate(d);});
		if(maxPercentageValue < this._thresholdValue) {
			yPercentage.domain([0, this._thresholdValue]);
		} else {
			yPercentage.domain([0, maxPercentageValue]);
		}

		/** Appends the x-axis */
		svg.append("g")
			.attr("class", "x_axis")
			.attr("transform", "translate(0," + height + ")").call(xAxis);

		/** Appends the y-axis (total) */
		svg.append("g")	
			.attr("class", "y_axis_total")
			.attr("transform", "translate("+ (width - margin.right) +", 0)")
			.call(yAxisPercentage).append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -10).attr("dy", ".71em")
			.attr("x", - margin.top)
			.style("text-anchor", "end")
			.text(this._descriptionPercentage);
		
		/** Appends the y-axis */
		svg.append("g")
			.attr("class", "y_axis_percentage")
			.call(yAxisTotal).append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6).attr("dy", ".71em")
			.attr("x", - margin.top)
			.style("text-anchor", "end")
			.text(this._descriptionTotal);
		
		/** Creates the grid lines (if this._displayGridLines is true) */
		if(this._displayGridLines) {
			
			/**
	  		 * Creates a new vertical axis, sets the scale to yTotal. 
	  		 * Also sets the orientation of the ticks and the tick format 
	  		 * so that the ticks are displayed horizontal grid lines. 
	  		 * tickFormat("") results in no text as labels are 
	  		 * displayed by the y-axis. 
	  		 */
			var gridLines = d3.svg.axis()
	  			.scale(yTotal).
	  			orient("right").
	  			tickSize(width - margin.right).
	  			tickFormat("");
			
			/** Appends the grid lines to the SVG */
			svg.append("g")
				.attr("class", "gridLines")
				.call(gridLines);
		}

	//Total bars
		/** Appends and creates the bars. */
		var barTotal = svg.selectAll(".barTotal")
			.data(data).enter()
			.append("rect")
			.attr("class", "barTotal")
			.attr("x", function(d) {return x(d.name);})
			.attr("width", x.rangeBand()*0.8)
			.attr("y", function(d) {return yTotal(d[denominatorName]);})
			.attr("height", function(d) {return height - yTotal(d[denominatorName]);})
			.attr("id", function(d,i) {return "totalBarNbr"+i; });
		
		/** Displays and hides the tooltip on mouseover-event
		 * and mouse-out, respectively */
		barTotal.on("mouseover", function(d,i) { mOver(d,i); });
		barTotal.on("mouseout",  function(d,i) {mOut(d,i); });
		
	//Percentage bars
		/** Appends and creates the bars. 
		The attribute "id" is used to identify the bars 
		(when the mouse hovers over a percentage text or a bar) */
		var barPercentage = svg.selectAll(".barPercentage")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "barPercentage")
			.attr("x", function(d) {return x(d.name) + x.rangeBand()/2;})
			.attr("width", x.rangeBand()/2)
			.attr("y", function(d) {return yPercentage((rate(d)));})
			.attr("height", function(d) {return height - yPercentage(rate(d));})
			.attr("id", function(d,i) {return "percentageBarNbr"+i;});
		
		/** Displays and hides the tooltip on mouseover-event
		 * and mouse-out, respectively */
		barPercentage.on("mouseover", function(d,i) { mOver(d,i); });
		barPercentage.on("mouseout" , function(d,i) { mOut(d,i); });
		
	//Mouseover region
		/** Adds a rectangle above the x-axis' label. A tooltip will be 
		 * dispalyed when the mouse hovers over this region so that the user 
		 * can display a tolltip even when the bars are not shown 
		 * (i.e. when numbers are (almost) 0) */
		var hoverRegion = svg.selectAll(".hoverRegion")
			.data(data).enter()
			.append("rect")
			.attr("class", "hoverRegion")
			.attr("x", function(d) {return x(d.name)})
			.attr("width", x.rangeBand())
			.attr("y", height-50)
			.attr("height", function(d) {return height;})
			.attr("id", function(d,i) {return "hoverRegionNbr"+i;})
			.style("opacity", 0.0);
		
		/** Displays and hides the tooltip on mouseover-event
		 * and mouse-out, respectively */
		hoverRegion.on("mouseover", function(d,i) {mOver(d,i);});
		hoverRegion.on("mouseout",  function(d,i) {mOut(d,i);});
		
//	//Percentage text above bars
//		/** Creates and sets the percentage text above the bars */
//		var n = this._percentageDigitsAfterDecimalPoint;
//		var percentage = svg.selectAll(".percentage")
//			.data(data)
//			.enter()
//			.append("text")
//			.attr("x", function(d) {return x(d.name) + x.rangeBand()/4;})
//			.attr("y", function(d) {return yPercentage((rate(d))) - 10;})
//			.style("text-anchor", "middle")
//			.text(function(d) {return d3.round(rate(d)*100, n) + "%";});
//	
//		/** Displays and hides the tooltip on mouseover-event
//		 * and mouse-out, respectively */
//		percentage.on("mouseover", function(d,i) { mOver(d,i); });
//		percentage.on("mouseout" , function(d,i) { mOut(d,i); });
			
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
		/** Sets the colorTotal */
		selection.selectAll(".barPercentage").style("fill", this._colorPercentage);
		selection.selectAll(".barTotal").style("fill", this._colorTotal);
		
		/** Hides the path. Coordinate system is black if this line is omitted */
		selection.selectAll("path").style("display", "none");
		
		/** Styles the x-axis. */
		selection.selectAll(".x_axis")
			.style("fill", "black")
			//.style("stroke", "black")
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
		var n = this._percentageDigitsAfterDecimalPoint;

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
			var myBarPercentage = d3.select("#percentageBarNbr" +i);
			var myBarTotal = d3.select("#totalBarNbr"+i); 
			
			var barY = 0;
			if(parseInt(myBarPercentage.attr("y")) > parseInt(myBarTotal.attr("y"))) {
				barY = parseInt(myBarTotal.attr("y"));
			} else {
				barY = parseInt(myBarPercentage.attr("y"));
			}
			
			//Creates a black border around the specified bar
			d3.select("#percentageBarNbr" +i).style("stroke", "black");
			d3.select("#totalBarNbr"+i).style("stroke", "black");
			//Set a tooltip text
			tooltipTextLine1.style("display", "block");
			tooltipTextLine1.text(denominatorName + ": " + d[denominatorName]);
			tooltipTextLine1.attr("y", barY - tooltipPadding + tooltipBoxHeight/2 - 10 + 'px')
					   .attr("x", (
							parseInt(myBarPercentage.attr("x")) + 
							yAxisLabelWidth) 
							+"px");
			var percentageValue = d3.round(rate(d)*100, n);
			tooltipTextLine2.style("display", "block");
			tooltipTextLine2.text(numeratorName+ ": " + d[numeratorName] + " ("+ percentageValue +"%)");
			tooltipTextLine2.attr("y", barY - tooltipPadding + tooltipBoxHeight/2 + 10 + 'px')
					   .attr("x", (
							parseInt(myBarPercentage.attr("x")) + 
							yAxisLabelWidth) 
							+"px");
			//set a tooltip box
			tooltipBox.attr("y", barY - tooltipPadding  + 'px')
					  .attr("x", (
						parseInt(myBarPercentage.attr("x")) + 
						yAxisLabelWidth
						- (parseInt(tooltipBoxWidth)) / 2)
						+"px");
			tooltipBox.style("display", "block");		
		}
		
		/** Removes the black border around the specified bar 
		 * as well as the tooltip's elements. */
		function mOut(d,i) {
			var myBarPercentage = d3.select("#percentageBarNbr" +i);
			var myBarTotal = d3.select("#totalBarNbr"+i);
			//remove the black border of the bar
			myBarPercentage.style("stroke", "none");
			myBarTotal.style("stroke", "none");
			//make the tooltip's elements invisible
			tooltipTextLine1.style("display", "none");
			tooltipTextLine2.style("display", "none");
			tooltipBox.style("display", "none");
		}
	},
};

// TYPE HANDLER

rap.registerTypeHandler("d3chart.DualScaleChart", {

	factory : function(properties) {
		var parent = rap.getObject(properties.parent);
		return new d3chart.DualScaleChart(parent);
	},

	destructor : "destroy",

	properties : [ "values", "colorTotal", "colorPercentage", "descriptionTotal", "descriptionPercentage", "font", "yAxisLabelWidth", 
	               "paddingRight", "percentageDigitsAfterDecimalPoint", "tooltipBoxWidth", 
	               "tooltipBoxHeight", "tooltipPadding", "displayGridLines", "thresholdValue"],
	
	events : [ "Selection" ]

});
