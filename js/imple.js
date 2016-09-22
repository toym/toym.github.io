(function(alias){
	'use strict';

	var imple = alias.imple = {};
	imple.option = {};
	
	imple.init = function(){

		var rain_num   = +d3.select("#rain_num").node().value;
		var rain_speed = +d3.select("#rain_speed").node().value;
		var run_speed  = +d3.select("#run_speed").node().value;
		
		this.option = {
      "width":1000,
      "height":300,
			"rain_num":rain_num,
			"rain_speed":rain_speed,
			"run_speed":run_speed,
			"box_width":10,
			"box_height":50,
    };

		var option = this.option;

		//console.log(option);

		if (this.svg != null){this.svg.remove()}
		this.svg = d3.select("#result")
			.append("svg")
			.attr("id","svg_root")
			.attr("x",0)
			.attr("y",0)
			.attr("width",this.option.width)
			.attr("height",this.option.height)
			.attr("class","svg");
		
		this.rain_cod = [];
		for(var i=0;i<option.rain_num;i++){
			var startX = Math.floor( Math.random() * option.width );
			var startY = Math.floor( Math.random() * option.height );
			this.rain_cod.push({"x":startX,"y":startY});
		}

		this.box_cod = [{
			"x"     :0,
			"y"     :option.height-option.box_height,
			"width" :option.box_width,
			"height":option.box_height
		}];
		
		this.rain = this.svg
				.selectAll("circle")
				.data(this.rain_cod)
				.enter()
				.append("circle")
				.attr("class","rain")
				.attr("id",function(d,i){return "c"+i;})
				.attr("r",1)
				.attr("cx",function(d){return d.x;})
				.attr("cy",function(d){return d.y;})
				.attr("stroke","red")
		;

		this.box = this.svg
				.selectAll("rect")
				.data(this.box_cod)
				.enter()
				.append("rect")
				.attr({
					"x":function(d){return d.x;},
					"y":function(d){return d.y;},
					"width":function(d){return d.width;},
					"height":function(d){return d.height;},
					"class":"box",
				});
		
		this.hit = 0;
	}

	
	imple.run = function(data){

		imple.init();
		
		d3.selectAll("#rain_num").on("change",function(){
			imple.init();
		});

		d3.selectAll("#rain_speed").on("change",function(){
			imple.init();
		});

		d3.selectAll("#run_speed").on("change",function(){
			imple.init();
		});


		//console.log(this);


		var run = d3.select("#run");
		
		run.on("click", function(){
			imple.hit = 0;
			d3.timer(function(){
				imple.rain.attr("cy",function(d){
					d.y = d.y + imple.option.rain_speed;
					if(d.y > imple.option.height){
						d.y = 0;
					}
					return d.y;
				});
				
				imple.box.attr("x",function(d){
					d.x = d.x + imple.option.run_speed;
					if(d.x > imple.option.width){
						d.x = 0;
					}
					return d.x;
				});
				
				var box_xmin = imple.box_cod[0].x;
				var box_xmax = imple.box_cod[0].x + imple.box_cod[0].width;
				var box_ymin = imple.option.height - imple.box_cod[0].height;
				var box_ymax = imple.option.height;
				
				for(var i=0;i<imple.option.rain_num;i++){
					if(box_xmin <= imple.rain_cod[i].x && imple.rain_cod[i].x < box_xmax){
						if(box_ymin <= imple.rain_cod[i].y && imple.rain_cod[i].y < box_ymax){
							imple.rain_cod[i].y = -(imple.option.height - imple.rain_cod[i].y);
							imple.hit++;
						}
					}
				}
				d3.select("#nureguai")
					.html(imple.hit);
				
				if(box_xmax > imple.option.width){
					imple.box.attr("x",function(d){d.x = 0;return d.x})
					return true;
				}
			});
		});
		
		
	}
	
})(d3);
