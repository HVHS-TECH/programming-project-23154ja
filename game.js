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
const MAXENERGY = 58 * FPS;
const INITIALENERGY = 48 * FPS;
const GAMESCREENDEATHTIME = 2.3;
const WORLDSEED = 314159;
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
	// sets fps to const FPS (60) - smooth speed without being to laggy
	frameRate(FPS);
	// creates the canvas and calls the setup for the start screen
	cnv = new Canvas(windowWidth, windowHeight);
	startScreenSetup();
}

/******************
setup for the start screen
*****************/
function startScreenSetup() {
	//resets everything incase moving into start screen from game or end screen
	allSprites.removeAll();
	startTransition = false;
	camera.x = windowWidth / 2;
	camera.y = windowHeight / 2;
	//in start screen overlay is the background
	overlay = new Sprite(860, 540, 1440, 1080, "n");
	overlay.image = wormLife;
	overlay.layer = 7;
	overlay.visible = true;
	//initial scale for responsive web design
	if (windowWidth / 1440 < windowHeight / 1080) {
		overlay.scale = windowWidth / 1440;
		overlay.x = windowWidth / 2;
		overlay.y = overlay.scale * 540;
	} else {
		overlay.scale = windowHeight / 1080;
		overlay.x = windowWidth / 2;
		overlay.y = windowHeight / 2;
	}
	//start and help button scale are based of overlay scale
	startButton = new Sprite(overlay.x - 400 * overlay.scale, overlay.y + 320 * overlay.scale, 384, 192, 'k');
	startButton.layer = 8;
	startButton.image = startImg;
	startButton.scale = overlay.scale * 1.2;

	helpButton = new Sprite(overlay.x + 250 * overlay.scale, overlay.y + 320 * overlay.scale, 384, 192, 'k');
	helpButton.layer = 8;
	helpButton.image = helpImg;
	helpButton.scale = overlay.scale * 1.2;
}

/******************
setup for the game screen
*****************/
function gameScreenSetup() {
	// resets everything incase reloading from game screen or loading from end screen
	allSprites.removeAll();
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
	// a constant seed means that all players have the same experience and high scores are comparable
	randomSeed(WORLDSEED);
	//creates background
	bgSprite = new Sprite(WORLDX / 2, WORLDY / 2, WORLDX, WORLDY, "n");
	bgSprite.image = imgBG;
	bgSprite.layer = 0;
	//player and ui setup
	wormSetup();
	camera.x = player.x;
	camera.y = player.y;
	uiGameSetup();
	//overlay is used as the pause tint when in game screen
	overlay = new Sprite(WORLDX / 2, WORLDY / 2, WORLDX, WORLDY, "n");
	overlay.color = 'grey';
	overlay.opacity = 0.5;
	overlay.layer = 7;
	overlay.visible = false;
	//calls func to populate the world with food instead of waiting for it to spawn naturally
	initialFoodSetup();
}

/******************
subset of gameScreen setup for the worm
*****************/
function wormSetup() {
	//creates the player sprites (image and border) that are controled by the player and interact with the world
	playerBorder = new Sprite(3000, 900, WORMWIDTH, 'n');
	playerBorder.strokeWeight = 0;
	playerBorder.color = "black";
	playerBorder.layer = 2;
	player = new Sprite(playerBorder.x, playerBorder.y, WORMWIDTH - 2, "n");
	//salmon coloured worm :)
	player.color = "salmon";
	player.img = imgFaceHappy;
	player.strokeWeight = 0;
	player.layer = 4;
	//creates the tail sprites, they trail behind the player and are just asthetic
	//there are two sprites for each position, a worm coloured one and a black border one
	//means worm can have a border around the outside without you seeing it around all sides of WORMLENGTH amount of sprites
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
		//stored in arrays for easy access
	}
}

