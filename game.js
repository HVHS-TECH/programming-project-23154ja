//constants
const FPS = 60;
const WORLDX = 8192;
const WORLDY = 8192;
const BUTTONWIDTH = 60;
const BUTTONMARGIN = 10;
const SKYHEIGHT = 492;
const GRASSHEIGHT = 82;
const WORMLENGTH = 67;
const WORMWIDTH = 52;
const WORMSPEED = 5;
const FOODWIDTH = 50;
const MINFOODSEPERATION = 40;
const INITIALFOODDENSITY = 2000 ** 2;
const INITIALFOODPERSECOND = 0.4;
const MINFOODPERSECOND = 0.1;
const FOODABUNDANCE = 10;
const MAXENERGY = 58 * 60;
const INITIALENERGY = 48 * 60;
const GAMESCREENDEATHTIME = 2.3;
const WORLDSEED = 112358;
//image vars
let imgBG;
let imgFaceHappy;
let imgFaceOk;
let imgFaceMeh;
let imgFaceMuffed;
let imgFaceSad;
let imgFaceShock;
let No0;
let No1;
let No2;
let No3;
let No4;
let No5;
let No6;
let No7;
let No8;
let No9;
let pauseImg;
let playImg;
let resetImg;
let homeImg;
let startImg;
let helpImg;
//p5 play sprite vars
let bgSprite;
let overlay;
let player;
let playerBorder;
let pauseButton;
let resetButton;
let homeButton;
let startButton;
let helpButton;
let digit1;
let digit2;
let digit3;
let digit4;
//canvas var
let cnv;
//other vars
let gameState = 'start';
let clickTime;
let startTransition;
let gameFrame;
let isPaused;
let foodToSpawn;
let lastFrameHeadSprite;
let tailSprite;
let energy;
let displayEnergy;
let died;
let diedTime;
let score;
let numImgNames = [];
let tailSegments = [];
let tailBorderSegments = [];
let foodLocations = [];
/******************
preload
*****************/
function preload() {
	//load images
	imgBG = loadImage('assets/images/background.webp');
	wormLife = loadImage('assets/images/startScreen.png');
	wormDeath = loadImage('assets/images/endScreen.png');
	imgFaceHappy = loadImage('assets/images/faces/happy.png');
	imgFaceOk = loadImage('assets/images/faces/ok.png');
	imgFaceMeh = loadImage('assets/images/faces/meh.png');
	imgFaceMuffed = loadImage('assets/images/faces/muffed.png');
	imgFaceSad = loadImage('assets/images/faces/sad.png');
	imgFaceShock = loadImage('assets/images/faces/shock.png');
	pauseImg = loadImage('assets/images/buttonImages/pause.png');
	playImg = loadImage('assets/images/buttonImages/play.png');
	resetImg = loadImage('assets/images/buttonImages/reset.png');
	homeImg = loadImage('assets/images/buttonImages/home.png');
	startImg = loadImage('assets/images/buttonImages/start.png');
	helpImg = loadImage('assets/images/buttonImages/howToPlay.png');
	No0 = loadImage('assets/images/numbers/NO_00.png');
	No1 = loadImage('assets/images/numbers/NO_01.png');
	No2 = loadImage('assets/images/numbers/NO_02.png');
	No3 = loadImage('assets/images/numbers/NO_03.png');
	No4 = loadImage('assets/images/numbers/NO_04.png');
	No5 = loadImage('assets/images/numbers/NO_05.png');
	No6 = loadImage('assets/images/numbers/NO_06.png');
	No7 = loadImage('assets/images/numbers/NO_07.png');
	No8 = loadImage('assets/images/numbers/NO_08.png');
	No9 = loadImage('assets/images/numbers/NO_09.png');
	//assign digits to an array for easy access
	numImgNames = [No0, No1, No2, No3, No4, No5, No6, No7, No8, No9];
}
/******************
setup
*****************/
function setup() {
	frameRate(FPS);
	noSmooth();
	pixelDensity(1);
	cnv = new Canvas(windowWidth, windowHeight);
	startScreenSetup();
}

