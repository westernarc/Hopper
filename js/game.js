// ----------------------------------------
// Actual game code goes here.

// Global vars
var canvas = null;
var ctx = null;

var x = 150;
var y = 150;
var dx = 2;
var dy = 4;
var playerRadius = 100;

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

var floorY;

var platformBaseWidth = 100;
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
	
	floorY = height * 5 / 6;
	y = floorY;
	
	platforms = [{x:0, y: height - platformHeight, platformwidth:width}];
	
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
	imgBackdrop1.src = 'img/backdrop.jpg';
	backdropY1 = height - imgBackdrop1.height * 2;
	
	imgBackdrop2 = new Image();
	imgBackdrop2.src = 'img/backdrop.jpg';
	backdropY2 = height - imgBackdrop2.height;
}

function updatePlatforms() {
	while(platforms.length < 6) {
		var pwidth = Math.max(platformBaseWidth - (varLevel * 5), platformMinimumWidth);
		platforms.push({x:Math.random() * (width - pwidth), y: height - platformHeight - platforms.length * 200, platformwidth:pwidth});
	}
}
function draw() {
	ctx.clearRect(0, 0, width, height);

	ctx.drawImage(imgBackdrop1, 0, backdropY1);
	ctx.drawImage(imgBackdrop2, 0, backdropY2);
	
	ctx.drawImage(imgObj[Math.round(currentFrame)], x, y, playerRadius, playerRadius);
	
	//Update animation frame
	if(currentFrame < frameCount) {
		currentFrame += 0.15;
	}

	ctx.fillStyle = "#00A308";
	ctx.beginPath();
	//ctx.fillRect(x, y, playerRadius, playerRadius);
	ctx.closePath();
	ctx.fill();
	
	//Draw the platforms
	for(var i = 0; i < platforms.length; i++) {
		ctx.beginPath();
		ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].platformwidth, platformHeight);
		ctx.closePath();
	}
	
	//Collisions against platforms
	for(var i = 0; i < platforms.length; i++) {
		if(Math.abs((x + playerRadius/2) - (platforms[i].x + platforms[i].platformwidth/2)) < (platforms[i].platformwidth/2 + playerRadius / 8) && Math.abs(y - (platforms[i].y - platformHeight * 3)) < platformHeight && dy > 0) {			
			dy = -8;
			currentFrame = 1;
		}
	}
	
	//x += dx;
	y += dy;
	
	dy += 0.1;	
	
	//If the player goes above 1/2 screen, move all of the pieces down
	if(y < height / 2) {
		if(dy < 0) {
			y -= dy;
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
				varLevel += 1;
				updatePlatforms();
			}
		}
	}
}

function trackPosition(e) {
	mouse = getMousePos(canvas, e);
	x = mouse.x - playerRadius/2;
		
	if(x > width - playerRadius) {
		x = width - playerRadius;
	} else if(x < 0) {
		x = 0;
	}
}
function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left, y: event.clientY - rect.top
	}
}