/******************
subset of gameScreen setup for the ui
*****************/
function uiGameSetup() {
	//create the buttons in the top right, only pause is visable to start with
	//set up to be have the right pos and scale for responsive web design
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
	//creating the hunger bar, has black background and a moving coloured rect to show hunger
	//uses hsl colour so one value can change linearly to shift from green to red
	colorMode(HSL, 360, 100, 100);
	hungerBar = new Sprite(camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONMARGIN, camera.y + (BUTTONWIDTH + BUTTONMARGIN) / 2 + (windowHeight - BUTTONWIDTH - BUTTONMARGIN * 11 - 6) * (1 - displayEnergy / MAXENERGY) / 2, BUTTONWIDTH - 6, (windowHeight - BUTTONWIDTH - BUTTONMARGIN * 11 - 6) * displayEnergy / MAXENERGY, 'n');
	hungerBar.layer = 6;
	hungerBar.color = color(10 + 90 * displayEnergy / MAXENERGY, 100, 50);
	colorMode(RGB, 255);
	hungerBarBackground = new Sprite(camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONMARGIN, camera.y + (BUTTONWIDTH + BUTTONMARGIN) / 2, BUTTONWIDTH, windowHeight - BUTTONWIDTH - BUTTONMARGIN * 11, 'n');
	hungerBarBackground.color = "black";
	hungerBarBackground.layer = 5;
}

/******************
subset of gameScreen setup for the initial food
*****************/
function initialFoodSetup() {
	//spawns food so that there is a set amount of pixels per food - feels the same nomater the world size
	for (let i = 0; i < WORLDX * WORLDY / INITIALFOODDENSITY; i++) {
		//calls the create food func and passes 'true' so it will not avoid spawning food on camera
		//this is a setup func so this happens before you load into the world (won't notice spawning food on camera)
		newFood(true);
	}
}

