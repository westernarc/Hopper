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
var framesRight;
var framesLeft;
var frameCount = 24;
var currentFrame;
var facingRight;

var imgBackdrop1;
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

var rays;
var rayWidth;
var rayLength;

var flgDead;
var resetAlpha;
var deathTextAlpha;

// ----------------------------------------

window.onload = function () {
	init();
	setInterval(draw, 1);
};

function init() {
    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");
	
    canvas.addEventListener("mousemove", trackPosition, true);
	canvas.addEventListener("mousedown", handleClick, true);
	width = canvas.width;
	height = canvas.height;
	
	floorY = height * 4 / 6;
	y = floorY;
	
	platforms = [{x:0, y: height - platformHeight * 3, platformwidth:width}];
	
	varLevel = 0;
	updatePlatforms();
	
	framesRight = new Array();
	framesLeft = new Array();
	
	for( var curFrame = 1; curFrame <= frameCount; curFrame += 1 ) {
		framesRight[curFrame] = new Image();
		if(curFrame < 10) {
			framesRight[curFrame].src = 'img/right/000' + curFrame + '.png';
		} else {
			framesRight[curFrame].src = 'img/right/00' + curFrame + '.png';
		}
	}
	for( var curFrame = 1; curFrame <= frameCount; curFrame += 1 ) {
		framesLeft[curFrame] = new Image();
		if(curFrame < 10) {
			framesLeft[curFrame].src = 'img/left/000' + curFrame + '.png';
		} else {
			framesLeft[curFrame].src = 'img/left/00' + curFrame + '.png';
		}
	}
	currentFrame = 1;
	
	imgBackdrop1 = new Image();
	imgBackdrop1.src = 'img/backdrop.png';
	backdropY1 = height;
	backdropY2 = 0;
	
	imgFloor = new Image();
	imgFloor.src = 'img/floor.png';
	
	imgCloud = new Image();
	imgCloud.src = 'img/cloud.png';
	
	rays = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
	rayWidth = 0.1;
	rayLength = height * 2;
	
	flgDead = false;
	resetAlpha = 0;
	deathTextAlpha = 0;
	facingRight = true;
}

function reinit() {
	varLevel = 0;
	deathTextAlpha = 0;
	resetAlpha = 1;
		
	platforms = [{x:0, y: height - platformHeight * 3, platformwidth:width}];
	updatePlatforms();
	
	flgDead = false;
	
	floorY = height * 4 / 6;
	y = floorY;
	
	dy = 0;
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
	ctx.drawImage(imgBackdrop1, 0, backdropY2);
	////ctx.drawImage(imgBackdrop1, 0, backdropY1);
	//ctx.drawImage(imgBackdrop1, 0, backdropY2);
	//Draw the player
	ctx.fillStyle = "#00A308";
	ctx.beginPath();
	//ctx.fillRect(x, y, playerRadius, playerRadius);
	ctx.closePath();
	
	//var frameToDisplay = Math.round(currentFrame / 2) * 2;
	var frameToDisplay = Math.round(currentFrame);
	if(facingRight) {
		ctx.drawImage(framesRight[frameToDisplay], x, y, playerRadius, playerRadius);
	} else {
		ctx.drawImage(framesLeft[frameToDisplay], x, y, playerRadius, playerRadius);
	}
	
	//Update animation frame
	if(currentFrame < frameCount) {
		currentFrame += 0.14;
		if(currentFrame > frameCount) {
			currentFrame = frameCount;
		}
	}

	//Draw light rays
	ctx.fillStyle = "rgba(255,255,100,0.1)";
	for(var currentRay = 0; currentRay < rays.length; currentRay += 1) {
		ctx.beginPath();
		ctx.moveTo(width / 2, -height/3);
		ctx.lineTo((Math.sin(rays[currentRay] - rayWidth) * rayLength) + width / 2, Math.cos(rays[currentRay] - rayWidth) * rayLength);
		ctx.lineTo((Math.sin(rays[currentRay] + rayWidth) * rayLength) + width / 2, Math.cos(rays[currentRay] + rayWidth) * rayLength);
		ctx.closePath();
		ctx.fill();
		rays[currentRay] += 0.001;
		if(rays[currentRay] > 2) {
			rays[currentRay] -= 4.5;
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
	if(y > height) {
		flgDead = true;
	}
	if(flgDead) {
		deathTextAlpha += 0.01;
	}
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
				backdropY1 -= height * 2;
			}
			if(backdropY2 > height) {
				backdropY2 -= height * 2;
			}
			if(platforms[0].y > height) {
				platforms.shift();
				updatePlatforms();
			}
		}
	}
	
	//Game over text
	ctx.fillStyle = 'rgba(50,50,50, '+deathTextAlpha+')';
	ctx.textAlign = 'center';
	ctx.font = "32px Arial";
	ctx.fillText("Game Over!", width/2, height/2);
	ctx.font = "18px Arial";
	ctx.fillText("Touch to Restart", width/2, height/2 + 64);
	
	resetAlpha -= 0.01;
	ctx.fillStyle = 'rgba(235,235,235, '+resetAlpha+')';	
	ctx.fillRect(0, 0, width, height);
	
	grad = ctx.createLinearGradient(0, 0, 0, 40);
	grad.addColorStop(0, "#333");
	grad.addColorStop(1, "#111");
	ctx.fillStyle = grad;
	ctx.beginPath();
	ctx.fillRect(0, 0, width, 50);
	ctx.closePath();
	ctx.fill();
	
	ctx.textAlign = 'left'
	ctx.fillStyle = "#ddd";
	ctx.font = "24px Arial";
	ctx.fillText(varLevel, 15, 35);
}

function trackPosition(e) {
	var dx = mouse.x;
	mouse = getMousePos(canvas, e);
	dx -= mouse.x;
	
	if(dx > 1) {
		facingRight = false;
	} else if(dx < -1) {
		facingRight = true;
	}
	x = mouse.x - playerRadius/2;
}
function getMousePos(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left, y: event.clientY - rect.top
	}
}

function handleClick(e) {
	if(flgDead) {
		reinit();
	}
}