function startScreenSetup() {
	allSprites.removeAll();
	startTransition = false;
	camera.x = windowWidth / 2;
	camera.y = windowHeight / 2;
	overlay = new Sprite(860, 540, 1440, 1080, "n");
	overlay.image = wormLife;
	overlay.layer = 7;
	overlay.visible = true;
	if (windowWidth / 1440 < windowHeight / 1080) {
		overlay.scale = windowWidth / 1440;
		overlay.x = windowWidth / 2;
		overlay.y = overlay.scale * 540;
	} else {
		overlay.scale = windowHeight / 1080;
		overlay.x = windowWidth / 2;
		overlay.y = windowHeight / 2;
	}
	startButton = new Sprite(overlay.x - 400 * overlay.scale, overlay.y + 320 * overlay.scale, 384, 192, 'k');
	startButton.layer = 8;
	startButton.image = startImg;
	startButton.scale = overlay.scale * 1.2;


	helpButton = new Sprite(overlay.x + 250 * overlay.scale, overlay.y + 320 * overlay.scale, 384, 192, 'k');
	helpButton.layer = 8;
	helpButton.image = helpImg;
	helpButton.scale = overlay.scale * 1.2;
}

function gameScreenSetup() {
	allSprites.removeAll();
	//reset vars
	isPaused = false;
	gameFrame = 0;
	foodToSpawn = 0;
	lastFrameHeadSprite = WORMLENGTH - 2;
	tailSprite = 0;
	energy = INITIALENERGY;
	displayEnergy = energy;
	died = false;
	score = -480;
	tailSegments = [];
	tailBorderSegments = [];
	foodLocations = [];
	randomSeed(WORLDSEED);
	bgSprite = new Sprite(WORLDX / 2, WORLDY / 2, WORLDX, WORLDY, "n");
	bgSprite.image = imgBG;
	bgSprite.layer = 0;
	wormSetup();
	camera.x = player.x;
	camera.y = player.y;
	uiGameSetup();
	overlay = new Sprite(WORLDX / 2, WORLDY / 2, WORLDX, WORLDY, "n");
	overlay.color = 'grey';
	overlay.opacity = 0.5;
	overlay.layer = 7;
	overlay.visible = false;
	initialFoodSetup();
}

function wormSetup() {
	playerBorder = new Sprite(3000, 900, WORMWIDTH, 'n');
	playerBorder.strokeWeight = 0;
	playerBorder.color = "black";
	playerBorder.layer = 2;
	player = new Sprite(playerBorder.x, playerBorder.y, WORMWIDTH - 2, "n");
	player.color = "salmon";
	player.img = imgFaceHappy;
	player.strokeWeight = 0;
	player.layer = 4;
	for (let i = 1; i <= WORMLENGTH; i++) {
		let tailBorder = new Sprite(player.x + (i - WORMLENGTH) * WORMSPEED, player.y, WORMWIDTH, "n");
		tailBorder.layer = 2;
		tailBorder.color = "black";
		tailBorder.strokeWeight = 0;
		tailBorderSegments.push(tailBorder);
		let tail = new Sprite(player.x + (i - WORMLENGTH) * WORMSPEED, player.y, WORMWIDTH - 2, "n");
		tail.layer = 3;
		tail.color = "salmon";
		tail.strokeWeight = 0;
		tailSegments.push(tail);
	}
}

function uiGameSetup() {
	pauseButton = new Sprite(camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONMARGIN, camera.y - (windowHeight - BUTTONWIDTH) / 2 + BUTTONMARGIN, BUTTONWIDTH, BUTTONWIDTH, "k");
	pauseButton.image = pauseImg;
	pauseButton.layer = 8;
	resetButton = new Sprite(camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONWIDTH - 2 * BUTTONMARGIN, camera.y - (windowHeight - BUTTONWIDTH) / 2 + BUTTONMARGIN, BUTTONWIDTH, BUTTONWIDTH, "k");
	resetButton.visible = false;
	resetButton.image = resetImg;
	resetButton.layer = 8;
	homeButton = new Sprite(camera.x + (windowWidth - BUTTONWIDTH) / 2 - 2 * BUTTONWIDTH - 3 * BUTTONMARGIN, camera.y - (windowHeight - BUTTONWIDTH) / 2 + BUTTONMARGIN, BUTTONWIDTH, BUTTONWIDTH, "k");
	homeButton.visible = false;
	homeButton.image = homeImg;
	homeButton.layer = 8;
	colorMode(HSL, 360, 100, 100);
	hungerBar = new Sprite(camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONMARGIN, camera.y + (BUTTONWIDTH + BUTTONMARGIN) / 2 + (windowHeight - BUTTONWIDTH - BUTTONMARGIN * 11 - 6) * (1 - displayEnergy / MAXENERGY) / 2, BUTTONWIDTH - 6, (windowHeight - BUTTONWIDTH - BUTTONMARGIN * 11 - 6) * displayEnergy / MAXENERGY, 'n');
	hungerBar.layer = 6;
	hungerBar.color = color(10 + 90 * displayEnergy / MAXENERGY, 100, 50);
	colorMode(RGB, 255);
	hungerBarBackground = new Sprite(camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONMARGIN, camera.y + (BUTTONWIDTH + BUTTONMARGIN) / 2, BUTTONWIDTH, windowHeight - BUTTONWIDTH - BUTTONMARGIN * 11, 'n');
	hungerBarBackground.color = "black";
	hungerBarBackground.layer = 5;
}

