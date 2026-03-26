const FPS = 60;

const WORLDX = 8192;

const WORLDY = 8192;

const buttonWidth = 60;

const buttonMargin = 10;

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

const maxEnergy = 64 * 60;
const initialEnergy = 48 * 60; 
const gameScreenDeathTime = 5;

const WORLDSEED = 112358;

//p5 play vars

let imgBG;

let imgFace;

let pauseImg;

let playImg;

let resetImg;

let homeImg;

let bgSprite;

let cnv;

let player;

let playerBorder;

let faceSprite;

let foodGroup;

let pauseButton;

let resetButton;

let homeButton;


let gameState = 'start';
let gameFrame;
let isPaused;

let foodToSpawn;

let lastFrameHeadSprite;
let tailSprite;

let energy;
let displayEnergy;
let died;
let diedTime;

let tailSegments = [];
let tailBorderSegments = [];

let foodLocations = [];




/******************
preload
*****************/

function preload() {

	imgBG = loadImage('assets/images/background.webp');

	imgFace = loadImage('assets/images/face.png');

	pauseImg = loadImage('assets/images/buttonImages/pause.png');

	playImg = loadImage('assets/images/buttonImages/play.png');

	resetImg = loadImage('assets/images/buttonImages/reset.png');

	homeImg = loadImage('assets/images/buttonImages/home.png');


}


/******************
setup
*****************/

function setup() {
	frameRate(FPS);

	noSmooth();

	pixelDensity(1);

	cnv = new Canvas(windowWidth, windowHeight);
}


function gameScreenSetup() {
	//reset vars
	isPaused = false;
	gameFrame = 0;
	foodToSpawn = 0;
	lastFrameHeadSprite = WORMLENGTH - 2;
	tailSprite = 0;
	energy = initialEnergy;
	displayEnergy = energy;
	died = false;
	tailSegments = [];
	tailBorderSegments = [];
	foodLocations = [];

		randomSeed(WORLDSEED);

	bgSprite = new Sprite(WORLDX / 2, WORLDY / 2, WORLDX, WORLDY, "n");
	bgSprite.image = imgBG;
	bgSprite.depth = 100;

	wormSetup();

	camera.x = player.x;
	camera.y = player.y;

	uiGameSetup();

	initialFoodSetup();
}

function wormSetup() {
	playerBorder = new Sprite(3000, 900, WORMWIDTH, 'n');

	playerBorder.strokeWeight = 0;

	playerBorder.color = "black";

	playerBorder.layer = 5;


	player = new Sprite(playerBorder.x, playerBorder.y, WORMWIDTH - 2, "n");

	player.color = "salmon";

	player.img = imgFace;

	player.strokeWeight = 0;

	player.layer = 10;


	for (let i = 1; i <= WORMLENGTH; i++) {

		let tailBorder = new Sprite(player.x + (i - WORMLENGTH) * WORMSPEED, player.y, WORMWIDTH, "n");

		tailBorder.layer = 5;

		tailBorder.color = "black";

		tailBorder.strokeWeight = 0;

		tailBorderSegments.push(tailBorder);



		let tail = new Sprite(player.x + (i - WORMLENGTH) * WORMSPEED, player.y, WORMWIDTH - 2, "n");

		tail.layer = 7;

		tail.color = "salmon";

		tail.strokeWeight = 0;

		tailSegments.push(tail);

	}
}

function uiGameSetup() {
	pauseButton = new Sprite(camera.x + (windowWidth - buttonWidth) / 2 - buttonMargin, camera.y - (windowHeight - buttonWidth) / 2 + buttonMargin, buttonWidth, buttonWidth, "k");
	pauseButton.image = pauseImg;

	resetButton = new Sprite(camera.x + (windowWidth - buttonWidth) / 2 - buttonWidth - 2 * buttonMargin, camera.y - (windowHeight - buttonWidth) / 2 + buttonMargin, buttonWidth, buttonWidth, "k");
	resetButton.visible = false;
	resetButton.image = resetImg;


	homeButton = new Sprite(camera.x + (windowWidth - buttonWidth) / 2 - 2 * buttonWidth - 3 * buttonMargin, camera.y - (windowHeight - buttonWidth) / 2 + buttonMargin, buttonWidth, buttonWidth, "k");
	homeButton.visible = false;
	homeButton.image = homeImg;

	hungerBar =new Sprite(camera.x+(windowWidth-buttonWidth)/2-buttonMargin,camera.y+(buttonWidth+buttonMargin)/2+(windowHeight-buttonWidth-buttonMargin*11-6)*(1-displayEnergy/maxEnergy)/2,buttonWidth-6,(windowHeight-buttonWidth-buttonMargin*11-6)*displayEnergy/maxEnergy, 'n');
	hungerBar.layer=6;

	hungerBarBackground = new Sprite(camera.x+(windowWidth-buttonWidth)/2-buttonMargin,camera.y+(buttonWidth+buttonMargin)/2,buttonWidth,windowHeight-buttonWidth-buttonMargin*11,'n');
	hungerBarBackground.color= "black"; 
	hungerBarBackground.layer=5;
}