/******************
setup for the end screen
*****************/
function endScreenSetup() {
	//resets everything
	allSprites.removeAll();
	camera.x = windowWidth / 2;
	camera.y = windowHeight / 2;
	//in end screen overlay is background
	overlay = new Sprite(860, 540, 1920, 1080, "n");
	overlay.image = wormDeath;
	overlay.layer = 7;
	overlay.visible = true;
	//initial setup for responsive web design
	if (windowWidth / 1440 < windowHeight / 1440) {
		overlay.scale = windowWidth / 1620;
		overlay.x = windowWidth / 2;
		overlay.y = overlay.scale * 810;
	} else {
		overlay.scale = windowHeight / 1440;
		overlay.x = windowWidth / 2;
		overlay.y = windowHeight / 2;
	}
	//digit scale is based on overlay scale
	digit1 = new Sprite(overlay.x - 60 * overlay.scale, overlay.y + 215 * overlay.scale, 40, 70, 'n');
	digit1.scale = overlay.scale / 0.56;
	digit2 = new Sprite(digit1.x + 90 * overlay.scale, digit1.y, 40, 70, 'n');
	digit2.scale = digit1.scale;
	digit3 = new Sprite(digit2.x + 90 * overlay.scale, digit1.y, 40, 70, 'n');
	digit3.scale = digit1.scale;
	digit4 = new Sprite(digit3.x + 90 * overlay.scale, digit1.y, 40, 70, 'n');
	digit4.scale = digit1.scale;
	//calculate score, -480 is the score you would get if you don't eat anything. - makes sure that the min score is 0
	//also keeps score in the hundreds to thousands by increasing every tenth of a second instead of every frame (60th of a second)
	score = Math.floor(gameFrame / (FPS / 10)) - 480;
	//sets the digits to the right numbers using remainder dividing
	digit1.image = numImgNames[Math.floor(score / 1000) % 10];
	digit2.image = numImgNames[Math.floor(score / 100) % 10];
	digit3.image = numImgNames[Math.floor(score / 10) % 10];
	digit4.image = numImgNames[score % 10];

	//reset and home button scale are based on overlay scale
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
drawloop - gameplay loop
*****************/
function draw() {
	//drawloop is used as a screen changer, all the logic is in the screen funcs
	background('green');
	if (gameState == 'start') {
		startScreen();
	} else if (gameState == 'game') {
		gameScreen();
	} else if (gameState == 'end') {
		endScreen();
	}
}

/******************
startScreen code - called in drawloop when the game is on the start screen
*****************/
function startScreen() {
	//startTransition is a small delay between start button clicked and screen change (feels less abrupt / jarring)
	//only lets you interact when not transitioning to avoid spam clicking reseting click time causing screen to not change
	if (!startTransition) {
		//if clicking on start, start transition
		if (startButton.mouse.presses()) {
			clickTime = millis();
			startTransition = true;
		}
		//if clicking on how to play, open how to play window
		//uses .released not .presses to fix a bug
		if (helpButton.mouse.released()) {
			window.open('assets/images/instructions.svg', '_blank');
		}
		// if the transition delay is over switch screens
	} else if (millis() > clickTime + 50) {
		gameState = 'game';
		gameScreenSetup();
	}
}

/******************
gameScreen code - called in drawloop when the game is on the game screen
*****************/
function gameScreen() {
	//there is a delay between death and the switch to the death screen for a death animation to play
	//!died means code won't accept input when animation is playing
	if (!died) {
		//if pause is toggled, toggle pause
		if (kb.presses('p') || pauseButton.mouse.presses()) {
			isPaused = !isPaused;
			//toggles the background tint
			overlay.visible = !overlay.visible;
		}
		//only run the game when not paused
		if (!isPaused) {
			//iterate the gameFrame this is the core clock of the game used to calculate score and amount of food to spawn
			gameFrame++;
			//makes worm hungry and checks if food is close enough to eat
			hungerLogic();
			//hungerLogic needs to be behind playerMove to ensuere food has at least one frame where it overlaps with worm
			//hungerLogic triggers death, playerMove will trigger before the first !died check at the start of the loop
			//this causes face in death animation to be slightly ofset so extra !died check was needed
			if (!died) {
				//moves the player
				playerMove(WORMSPEED);
			}
			//calls the func to calc how much food to spawn
			spawnFood();
			//hides the paused only buttons (remember this only runs when game isn't paused)
			resetButton.visible = false;
			homeButton.visible = false;
			pauseButton.img = pauseImg;
		} else {
			//triggers when not paused isn't true, aka when paused
			//displays the paused only buttons
			resetButton.visible = true;
			homeButton.visible = true;
			pauseButton.img = playImg;
		}
		//calls func to move camera
		moveCamera(10);
		//calls func to move buttons and energy bar
		moveUiElements(5);
	} else if (millis() >= diedTime + 1000 * GAMESCREENDEATHTIME) {
		//if have been dead long enough for the death animation to play change to end screen
		gameState = 'end';
		endScreenSetup();
	} else {
		//if death animation is playing, accelerate the head downwards (for animation)
		player.vel.y += 0.5;
		//this one tail segment is being the background for the head (the head is an image (outline of a face) and has no fill)
		tailSegments[WORMLENGTH - 1].vel.y += 0.5;
	}
	//if clicking on the home or reset buttons then go start or reload game
	//only dispalyed when paused, can't die when paused, can't toggle pause during death animation
	//therefore these don't need to have an if not dead check
	if (homeButton.mouse.presses() && homeButton.visible) {
		gameState = 'start';
		startScreenSetup();
	} else if (resetButton.mouse.presses() && homeButton.visible) {
		allSprites.removeAll();
		gameScreenSetup();
	}
}

/******************
endScreen code - called in drawloop when the game is on the end screen
*****************/
function endScreen() {
	//if clicking on the home or reset buttons then go to start screen or game screen
	if (homeButton.mouse.presses() && homeButton.visible) {
		gameState = 'start';
		startScreenSetup();
	} else if (resetButton.mouse.presses() && homeButton.visible) {
		allSprites.removeAll();
		gameState = 'game';
		gameScreenSetup();
	}
}

/******************
handles the logic for the movement of the player sprites (the front segment of the worm), constraining it to the world bounds
*****************/
function playerMove(speed) {
	//declare local vars (has values to avoid initial NaN error)
	let movingX = true;
	let movingY = true;
	let xDirection = 0;
	let yDirection = 0;
	let toMoveX = 0;
	let toMoveY = 0;
	//keyboard input detection, checks which directions the player wants to go (if trying to go two opposite directions will be considered as no input)
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
	//if the player's y is the same as it was last frame (worm isn't moving along y-axis), amount to move along x-axis = full speed
	if (playerBorder.y == tailBorderSegments[lastFrameHeadSprite].y) {
		toMoveX = xDirection * speed;
	} else {
		//if the player's y is changing, move at reduced speed along x-axis (so total speed is constant)
		toMoveX = xDirection * Math.sqrt(speed ** 2 / 2);
	}
	//if the player's x is the same as it was last frame (worm isn't moving along x-axis), amount to move along y-axis = full speed
	if (playerBorder.x == tailBorderSegments[lastFrameHeadSprite].x) {
		toMoveY = yDirection * speed;
	} else {
		//if the player's x is changing, move at reduced speed along y-axis (so total speed is constant)
		toMoveY = yDirection * Math.sqrt(speed ** 2 / 2);
	}
	//update player location (toMove was used as a medium because if playerBorder.x was changed in place of tomMoveX it would alter the change in the worm's y)
	playerBorder.x += toMoveX;
	playerBorder.y += toMoveY;
	//constraint for player.x, stops worm going of the screen to the left or the right
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
	//move the player sprite (face) to the player border (colliding sprite)
	player.x = playerBorder.x;
	player.y = playerBorder.y;
	//if moving, update the tail (the 'if moving' check stops the tail from bunching up when stationary)
	if (movingX || movingY) {
		moveTail();
	}
}

/******************
moves the tail along behind the player sprites
*****************/
function moveTail() {
	//tailSprite is the id in array of the sprites at the end of the worm
	//teleports the tailSprite backround and fill segments to the worm's head
	tailSegments[tailSprite].x = player.x;
	tailSegments[tailSprite].y = player.y;
	tailBorderSegments[tailSprite].x = player.x;
	tailBorderSegments[tailSprite].y = player.y;
	//updates tailSprite to equal the id of the new sprites at the end of the worm
	tailSprite++;
	if (tailSprite == WORMLENGTH) {
		tailSprite = 0;
	}
	//does the same for lastFrameHeadSprite (used in playerMove func)
	lastFrameHeadSprite++;
	if (lastFrameHeadSprite == WORMLENGTH) {
		lastFrameHeadSprite = 0;
	}
}

/******************
called in the drawloop, code to move the camera smoothly towards the player and not to show outside the world bounds
*****************/
function moveCamera(percentPerFrame) {
	//increase the camera's position by a percentage of the dist between camera and player
	camera.x += (player.x - camera.x) * (percentPerFrame / 100)
	camera.y += (player.y - camera.y) * (percentPerFrame / 100)
	//stops the camera from showing anything outside the world bounds
	if (Math.abs(camera.x - WORLDX / 2) + windowWidth / 2 > WORLDX / 2) {
		camera.x = WORLDX / 2 + (camera.x - WORLDX / 2) / Math.abs(camera.x - WORLDX / 2) * (WORLDX / 2 - windowWidth / 2)
	}
	if (Math.abs(camera.y - WORLDY / 2) + windowHeight / 2 > WORLDY / 2) {
		camera.y = WORLDY / 2 + (camera.y - WORLDY / 2) / Math.abs(camera.y - WORLDY / 2) * (WORLDY / 2 - windowHeight / 2)
	}
}

/******************
code to move the ui in the gameScreen
*****************/
function moveUiElements(energyBarPercentPerFrame) {
	//set the buttons to a certain position based off of camera pos
	pauseButton.x = camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONMARGIN;
	pauseButton.y = camera.y - (windowHeight - BUTTONWIDTH) / 2 + BUTTONMARGIN;
	resetButton.x = camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONWIDTH - 2 * BUTTONMARGIN;
	resetButton.y = camera.y - (windowHeight - BUTTONWIDTH) / 2 + BUTTONMARGIN;
	homeButton.x = camera.x + (windowWidth - BUTTONWIDTH) / 2 - 2 * BUTTONWIDTH - 3 * BUTTONMARGIN;
	homeButton.y = camera.y - (windowHeight - BUTTONWIDTH) / 2 + BUTTONMARGIN;
	hungerBarBackground.x = camera.x + (windowWidth - BUTTONWIDTH) / 2 - BUTTONMARGIN;
	hungerBarBackground.y = camera.y + (BUTTONWIDTH + BUTTONMARGIN) / 2;
	hungerBarBackground.strokeWeight = 0;
	//dispay energy will interpolate towards actual energy, giving smooth increase when eating
	displayEnergy += (energy - displayEnergy) * (energyBarPercentPerFrame / 100);
	//uses hsl colour so one value can change linearly to shift from green to red
	colorMode(HSL, 360, 100, 100);
	//hunger bar has same x value as its background
	hungerBar.x = hungerBarBackground.x;
	//calculates appropriate hungerbar y value
	hungerBar.y = camera.y + (BUTTONWIDTH + BUTTONMARGIN) / 2 + (windowHeight - BUTTONWIDTH - BUTTONMARGIN * 11 - 6) * (1 - displayEnergy / MAXENERGY) / 2;
	//calculates appropriate height based on display energy
	hungerBar.height = (windowHeight - BUTTONWIDTH - BUTTONMARGIN * 11 - 6) * displayEnergy / MAXENERGY;
	//sets colour of hungerbar based on display energy
	hungerBar.color = color(10 + 90 * displayEnergy / MAXENERGY, 100, 50);
	hungerBar.strokeWeight = 0;
	colorMode(RGB, 255);
}

/******************
logic on when to spawn food throughout the game (not initialy)
*****************/
function spawnFood() {
	//food to spawn each frame follows a hyperbolic curve, decreasing fast, then slower as time goes on
	//it aproches an asomtote but never reaches it, meaning that there will always be some food spawned
	//the player must die eventuly as the asomtote of will be less food per second than the worm needs to survive
	foodToSpawn += (FOODABUNDANCE * (INITIALFOODPERSECOND - MINFOODPERSECOND)) / (gameFrame * (INITIALFOODPERSECOND - MINFOODPERSECOND) + FPS * FOODABUNDANCE) + MINFOODPERSECOND / FPS;
	//uses a variable to track how much food to spawn as it might only be a fraction each frame
	//foodToSpawn builds up until it reaches 1 and then calls the func which actuly creates and places the food.
	while (foodToSpawn >= 1) {
		foodToSpawn += -1;
		//the false means it must spawn someware of the screen
		newFood(false);
	}
}

/******************
func to spawn a piece of food, called during setup and throughout the game
*****************/
function newFood(spawnOnScreen) {
	//declare local variables
	// repeat starts as true so the while loop will be triggered
	let repeat = true;
	let x
	let y
	while (repeat) {
		//set repeat to false (if it works the first time it shouldn't repeat)
		repeat = false;
		//generate rand coords within the playable area
		x = random(FOODWIDTH, WORLDX - FOODWIDTH);
		y = random(SKYHEIGHT + GRASSHEIGHT + FOODWIDTH, WORLDY - FOODWIDTH);
		//only triggers if not supposed to spawn on screen (skiped in initial setup)
		if (!spawnOnScreen) {
			//checks if the coords would put the new food on the screen
			if (x >= camera.x - (windowWidth + FOODWIDTH) / 2 && x <= camera.x + (windowWidth + FOODWIDTH) / 2) {
				if (y >= camera.y - (windowHeight + FOODWIDTH) / 2 && y <= camera.y + (windowHeight + FOODWIDTH) / 2) {
					//causes the loop to repeat, trying again to find valid coords
					repeat = true;
					//skips the rest of the code in the current iteration of the loop
					//if coords need to be regenerated anyway there is no point in doing more checks
					continue;
				}
			}
		}
		//cycles through existing food
		for (let i = 0; i < foodLocations.length; i++) {
			//checks to see if the new coords would spawn food on top of or too close to existing food
			if (Math.max(Math.abs(foodLocations[i].x - x), Math.abs(foodLocations[i].y - y)) < FOODWIDTH + MINFOODSEPERATION) {
				//causes the loop to repeat, trying again to find valid coords
				repeat = true;
				//stops the current loop as we already know we need to regenerate coords
				//note: stops the for loop checking for overlaps with other food, not the while loop trying to spawn the new food
				break;
			}
		}
	}
	//once valid coords have been found create the new food and add it to the array
	let foodItem = new Sprite(x, y, FOODWIDTH, "n");
	foodItem.layer = 1;
	foodLocations.push(foodItem);
}

/******************
logic managing the worm's hunger system including eating eating food and triggering the end of the game
*****************/
function hungerLogic() {
	//iterates through all the food
	for (let i = foodLocations.length - 1; i >= 0; i--) {
		//if the food and the player sprite are overlapping (minus a margin of 7 pixels)
		if (Math.sqrt((playerBorder.x - foodLocations[i].x) ** 2 + (playerBorder.y - foodLocations[i].y) ** 2) < FOODWIDTH / 2 + WORMWIDTH / 2 - 7) {
			//delete the food in 100 miliseconds (6 frames) - makes it feel like it was eaten
			foodLocations[i].life = (FPS / 10);
			//remove food from array, letting new food can spawn in its spot
			foodLocations.splice(i, 1);
			//gives the player 5 seconds of energy
			energy += 5 * FPS;
		}
	}
	//slowly decrease energy
	energy += -1;
	//if we rely on displayEnergy's interpolation it will lag behind and you will die when it looks like you still have energy
	displayEnergy += -1;
	//if displayed energy is less than a quarter
	if (displayEnergy / MAXENERGY < 0.25) {
		//change face to eh
		player.img = imgFaceMeh;
		//else if displayed energy is less than half
	} else if (displayEnergy / MAXENERGY < 0.5) {
		//change face to OK
		player.img = imgFaceOk;
		//else (displayed energy will be above one half)
	} else {
		//change face to happy
		player.img = imgFaceHappy;
	}
	//caps the energy, stopping the player from getting more than a full bar
	if (energy > MAXENERGY) {
		energy = MAXENERGY;
		//if energy runs out
	} else if (energy <= 0) {
		//start death animation
		died = true;
		diedTime = millis();
		//hunger bar shouldn't be visable anyway as displayed energy should equal 0
		//removing it stops it from bugging out
		hungerBar.remove();

		//cycles through all of the tail sprites exept the last one
		for (let i = 0; i < WORMLENGTH - 1; i++) {
			//selects every third one
			if (Math.floor(i % 3) == 1) {
				//makes it collide
				tailSegments[i].collider = 'd';
				tailSegments[i].vel.x = random(-0.5, 0.5);
				tailSegments[i].vel.y = random(-0.5, 0.5);
			} else {
				//gets rid of the other two thirds
				tailSegments[i].remove();
			}
			//removes all of the border sprites
			tailBorderSegments[i].remove();
		}
		//removes the last tail border sprite
		tailBorderSegments[WORMLENGTH - 1].remove();
		//takes the last tail sprite and gives it the same propertys as the face
		//it's being the background for the head (the head is an image (outline of a face) and has no fill)
		tailSegments[WORMLENGTH - 1].x = player.x;
		tailSegments[WORMLENGTH - 1].y = player.y;
		tailSegments[WORMLENGTH - 1].vel.y = -17;
		//removes the player border
		playerBorder.remove();
		//causes the head to fly into the air and fall back down (the speed will decrease every frame in the endScreen func)
		player.vel.y = -17;
		player.img = imgFaceShock;
	}
}

/******************
triggers when the window size is altered, allowing for the program to re-adjust and re-center
*****************/
function windowResized() {
	//resize the canvas (basically the window into the world) to the screen size
	resizeCanvas(windowWidth, windowHeight);
	//code to run in start screen
	if (gameState == 'start') {
		//background image is 1440 by 1080, this checks to see if it is limited horizontally
		if (windowWidth / 1440 < windowHeight / 1080) {
			//ajust scale so width = windowwidth
			overlay.scale = windowWidth / 1440;
			overlay.x = windowWidth / 2;
			//keep positioned at the top of the screen
			overlay.y = overlay.scale * 540;
		} else {
			//if background is limited vertically, set height to window height
			overlay.scale = windowHeight / 1080;
			//keep positioned in the middle of the screen
			overlay.x = windowWidth / 2;
			overlay.y = windowHeight / 2;
		}
		//start and help button pos and scale are based on overlay
		startButton.x = overlay.x - 400 * overlay.scale;
		startButton.y = overlay.y + 320 * overlay.scale;
		startButton.scale = startButton.scale = overlay.scale * 1.2;
		helpButton.x = overlay.x + 250 * overlay.scale;
		helpButton.y = overlay.y + 320 * overlay.scale;
		helpButton.scale = startButton.scale = overlay.scale * 1.2;

		//code to run in end screen
	} else if (gameState == 'end') {
		//background image is 1620 by 1440, this checks to see if it is limited horizontally
		if (windowWidth / 1620 < windowHeight / 1440) {
			//ajust scale so width = windowwidth
			overlay.scale = windowWidth / 1620;
			overlay.x = windowWidth / 2;
			//keep positioned at the top of the screen
			overlay.y = overlay.scale * 720;
		} else {
			//if background is limited vertically, set height to window height
			overlay.scale = windowHeight / 1440;
			//keep positioned in the middle of the screen
			overlay.x = windowWidth / 2;
			overlay.y = windowHeight / 2;
		}
		//digit pos and scale are based on overlay
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
		//reset and home button pos and scale are based on overlay
		resetButton.x = overlay.x + 100 * overlay.scale;
		resetButton.y = overlay.y + 500 * overlay.scale;
		homeButton.x = overlay.x - 400 * overlay.scale;
		homeButton.y = overlay.y + 500 * overlay.scale;
		homeButton.scale = 4 * overlay.scale;
		resetButton.scale = 4 * overlay.scale;
	}
};