function initialFoodSetup() {
	for (let i = 0; i < WORLDX * WORLDY / INITIALFOODDENSITY; i++) {
		newFood(true);
	}
}

function endScreenSetup() {
	allSprites.removeAll();
	camera.x = windowWidth / 2;
	camera.y = windowHeight / 2;
	overlay = new Sprite(860, 540, 1920, 1080, "n");
	overlay.image = wormDeath;
	overlay.layer = 7;
	overlay.visible = true;
	if (windowWidth / 1440 < windowHeight / 1440) {
		overlay.scale = windowWidth / 1620;
		overlay.x = windowWidth / 2;
		overlay.y = overlay.scale * 810;
	} else {
		overlay.scale = windowHeight / 1440;
		overlay.x = windowWidth / 2;
		overlay.y = windowHeight / 2;
	}
	digit1 = new Sprite(overlay.x - 60 * overlay.scale, overlay.y + 215 * overlay.scale, 40, 70, 'n');
	digit1.scale = overlay.scale / 0.56;
	digit2 = new Sprite(digit1.x + 90 * overlay.scale, digit1.y, 40, 70, 'n');
	digit2.scale = digit1.scale;
	console.log('this' + overlay.scale);
	digit3 = new Sprite(digit2.x + 90 * overlay.scale, digit1.y, 40, 70, 'n');
	digit3.scale = digit1.scale;
	digit4 = new Sprite(digit3.x + 90 * overlay.scale, digit1.y, 40, 70, 'n');
	digit4.scale = digit1.scale;
	score = Math.floor(gameFrame / 6) - 480;
	digit1.image = numImgNames[Math.floor(score / 1000) % 10];
	digit2.image = numImgNames[Math.floor(score / 100) % 10];
	digit3.image = numImgNames[Math.floor(score / 10) % 10];
	digit4.image = numImgNames[score % 10];

	resetButton = new Sprite(overlay.x + 100 * overlay.scale, overlay.y + 500 * overlay.scale, BUTTONWIDTH, BUTTONWIDTH, "k");
	resetButton.visible = true;
	resetButton.image = resetImg;
	resetButton.layer = 8;
	resetButton.scale = 4 * overlay.scale;
	homeButton = new Sprite(overlay.x - 400 * overlay.scale, overlay.y + 500 * overlay.scale, BUTTONWIDTH, BUTTONWIDTH, "k");
	homeButton.visible = true;
	homeButton.image = homeImg;
	homeButton.layer = 8;
	homeButton.scale = 4 * overlay.scale;
}
/******************
drawFunc
*****************/
function draw() {
	background('green');
	if (gameState == 'start') {
		startScreen();
	} else if (gameState == 'game') {
		gameScreen();
	} else if (gameState == 'end') {
		endScreen();
	}
}

function startScreen() {
	if (!startTransition) {
		if (startButton.mouse.presses()) {
			clickTime = millis();
			startTransition = true;
		}
		if (helpButton.mouse.presses()) {
			window.open('assets/images/instructions.svg', '_blank');
		}
	} else if (millis() > clickTime + 50) {
		gameState = 'game';
		gameScreenSetup();
	}

}

