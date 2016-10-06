"use strict";

var app = app || {};

app.main = {
	//properties
	WIDTH: 640,
	HEIGHT: 480,
	
	animationID: 0,
	
	canvas: undefined,
	ctx: undefined,
	mouse: undefined, 
	used: undefined,
	
	/*window.onload = function(){
		this.init();
	},*/
	
	init : function() {
		console.log("app.main.init() called");
		// initialize properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		this.used = new Array();
		
		//Event Hook Ups
		this.canvas.onmousemove = this.doMouseMove.bind(this);
		//this.canvas.onmousemove = this.drawFairy.bind(this);
		//this.canvas.onmousedown = this.doMouseDown.bind(this);
		
		// start the update loop
		this.update();
	},
	
	update : function(){
		this.ctx.fillStyle = "CornflowerBlue";
		this.ctx.fillRect(0,0,this.WIDTH, this.HEIGHT);
		
		this.animationID = requestAnimationFrame(this.update.bind(this));
		
		
		
		this.canvas.parent = this;
		
		this.canvas.onmousemove = function(e){
			var loc = this.parent.windowToCanvas(this.ctx, e.clientX, e.clientY);
		    this.parent.ctx.clearRect(0, 0, this.parent.ctx.width, this.parent.ctx.height);
		    //drawText();

		    this.parent.ctx.save();
				//this.parent.ctx.globalCompositeOperation = selectElement.value;
				this.parent.ctx.beginPath();
				this.parent.ctx.arc(loc.x, loc.y, 100, 0, Math.PI*2, false);
				this.parent.ctx.fillStyle = 'orange';
				this.parent.ctx.stroke();
				this.parent.ctx.fill();
		    this.parent.ctx.restore();
		}
		
		this.moveRect();
		//this.doMouseMove(this.canvas.onmousemove);
		
		
		//this.drawFairy(this.mouse);
	},
	
	drawFairy : function(mouse){
		this.ctx.save();
			this.ctx.beginPath();
			this.ctx.fillStyle = "#000";
			this.ctx.arc(mouse.x, mouse.y, 25, 0, Math.PI*2, false);
			this.ctx.closePath();
			this.ctx.fill();
		this.ctx.restore();
	},
	
	doMouseMove : function(e){
		this.mouse = getMouse(e);
		this.drawFairy(this.mouse.x, this.mouse.y);
		console.log("(mouse.x,mouse.y)=" + this.mouse.x + " , " + this.mouse.y);
	},
	
	doMouseDown : function(e){
		this.mouse = getMouse(e);
		console.log("(mouse.x,mouse.y)=" + this.mouse.x + " , " + this.mouse.y);	
		this.drawFairy(this.mouse.x, this.mouse.y);
	},
	
	windowToCanvas : function(canvas, x, y){
		var bbox = this.canvas.getBoundingClientRect();
		return { x: x - bbox.left * (this.canvas.width  / bbox.width),
				y: y - bbox.top  * (this.canvas.height / bbox.height)
			};
	},
	
	//var used = new Array();
    //http://www.experimentgarden.com/2010/01/random-vector-flowers-grown-using.html
    getRandNum : function(){
       var test = 0;
       while(test==0)
       {
         test = (Math.floor(Math.random()*16)+1);
         
         for(var j = 0; j < used.length; j++)
         {
           if(used[j]==test)
           {
             test = 0;
             break;
           }
         }
         used[used.length] = test;
       }
       return test;
     },
     
	drawFlowers : function(){
		var output = "";
		var formerPosition = -15;
		
		for(var i = 0; i < 15; i++)
		{
		  output += "<div class='grass"+getRandNum()+"' style='left: "+formerPosition+"px;'><"+"/div>";
		  formerPosition += (Math.floor(Math.random()*50)+50);
		  formerPosition = formerPosition % 620;
		  document.write(output);
		}
	 },
	 
	 moveRect : function(){
		 var x,y = 200;
		 this.ctx.save();
		 this.ctx.fillStyle = 'orange';
		 this.ctx.fillRect(x, y, x + 200, y + 200);
		 if(myKeys.keydown[myKeys.KEYBOARD.KEY_UP]){
			 x--;
		 }
		 this.ctx.restore();
	 }
     /*var output = "";
     var formerPosition = -15;
     
     for(var i = 0; i < 15; i++)
     {
       output += "<div class='grass"+getRandNum()+"' style='left: "+formerPosition+"px;'><"+"/div>";
       formerPosition += (Math.floor(Math.random()*50)+50);
       formerPosition = formerPosition % 620;
     }*/
    
     //document.write(output);
	
	
	
	

	
	
}