function initialFoodSetup() {

	foodGroup = new Group();

	for (let i = 0; i < WORLDX * WORLDY / INITIALFOODDENSITY; i++) {
		newFood(true);
	}
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
	if (kb.presses('p')) {
		gameState = 'game';
		gameScreenSetup();
	}
}


function gameScreen() {
if (!died) {
	if (kb.presses('p') || pauseButton.mouse.presses()) {
		isPaused = !isPaused;
	}
	if (!isPaused) {
		gameFrame++;
		hungerLogic();
		playerMove(WORMSPEED);
		spawnFood();
		resetButton.visible = false;
		homeButton.visible = false;
		pauseButton.img=pauseImg;
	} else {
		resetButton.visible = true;
		homeButton.visible = true;
		pauseButton.img=playImg;
	}
	moveCamera(10);
	moveButtons(5);
} else if (millis()>=diedTime+1000*gameScreenDeathTime){
gameState='end';
} else{
	player.vel.y+=0.5;
	tailSegments[WORMLENGTH-1].vel.y+=0.5;
}
	if (homeButton.mouse.presses() && homeButton.visible) {
		gameState = 'start'
		allSprites.removeAll();
	}else if (resetButton.mouse.presses()&&homeButton.visible){
			allSprites.removeAll();
			gameScreenSetup();
	}
}

function endScreen() { }

function playerMove(speed) {

	let movingX = true;
	let movingY = true;
	let xDirection = 0;
	let yDirection = 0;
	let toMoveX = 0;
	let toMoveY = 0;

	if (kb.pressing('left') && !kb.pressing('right')) {
		xDirection = -1;
	}

	else if (kb.pressing('right') && !kb.pressing('left')) {
		xDirection = 1;
	}

	else {
		playerBorder.vel.x = 0;

		movingX = false;
	}



	if (kb.pressing('up') && !kb.pressing('down')) {
		yDirection = -1;
	}

	else if (kb.pressing('down') && !kb.pressing('up')) {
		yDirection = 1;
	}

	else {
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

	{	//then
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
	pauseButton.x = camera.x + (windowWidth - buttonWidth) / 2 - buttonMargin;
	pauseButton.y = camera.y - (windowHeight - buttonWidth) / 2 + buttonMargin;

	resetButton.x = camera.x + (windowWidth - buttonWidth) / 2 - buttonWidth - 2 * buttonMargin;
	resetButton.y = camera.y - (windowHeight - buttonWidth) / 2 + buttonMargin;

	homeButton.x = camera.x + (windowWidth - buttonWidth) / 2 - 2 * buttonWidth - 3 * buttonMargin;
	homeButton.y = camera.y - (windowHeight - buttonWidth) / 2 + buttonMargin;

hungerBarBackground.x=camera.x+(windowWidth-buttonWidth)/2-buttonMargin;
hungerBarBackground.y=camera.y+(buttonWidth+buttonMargin)/2;

displayEnergy += (energy - displayEnergy) * (energyBarPercentPerFrame / 100);

hungerBar.x=hungerBarBackground.x;
hungerBar.y=camera.y+(buttonWidth+buttonMargin)/2+(windowHeight-buttonWidth-buttonMargin*11-6)*(1-displayEnergy/maxEnergy)/2;
hungerBar.height=(windowHeight-buttonWidth-buttonMargin*11-6)*displayEnergy/maxEnergy;
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

	foodGroup.add(foodItem);
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
	energy += -10;
	displayEnergy+=-10;

	if (energy >maxEnergy) {
		energy = maxEnergy;

	} else if (energy<=0) {
		died=true;
		diedTime=millis();
		hungerBar.remove();

		for (let i = 0; i < WORMLENGTH-1; i++) {
			if(Math.floor(i%3)==1){
				tailSegments[i].collider='d';
				tailSegments[i].vel.x=random(-0.5,0.5);
				tailSegments[i].vel.y=random(-0.5,0.5);

			} else {
		tailSegments[i].remove();
			}
			tailBorderSegments[i].remove();
	}
	tailBorderSegments[WORMLENGTH-1].remove();
	tailSegments[WORMLENGTH-1].x=player.x;
	tailSegments[WORMLENGTH-1].y=player.y;
	tailSegments[WORMLENGTH-1].vel.y=-17;
		playerBorder.remove();
		player.vel.y=-17;
	}
}