function gameScreen() {
	if (!died) {
		if (kb.presses('p') || pauseButton.mouse.presses()) {
			isPaused = !isPaused;
			overlay.visible = !overlay.visible;
		}
		if (!isPaused) {
			gameFrame++;
			hungerLogic();
			if (!died) {
				playerMove(WORMSPEED);
			}
			spawnFood();
			resetButton.visible = false;
			homeButton.visible = false;
			pauseButton.img = pauseImg;
		} else {
			resetButton.visible = true;
			homeButton.visible = true;
			pauseButton.img = playImg;
		}
		moveCamera(10);
		moveButtons(5);
	} else if (millis() >= diedTime + 1000 * GAMESCREENDEATHTIME) {
		gameState = 'end';
		endScreenSetup();
	} else {
		player.vel.y += 0.5;
		tailSegments[WORMLENGTH - 1].vel.y += 0.5;
	}
	score = Math.floor(gameFrame / 6) - 480;
	if (homeButton.mouse.presses() && homeButton.visible) {
		gameState = 'start';
		startScreenSetup();
	} else if (resetButton.mouse.presses() && homeButton.visible) {
		allSprites.removeAll();
		gameScreenSetup();
	}
}

function endScreen() {
	if (homeButton.mouse.presses() && homeButton.visible) {
		gameState = 'start';
		startScreenSetup();
	} else if (resetButton.mouse.presses() && homeButton.visible) {
		allSprites.removeAll();
		gameState = 'game';
		gameScreenSetup();
	}
}

