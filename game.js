const WORLDX = 10000;

const WORLDY = 10000;

const SKYHEIGHT	= 1300;

const WORMLENGTH = 67;

const WORMWIDTH = 52;

const WORMSPEED = 5;

const FOODSPACING = 1000 ** 2;

const WORLDSEED = 112358;

//p5 play vars

let imgBG;

let imgFace;

let bgSprite;

let cnv;

let player;

let playerBorder;

let faceSprite;

let foodGroup;

let firstSegment = WORMLENGTH - 1;
let lastSegment = 0;

let tailSegments = [];
let tailBorderSegments = [];



//fix tail not teleporting when hitting wall

// make background crisp

/******************
preload
*****************/

function preload() {

	imgBG = loadImage('assets/images/background.png');

	imgFace = loadImage('assets/images/face.png');

}


/******************
setup
*****************/

function setup() {
	frameRate(60);

	randomSeed(WORLDSEED);

	noSmooth();

	pixelDensity(1);

	imgBG.resize(WORLDX, WORLDY);

	cnv = new Canvas(windowWidth, windowHeight);

	bgSprite = new Sprite(WORLDX / 2, WORLDY / 2, WORLDX, WORLDY, "n");
	bgSprite.image = imgBG;
	bgSprite.depth = 100;

	wormSetup();

	initalFoodSetup();

	camera.x = player.x;
	camera.y = player.y;

}


function wormSetup() {

	playerBorder = new Sprite(500, 1500, WORMWIDTH);

	playerBorder.strokeWeight = 0;

	playerBorder.color = "black";

	playerBorder.layer = 1;


	player = new Sprite(playerBorder.x, playerBorder.y, WORMWIDTH - 2, "n");

	player.color = "salmon";

	player.img = imgFace;

	player.strokeWeight = 0;

	player.layer = 9;



	for (let i = 1; i <= WORMLENGTH; i++) {

		let tailBorder = new Sprite(player.x + (i - WORMLENGTH) * WORMSPEED, player.y, WORMWIDTH, "n");

		tailBorder.layer = 1;

		tailBorder.color = "black";

		tailBorder.strokeWeight = 0;

		tailBorderSegments.push(tailBorder);



		let tail = new Sprite(player.x + (i - WORMLENGTH) * WORMSPEED, player.y, WORMWIDTH - 2, "n");

		tail.layer = 2;

		tail.color = "salmon";

		tail.strokeWeight = 0;

		tailSegments.push(tail);

	}
}

function initalFoodSetup() {

	foodGroup = new Group();

	for (let i = 0; i < WORLDX * WORLDY / FOODSPACING; i++) {

		let foodItem = new Sprite(random(WORLDX), random(WORLDY), "n");
		foodGroup.add(foodItem);
	}
}

/******************
drawFunc
*****************/

function draw() {

	background('green');

	playerMove(WORMSPEED);

	moveCamera(5);

}


function playerMove(speed) {

	let movingX = true;
	let movingY = true;
	let xDirection = 0;
	let yDirection = 0;

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


	if (!movingY) {

		playerBorder.x += xDirection * speed;

	} else {

		playerBorder.x += xDirection * Math.sqrt(speed ** 2 / 2);

	}

	if (!movingX) {

		playerBorder.y += yDirection * speed;

	} else {

		playerBorder.y += yDirection * Math.sqrt(speed ** 2 / 2)

	}



	if (Math.abs(playerBorder.x - WORLDX / 2) + WORMWIDTH / 2 > WORLDX / 2) {

		playerBorder.x = WORLDX / 2 + (playerBorder.x - WORLDX / 2) / Math.abs(playerBorder.x - WORLDX / 2) * (WORLDX / 2 - WORMWIDTH / 2)

		if (playerBorder.x == tailBorderSegments[firstSegment].x) {
			movingX = false;
		}

	}

	//fixx t5his here world 

	if (Math.abs(playerBorder.y - (SKYHEIGHT + (WORLDY-SKYHEIGHT) / 2)) + WORMWIDTH / 2 > (WORLDY-SKYHEIGHT) / 2) {

		playerBorder.y = (SKYHEIGHT + (WORLDY-SKYHEIGHT) / 2) + (playerBorder.y - WORLDY / 2) / Math.abs(playerBorder.y - WORLDY / 2) * (WORLDY / 2 - WORMWIDTH / 2)

		if (playerBorder.y == tailBorderSegments[firstSegment].y) {
			movingY = false;
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


function moveTail() {
	tailSegments[lastSegment].x = player.x;
	tailSegments[lastSegment].y = player.y;

	tailBorderSegments[lastSegment].x = player.x;
	tailBorderSegments[lastSegment].y = player.y;

	lastSegment++;
	if (lastSegment == WORMLENGTH) {
		lastSegment = 0;
	}

	firstSegment++;
	if (firstSegment == WORMLENGTH) {
		firstSegment = 0;
	}
}


function spawnFood() {

}