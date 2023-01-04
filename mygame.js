var testShrimp;
var myBackground;
var menuBar;
var score;
var shrimpEaten = 0;
const fishBody = [];
var inverseFrames = 200;
var toAdd = 0;
var startInd = 0;
var head = "FishHeadRight.png";;
var grid = [];
var turn = false;

for (var x = 0; x < 30; x++){
	var temp = [];
	for (var y = 0; y < 16; y++){
		temp[y] = false;
	}
	grid[x] = temp;
}

function startGame() {
  myGameArea.start();
  testShrimp = new component(30,30, "#ff0000", 510,510, "");
  myBackground = new component(1500,800,"images/Background.png",0,0,"image");
  menuBar = new component(1500,50,"#007a99",0,800,"");
  score = new component("40px", "Consolas", "#ffffff",50,840, "text");
  fishBody[0] = new component(50,50,"images/FishHeadRight.png",150,50,"image");
  drawBody(fishBody);
}

var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 1500;
		this.canvas.height = 850;
		this.ctxt = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, inverseFrames);
		myGameArea.keys = [];
		window.addEventListener('keydown', function(e){
			myGameArea.keys.push(e.keyCode);
		})
		//window.addEventListener('keyup', function(e){
		//	myGameArea.keys[e.keyCode] = false;
		//})
	},
	clear : function() {
		this.ctxt.clearRect(0,0,this.canvas.width, this.canvas.height);
	},
	createShrimp : function() {
		var tryX = Math.round(Math.random() * 29);
		var tryY = Math.round(Math.random() * 15);
		while (grid[tryX][tryY]){
			tryX = Math.round(Math.random() * 29);
			tryY = Math.round(Math.random() * 15);
		}
		testShrimp = new component(30,30, "#ff0000", tryX * 50 + 10,tryY * 50 + 10, "nada");
	},
	stop : function() {
		clearInterval(this.interval);
	}
}

function component(width, height, color, x, y, type, orien){
	this.type = type;
	if (type == "image"){
		this.image = new Image();
		this.image.src = color;
	}
	this.width = width;
	this.height = height;
	this.color = color;
	this.orien = orien;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function(){
		ctx = myGameArea.ctxt;
		if (type == "text"){
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		} else if(type == "image"){
			ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
		} else {
			ctx.fillStyle = color;
			ctx.fillRect(this.x,this.y,this.width,this.height);
		}
	}
	this.newPos = function(){
		if ((this.x + this.speedX)/50 < 0 || (this.x + this.speedX)/50 > 29 || (this.y+this.speedY)/50 > 15 || (this.y+this.speedY)/50 < 0 || grid[(this.x + this.speedX)/50][(this.y+this.speedY)/50]){
			myGameArea.stop();
		} else {
			this.x += this.speedX;
			this.y += this.speedY;
			grid[(this.x)/50][(this.y)/50] = true;
		}
	}
	this.eatShrimp = function(otherObj){
		if (this.x + 10 == otherObj.x && this.y+10 == otherObj.y){
			return true;
		}
		else {
			return false;
		}
	}
	
	this.copy = function(){
		return (new component(this.width, this.height, this.color, this.x, this.y, this.type, this.orien));
	}
}

function updateBody(fish){
	if (toAdd > 0){
		if (!turn){
			if (fish[0].speedX == 0){
				fish[0].image.src = "images/FishBodyVert.png";
			} else {
				fish[0].image.src = "images/FishBodyHor.png";
			}
		} else {
			turn = false;
		}
		var temp = fish[fish.length-1].copy();
		fish.push(temp);
		for (var i = fish.length-1; i > 0; i--){
			fish[i].x = fish[i-1].x;
			fish[i].y = fish[i-1].y;
			fish[i].image.src = fish[i-1].image.src;
		}
		toAdd --;
		//fish[0].image.src = head;
	} else {
		grid[fish[fish.length-1].x/50][fish[fish.length-1].y/50] = false;
		if (!turn){
			if (fish[0].speedX == 0){
				fish[0].image.src = "images/FishBodyVert.png";
			} else {
				fish[0].image.src = "images/FishBodyHor.png";
			}
		} else {
			turn = false;
		}
		for (var i = fish.length-1; i > 0; i--){
			fish[i].x = fish[i-1].x;
			fish[i].y = fish[i-1].y;
			fish[i].image.src = fish[i-1].image.src;
		}
		//fish[0].image.src = head;
	}
	fish[0].image.src = head;
}

function drawBody(fish){
	for (var i = 0; i < fish.length; i++){
		fish[i].update();
	}
}

function updateGameArea(){
	/**if (fishBody[0].x < 0 || fishBody[0].x > 1450 || fishBody[0].y < 0 || fishBody[0].y > 750){
		console.info("here, Should stop");
		myGameArea.stop();
		myGameArea.clear();
	} else { **/
		myGameArea.clear();
		if (fishBody[0].eatShrimp(testShrimp)){
			myGameArea.createShrimp();
			myBackground.update();
			toAdd += 3;
			shrimpEaten++;
		}
		if (myGameArea.keys.length > startInd){
			if (myGameArea.keys[startInd] == 37) {
				turn = true;
				head = "images/FishHeadLeft.png";
				fishBody[0].speedX = -50;
				fishBody[0].speedY = 0;
				if (fishBody.length > 1 && myGameArea.keys[startInd-1] == 38){
					fishBody[0].image.src = "images/BottomLeft.png";
				} else {
					fishBody[0].image.src = "images/UpperLeft.png";
				}
			} else if (myGameArea.keys[startInd] == 39) {
				turn = true;
				head = "images/FishHeadRight.png";
				fishBody[0].speedX = 50;
				fishBody[0].speedY = 0;
				if (fishBody.length > 1 && myGameArea.keys[startInd-1] == 38){
					fishBody[0].image.src = "images/BottomRight.png";
				} else {
					fishBody[0].image.src = "images/UpperRight.png";
				}
			} else if (myGameArea.keys[startInd] == 38){
				turn = true;
				head = "images/FishHeadUp.png";
				fishBody[0].speedY = -50;
				fishBody[0].speedX = 0;
				if (fishBody.length > 1 && myGameArea.keys[startInd-1] == 37){
					fishBody[0].image.src = "images/UpperRight.png";
				} else {
					fishBody[0].image.src = "images/UpperLeft.png";
				}
			} else {
				turn = true;
				head = "images/FishHeadDown.png";
				fishBody[0].speedY = 50;
				fishBody[0].speedX = 0;
				if (fishBody.length > 1 && myGameArea.keys[startInd-1] == 37){
					fishBody[0].image.src = "images/BottomRight.png";
				} else {
					fishBody[0].image.src = "images/BottomLeft.png";
				}
			}
			startInd ++;
		}
		myBackground.update();
		menuBar.update();
		score.text = "Score: " + shrimpEaten;
		score.update();
		updateBody(fishBody);
		//console.info(fishBody[0].x, fishBody[0].y);
		fishBody[0].newPos();
		testShrimp.update();
		drawBody(fishBody);
	}