function playerMove(speed) {
	let movingX = true;
	let movingY = true;
	let xDirection = 0;
	let yDirection = 0;
	let toMoveX = 0;
	let toMoveY = 0;
	if (kb.pressing('left') && !kb.pressing('right')) {
		xDirection = -1;
	} else if (kb.pressing('right') && !kb.pressing('left')) {
		xDirection = 1;
	} else {
		playerBorder.vel.x = 0;
		movingX = false;
	}
	if (kb.pressing('up') && !kb.pressing('down')) {
		yDirection = -1;
	} else if (kb.pressing('down') && !kb.pressing('up')) {
		yDirection = 1;
	} else {
		playerBorder.vel.y = 0;
		movingY = false;
	}
	if (playerBorder.y == tailBorderSegments[lastFrameHeadSprite].y) {
		toMoveX = xDirection * speed;
	} else {
		toMoveX = xDirection * Math.sqrt(speed ** 2 / 2);
	}
	if (playerBorder.x == tailBorderSegments[lastFrameHeadSprite].x) {
		toMoveY = yDirection * speed;
	} else {
		toMoveY = yDirection * Math.sqrt(speed ** 2 / 2);
	}
	playerBorder.x += toMoveX;
	playerBorder.y += toMoveY;
	if (Math.abs(playerBorder.x - WORLDX / 2) + WORMWIDTH / 2 > WORLDX / 2) {
		playerBorder.x = WORLDX / 2 + (playerBorder.x - WORLDX / 2) / Math.abs(playerBorder.x - WORLDX / 2) * (WORLDX / 2 - WORMWIDTH / 2);
		if (playerBorder.x == tailBorderSegments[lastFrameHeadSprite].x) {
			movingX = false;
		}
	}
	// y constraint - triggers if the player tries to go out of the top or bottom of the playable area
	if (Math.abs(playerBorder.y - (SKYHEIGHT + WORLDY - WORMWIDTH) / 2) + WORMWIDTH / 2
		// if
		// the difference between the player's y: 			playerBorder.y
		// and the center of the playable vertical area: 	(SKYHEIGHT+WORLDY-WORMWIDTH)/2   
		// (wormwidth is so the worm can go out of the grass but stay on the surface)
		// plus the radius of the sprite (so the worm won't go partly off the screen)
		> (WORLDY - SKYHEIGHT + WORMWIDTH) / 2)
	// is greater than the distance from the center to the top or bottom of the playable area
	// (wormwidth is so the worm can go out of the grass but stay on the surface)
	{ //then
		playerBorder.y =
			//the player's y equals
			(playerBorder.y - (SKYHEIGHT + WORLDY - WORMWIDTH) / 2)
			// the distance the player is vertically from the center
			/ Math.abs(playerBorder.y - (SKYHEIGHT + WORLDY - WORMWIDTH) / 2)
			// divided by abs of the distance 
			// this gives -1 if in the top half of the world and 1 if in the bottom half
			* ((WORLDY - SKYHEIGHT) / 2)
			// times half the vertical playable area
			// this multiplied by the half the player is in gives the distance from the center to the top or bottom edge the player is at
			+ (SKYHEIGHT + WORLDY - WORMWIDTH) / 2;
		// plus the center of the playable vertical area
		// sets the player's y to the top or bottom edge of the playable area depending on what half the player is in
		if (playerBorder.y == tailBorderSegments[lastFrameHeadSprite].y) {
			// if the parent if (player is trying to go out the top or bottom of the playable area) is true then check if player was in the same position last frame
			movingY = false;
			// if true then set movingY to false
			// if not true then this is the first frame in which the player is going into the wall and it is still moving, just not as far as it would usually.
		}
	}
	player.x = playerBorder.x;
	player.y = playerBorder.y;
	if (movingX || movingY) {
		moveTail();
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	if (gameState == 'start') {
		if (windowWidth / 1440 < windowHeight / 1080) {
			overlay.scale = windowWidth / 1440;
			overlay.x = windowWidth / 2;
			overlay.y = overlay.scale * 540;
		} else {
			overlay.scale = windowHeight / 1080;
			overlay.x = windowWidth / 2;
			overlay.y = windowHeight / 2;
		}
		startButton.x = overlay.x - 400 * overlay.scale;
		startButton.y = overlay.y + 320 * overlay.scale;
		startButton.scale = startButton.scale = overlay.scale * 1.2;

		helpButton.x = overlay.x + 250 * overlay.scale;
		helpButton.y = overlay.y + 320 * overlay.scale;
		helpButton.scale = startButton.scale = overlay.scale * 1.2;

	} else if (gameState == 'end') {
		if (windowWidth / 1620 < windowHeight / 1440) {
			overlay.scale = windowWidth / 1620;
			overlay.x = windowWidth / 2;
			overlay.y = overlay.scale * 720;
		} else {
			overlay.scale = windowHeight / 1440;
			overlay.x = windowWidth / 2;
			overlay.y = windowHeight / 2;
		}
		digit1.x = overlay.x - 60 * overlay.scale;
		digit1.y = overlay.y + 215 * overlay.scale;
		digit1.scale = overlay.scale / 0.56;
		digit2.x = digit1.x + 90 * overlay.scale;
		digit2.y = digit1.y;
		digit2.scale = digit1.scale;
		digit3.x = digit2.x + 90 * overlay.scale;
		digit3.y = digit1.y;
		digit3.scale = digit1.scale;
		digit4.x = digit3.x + 90 * overlay.scale;
		digit4.y = digit1.y;
		digit4.scale = digit1.scale;

		resetButton.x = overlay.x + 100 * overlay.scale;
		resetButton.y = overlay.y + 500 * overlay.scale;
		homeButton.x = overlay.x - 400 * overlay.scale;
		homeButton.y = overlay.y + 500 * overlay.scale;
		homeButton.scale = 4 * overlay.scale;
		resetButton.scale = 4 * overlay.scale;
	}
};

function moveCamera(percentPerFrame) {
	camera.x += (player.x - camera.x) * (percentPerFrame / 100)
	camera.y += (player.y - camera.y) * (percentPerFrame / 100)
	if (Math.abs(camera.x - WORLDX / 2) + windowWidth / 2 > WORLDX / 2) {
		camera.x = WORLDX / 2 + (camera.x - WORLDX / 2) / Math.abs(camera.x - WORLDX / 2) * (WORLDX / 2 - windowWidth / 2)
	}
	if (Math.abs(camera.y - WORLDY / 2) + windowHeight / 2 > WORLDY / 2) {
		camera.y = WORLDY / 2 + (camera.y - WORLDY / 2) / Math.abs(camera.y - WORLDY / 2) * (WORLDY / 2 - windowHeight / 2)
	}
}

function moveButtons(energyBarPercentPerFrame) {
	pauseButton.x = camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONMARGIN;
	pauseButton.y = camera.y - (windowHeight - BUTTONWIDTH) / 2 + BUTTONMARGIN;
	resetButton.x = camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONWIDTH - 2 * BUTTONMARGIN;
	resetButton.y = camera.y - (windowHeight - BUTTONWIDTH) / 2 + BUTTONMARGIN;
	homeButton.x = camera.x + (windowWidth - BUTTONWIDTH) / 2 - 2 * BUTTONWIDTH - 3 * BUTTONMARGIN;
	homeButton.y = camera.y - (windowHeight - BUTTONWIDTH) / 2 + BUTTONMARGIN;
	hungerBarBackground.x = camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONMARGIN;
	hungerBarBackground.y = camera.y + (BUTTONWIDTH + BUTTONMARGIN) / 2;
	hungerBarBackground.strokeWeight = 0;
	displayEnergy += (energy - displayEnergy) * (energyBarPercentPerFrame / 100);
	colorMode(HSL, 360, 100, 100);
	hungerBar.x = hungerBarBackground.x;
	hungerBar.y = camera.y + (BUTTONWIDTH + BUTTONMARGIN) / 2 + (windowHeight - BUTTONWIDTH - BUTTONMARGIN * 11 - 6) * (1 - displayEnergy / MAXENERGY) / 2;
	hungerBar.height = (windowHeight - BUTTONWIDTH - BUTTONMARGIN * 11 - 6) * displayEnergy / MAXENERGY;
	hungerBar.color = color(10 + 90 * displayEnergy / MAXENERGY, 100, 50);
	hungerBar.strokeWeight = 0;
	colorMode(RGB, 255);
}

function moveTail() {
	tailSegments[tailSprite].x = player.x;
	tailSegments[tailSprite].y = player.y;
	tailBorderSegments[tailSprite].x = player.x;
	tailBorderSegments[tailSprite].y = player.y;
	tailSprite++;
	if (tailSprite == WORMLENGTH) {
		tailSprite = 0;
	}
	lastFrameHeadSprite++;
	if (lastFrameHeadSprite == WORMLENGTH) {
		lastFrameHeadSprite = 0;
	}
}

function spawnFood() {
	foodToSpawn += (FOODABUNDANCE * (INITIALFOODPERSECOND - MINFOODPERSECOND)) / (gameFrame * (INITIALFOODPERSECOND - MINFOODPERSECOND) + FPS * FOODABUNDANCE) + MINFOODPERSECOND / FPS;
	while (foodToSpawn >= 1) {
		foodToSpawn += -1;
		newFood(false);
	}
}

function newFood(spawnOnScreen) {
	let repeat = true;
	let x
	let y
	while (repeat) {
		repeat = false;
		x = random(FOODWIDTH, WORLDX - FOODWIDTH);
		y = random(SKYHEIGHT + GRASSHEIGHT + FOODWIDTH, WORLDY - FOODWIDTH);
		if (!spawnOnScreen) {
			if (x >= camera.x - (windowWidth + FOODWIDTH) / 2 && x <= camera.x + (windowWidth + FOODWIDTH) / 2) {
				if (y >= camera.y - (windowHeight + FOODWIDTH) / 2 && y <= camera.y + (windowHeight + FOODWIDTH) / 2) {
					repeat = true;
					continue;
				}
			}
		}
		for (let i2 = 0; i2 < foodLocations.length; i2++) {
			if (Math.max(Math.abs(foodLocations[i2].x - x), Math.abs(foodLocations[i2].y - y)) < FOODWIDTH + MINFOODSEPERATION) {
				repeat = true;
				break;
			}
		}
	}
	let foodItem = new Sprite(x, y, FOODWIDTH, "n");
	foodItem.layer = 1;
	foodLocations.push(foodItem);
}

function hungerLogic() {
	for (let i = foodLocations.length - 1; i >= 0; i--) {
		if (Math.sqrt((playerBorder.x - foodLocations[i].x) ** 2 + (playerBorder.y - foodLocations[i].y) ** 2) < FOODWIDTH / 2 + WORMWIDTH / 2 - 7) {
			foodLocations[i].life = 6;
			foodLocations.splice(i, 1);
			//check if this works
			energy += 5 * 60;
		}
	}
	energy += -1;
	displayEnergy += -1;
	if (displayEnergy / MAXENERGY < 0.25) {
		player.img = imgFaceMeh;
	} else if (displayEnergy / MAXENERGY < 0.5) {
		player.img = imgFaceOk;
	} else {
		player.img = imgFaceHappy;
	}
	if (energy > MAXENERGY) {
		energy = MAXENERGY;
	} else if (energy <= 0) {
		died = true;
		diedTime = millis();
		hungerBar.remove();
		for (let i = 0; i < WORMLENGTH - 1; i++) {
			if (Math.floor(i % 3) == 1) {
				tailSegments[i].collider = 'd';
				tailSegments[i].vel.x = random(-0.5, 0.5);
				tailSegments[i].vel.y = random(-0.5, 0.5);
			} else {
				tailSegments[i].remove();
			}
			tailBorderSegments[i].remove();
		}
		tailBorderSegments[WORMLENGTH - 1].remove();
		tailSegments[WORMLENGTH - 1].x = player.x;
		tailSegments[WORMLENGTH - 1].y = player.y;
		tailSegments[WORMLENGTH - 1].vel.y = -17;
		playerBorder.remove();
		player.vel.y = -17;
		player.img = imgFaceShock;
	}
}