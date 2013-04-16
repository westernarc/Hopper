// ----------------------------------------
// Actual game code goes here.

// Global vars
var canvas = null;
var ctx = null;

var x = 150;
var y = 150;
var dx = 2;
var dy = 4;
var playerRadius = 150;

//Frame array
var imgObj;
var frameCount = 24;
var currentFrame;

var imgBackdrop1;
var imgBackdrop2;
var backdropY1;
var backdropY2;

var width;
var height;

var mouse = {}

var varLevel;

//Platforms: there should be 6 x values
//the first value is the lowest platform, the 6th is the highest
//The value represents the x position of the platform on the screen
var platforms;
//Platform width
var platformWidth = 50;
var platformHeight = 15;

var imgFloor;
var imgCloud;

var floorY;

var platformBaseWidth = 140;
var platformMinimumWidth = 40;
// ----------------------------------------

window.onload = function () {
	init();
	setInterval(draw, 1);
};

function init() {
    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");
	
    canvas.addEventListener("mousemove", trackPosition, true);
	width = canvas.width;
	height = canvas.height;
	
	floorY = height * 4 / 6;
	y = floorY;
	
	platforms = [{x:0, y: height - platformHeight * 3, platformwidth:width}];
	
	varLevel = 0;
	updatePlatforms();
	
	imgObj = new Array();
	
	for( var curFrame = 1; curFrame <= frameCount; curFrame += 1 ) {
		imgObj[curFrame] = new Image();
		if(curFrame < 10) {
			imgObj[curFrame].src = 'img/right/000' + curFrame + '.png';
		} else {
			imgObj[curFrame].src = 'img/right/00' + curFrame + '.png';
		}
	}
	currentFrame = 1;
	
	imgBackdrop1 = new Image();
	imgBackdrop1.src = 'img/backdrop.png';
	backdropY1 = height - imgBackdrop1.height * 2;
	
	imgBackdrop2 = new Image();
	imgBackdrop2.src = 'img/backdrop.png';
	backdropY2 = height - imgBackdrop2.height;
	
	imgFloor = new Image();
	imgFloor.src = 'img/floor.png';
	
	imgCloud = new Image();
	imgCloud.src = 'img/cloud.png';
}

function reinit() {
}

function updatePlatforms() {
	while(platforms.length < 6) {
		var pwidth = Math.max(platformBaseWidth - (varLevel / 200), platformMinimumWidth);
		platforms.push({x:Math.random() * (width - pwidth), y: height - platformHeight - platforms.length * 200, platformwidth:pwidth});
	}
}
function draw() {
	//Clear
	ctx.clearRect(0, 0, width, height);

	//Draw background
	ctx.drawImage(imgBackdrop1, 0, backdropY1);
	ctx.drawImage(imgBackdrop2, 0, backdropY2);
	
	
	//Draw the player
	ctx.fillStyle = "#00A308";
	ctx.beginPath();
	//ctx.fillRect(x, y, playerRadius, playerRadius);
	ctx.closePath();
	
	ctx.drawImage(imgObj[Math.round(currentFrame)], x, y, playerRadius, playerRadius);
	
	//Update animation frame
	if(currentFrame < frameCount) {
		currentFrame += 0.15;
		if(currentFrame > frameCount) {
			currentFrame = frameCount;
		}
	}

	//Draw the platforms
	for(var i = 0; i < platforms.length; i++) {
		ctx.beginPath();
		if(platforms[i].platformwidth > 200) {
			ctx.drawImage(imgFloor, platforms[i].x, platforms[i].y, platforms[i].platformwidth, imgFloor.height);
		} else {
			ctx.drawImage(imgCloud, platforms[i].x, platforms[i].y, platforms[i].platformwidth, (platforms[i].platformwidth / imgCloud.width) * imgCloud.height);
		}
		//ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].platformwidth, platformHeight);
		ctx.closePath();
	}
	
	//Collisions against platforms
	for(var i = 0; i < platforms.length; i++) {
		if(Math.abs((x + playerRadius/2) - (platforms[i].x + platforms[i].platformwidth/2)) < (platforms[i].platformwidth/2 + playerRadius / 8) && Math.abs((y + playerRadius/2) - (platforms[i].y)) < 5 && dy > 0) {			
			dy = -8;
			currentFrame = 1;
		}
	}
	
	//x += dx;
	y += dy;
	
	dy += 0.1;	
	
	//If the player goes above 1/2 screen, move all of the pieces down
	if(y < height / 3) {
		if(dy < 0) {
			y -= dy;
			varLevel -= Math.round(dy);
			for(var i = 0; i < platforms.length; i++) {
				platforms[i].y -= dy;
			}
			
			backdropY1 -= dy / 2;
			backdropY2 -= dy / 2;
			
			if(backdropY1 > height) {
				backdropY1 -= imgBackdrop2.height + imgBackdrop1.height;
			}
			if(backdropY2 > height) {
				backdropY2 -= imgBackdrop1.height + imgBackdrop2.height;
			}
			
			if(platforms[0].y > height) {
				platforms.shift();
				updatePlatforms();
			}
		}
	}
	
	grad = ctx.createLinearGradient(0, 0, 0, 40);
	grad.addColorStop(0, "#333");
	grad.addColorStop(1, "#111");
	ctx.fillStyle = grad;
	ctx.beginPath();
	ctx.fillRect(0, 0, width, 50);
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle = "#ddd";
	ctx.font = "24px Arial";
	ctx.fillText(varLevel, 15, 35);
}

function trackPosition(e) {
	mouse = getMousePos(canvas, e);
	x = mouse.x - playerRadius/2;
}
function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left, y: event.clientY - rect.top
	}
}