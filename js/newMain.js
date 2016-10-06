"use strict";

var app = app || {};

app.newMain = {
	
	WIDTH: 700,
	HEIGHT: 500,
	FLOWER: Object.freeze({
		NUM_START:20,
		RADIUS: 10,
		MAX_SPEED: 150,
	}),
	
	canvas: undefined,
	ctx: undefined,
	//mouse: undefined,
	lastTime: 0,
	debug: false,
	paused: false,
	gameOver: false, 
	animationID: 0,
	
	notE: undefined,
	
	Emitter: undefined,
	
	puslar: undefined,
	usingCircles: false,
	usingSquares: false,
	
	gameState: undefined,
	roundScore:0,
	totalScore:0,
	
	colors: ["#FD5B78","#FF6037","#FF9966","#FFFF66","#66FF66","#50BFE6","#FF6EFF","#EE34D2"],
	
	FLOWER_STATE: Object.freeze({
		BORN: 0,
		ALMOST: 1,
		BLOOM: 2
	}),
	
	GAME_STATE: Object.freeze({
		BEGIN: 0,
		DEFAULT: 1,
		ROUND_OVER: 2,
		REPEAT_LEVEL: 3,
		BLOOMING:4,
		END: 5
	}),
	
	flowers : [],
	numFlowers : this.NUM_START,
	
	
	init: function(){
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		this.canvas.onmousemove = this.notE;
		
		this.numFlowers = this.FLOWER.NUM_START;
		this.flowers = this.makeFlowers(this.numFlowers);
		
		this.gameState = this.GAME_STATE.BEGIN;
		
		this.canvas.onmousedown = this.doMouseDown.bind(this)
		
		this.update();
	},
	
	update: function(){
		this.animationID = requestAnimationFrame(this.update.bind(this));
		
		var dt = this.calculateDeltaTime();
		
		this.moveFlowers(dt);
		
		this.ctx.fillStyle = "#50c878";
		this.ctx.fillRect(0,0, this.WIDTH, this.HEIGHT);
		
		this.drawFlowers(this.ctx);
		//this.pulsar.updateAndDraw(this.ctx,{x:200,y:200});
		
		var time = 60*2;
		var display = document.querySelector('#timer');
		this.startTimer(time,display)
	},
	
	
	makeFlowers:function(num){
		
		var flowerMove = function(dt){
			this.x += this.xSpeed * this.speed * dt;
			this.y += this.ySpeed * this.speed * dt;
		}
		
		var flowerDraw = function(ctx){
			ctx.save();
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2,false);
			ctx.closePath();
			ctx.fillStyle = this.fillStyle;
			ctx.fill();
			ctx.restore();
		};
		
		var array = [];
		
		for(var i = 0; i < num; i++){
			var f = {};
			
			f.x = getRandom(this.FLOWER.RADIUS * 2, this.WIDTH - this.FLOWER.RADIUS * 2);
			f.y = getRandom(this.FLOWER.RADIUS * 2, this.HEIGHT - this.FLOWER.RADIUS * 2);
			
			f.radius = this.FLOWER.RADIUS;
			
			var randomVector = getRandomUnitVector();
			f.xSpeed = randomVector.x;
			f.ySpeed = randomVector.y;
			
			f.speed = this.FLOWER.MAX_SPEED;
			f.fillStyle = "green";
			//f.fillStyle = this.colors[i % this.colors.length];
			f.state = this.FLOWER_STATE.NORMAL;
			//f.lifetime = 0;
			
			var pulsar = new this.Emitter();
			pulsar.red = 185;
			pulsar.green = Math.floor(getRandom(0,205));
			pulsar.blue = Math.floor(getRandom(0,255));
			pulsar.minXspeed = pulsar.minYspeed = -0.25;
			pulsar.maxXspeed = pulsar.maxYspeed = 0.25;
			pulsar.lifetime = 500;
			pulsar.expansionRate = 0.05;
			pulsar.numParticles = 100; // you could make this smaller!
			pulsar.xRange=1;
			pulsar.yRange=1;
			pulsar.useCircles = false;
			pulsar.useSquares = true;
			pulsar.createParticles({x:-100,y:-100});
			f.pulsar = pulsar;
			
			f.draw = flowerDraw;
			f.move = flowerMove;
			
			array.push(f);
		}
		return array;
	},
	
	drawFlowers: function(ctx){
		if(this.gameState == this.GAME_STATE.ROUND_OVER) this.ctx.globalAlpha = 0.25;
		for(var i = 0; i < this.flowers.length; i++){
			var f = this.flowers[i];
			if(f.state === this.FLOWER_STATE.BLOOM) continue;
			
			if (f.pulsar){
				 f.pulsar.updateAndDraw(ctx,{x:f.x,y:f.y})
			}
			
			f.draw(ctx);
		}
	},
	
	moveFlowers: function(dt){
		for(var i = 0; i < this.flowers.length; i++){
			var f = this.flowers[i]
			if(f.state === this.FLOWER_STATE.BLOOM) continue;
			
			f.move(dt)
			
			if(this.circleLeftRight(f)) {
				f.xSpeed *= -1;
				f.move(dt);
			}
			if(this.circleHitTopBottom(f)) {
				f.ySpeed *= -1;
				f.move(dt);
			}
		}
	},
	
	circleLeftRight: function(f){
		if(f.x <= f.radius || f.x >= this.WIDTH - f.radius){
			return true;
		}
	},
	
	circleHitTopBottom: function(f){
		if(f.y <= f.radius || f.y >= this.HEIGHT - f.radius){
			return true;
		}
	},
	
	drawHUD: function(ctx){
		ctx.save();
			
			//draw the score
			this.fillText(this.ctx, "Minimum: " + this.numFlowers/5, 20,36, "14pt courier", "#ddd") 
			this.fillText(this.ctx, "This Round "+ this.roundScore + " of " + this.numFlowers, 20, 20, "14pt courier", "#ddd");
			this.fillText(this.ctx, "Total Score: "+ this.totalScore, this.WIDTH - 200, 20, "14pt courier", "#ddd");
			
			// NEW
			if(this.gameState == this.GAME_STATE.BEGIN){
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				//this.fillText(this.ctx, "You need to explode at least 1/5th (round up) of the circles to advance", this.WIDTH/2, this.HEIGHT/2.35, "10pt courier", "white");
				//this.fillText(this.ctx, "To begin, click a circle", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "white");
				//this.exhaust.updateAndDraw(this.ctx,{x:100,y:100});
				//this.pulsar.updateAndDraw(this.ctx,{x:540,y:100});
			} // end if
		
			// NEW
			if(this.gameState == this.GAME_STATE.ROUND_OVER){
				ctx.save();
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				this.fillText(this.ctx, "Round Over", this.WIDTH/2, this.HEIGHT/2 - 40, "30pt courier", "red");
				this.fillText(this.ctx, "Click to continue", this.WIDTH/2, this.HEIGHT/2, "30pt courier", "red");
				//this.fillText(this.ctx, "Next round there are " + (this.numCircles + 5) + " circles", this.WIDTH/2 , this.HEIGHT/2 + 35, "20pt courier", "#ddd");
			} // end if
			
			if(this.gameState == this.GAME_STATE.END){
				ctx.save();
				this.drawGameOver();
			}
			
		ctx.restore(); // NEW
	},
	
	doMouseDown : function(e){
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			this.gameState = this.GAME_STATE.DEFAULT;
			this.reset();
			return;
		}
		
		var mouse = getMouse(e);
		this.checkCircleClicked(mouse);
	},
	
	checkCircleClicked: function(mouse){
		for(var i = this.flowers.length -1; i >= 0; i--){
			var f = this.flowers[i];
			if(pointInsideCircle(mouse.x,mouse.y,f)){
				f.xSpeed = f.ySpeed = 0;
				f.fillStyle = this.colors[i % this.colors.length];
				//f.state = this.FLOWER_STATE.BLOOM;
				
				
			}
		}
	},
	
	/*checkForCollisions: function(){
		if(this.gameState == this.GAME_STATE.ROUND_OVER){
			
			var isOver = true;
			/*for(var i = 0; i<this.flowers.length;i++){
				var f = this.flowers[i];
				if(f.state != this.FLOWER_STATE.NORMAL && f.state != this.FLOWER_STATE.DONE){
					isOver = false;
					break;
				}
			}
			
			if(isOver){
				this.gameState = this.GAME_STATE.ROUND_OVER;
			}
			
		}
	},*/
	
	calculateDeltaTime: function(){
		// what's with (+ new Date) below?
		// + calls Date.valueOf(), which converts it from an object to a 	
		// primitive (number of milliseconds since January 1, 1970 local time)
		var now,fps;
		now = (+new Date); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
	
	startTimer : function(duration, display) {
		var timer = duration, minutes, seconds;
		setInterval(function () {
			minutes = parseInt(timer / 60, 10)
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			display.textContent = minutes + ":" + seconds;

			if (--timer < 0) {
				timer = duration;
				this.gameState = this.GAME_STATE.ROUND_OVER
			}
		}, 1000);
	},
	
	reset: function(){
		this.numFlowers += 5;
		this.roundScore = 0;
		this.flowers = this.makeFlowers(this.numFlowers);
	},
	
	resumeGame: function(){
		
		//stop the animation loop, just in case it's running
		cancelAnimationFrame(this.animationID);
		
		this.paused = false;
		
		//this.sound.playBGAudio();
		
		//restart the loop
		this.update();
	},
	
	pauseGame: function(){
		this.paused = true;
		
		//this.stopBGAudio();
		
		//stop the animation loop
		cancelAnimationFrame(this.animationID);
		
		//call update() once so that our paused screen gets drawn
		this.update();
	}
	
	
	
	
	
	
	
	
}