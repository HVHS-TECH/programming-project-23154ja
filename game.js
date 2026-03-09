
/******************
preload
*****************/
	
function preload() {

  imgBG   = loadImage('assets/images/supersushi4.png');


}

const WORLDX = 6000;

const WORLDY = 6000;

const WORMLENGTH = 60;

const WORMWIDTH = 52;

const WORMSPEED = 5;

let lastSegment = 0;

let tailSegments = [];
let tailBorderSegments = [];


/******************
setup
*****************/

function setup() {
	imgBG.resize(6000,6000);


	bg = new Sprite(WORLDX/2, WORLDY/2, WORLDX, WORLDY, "n");
	bg.image = imgBG;
	bg.depth = 100;

    
    console.log("setup");
    frameRate(60);

    cnv = new Canvas(windowWidth, windowHeight);

	wormSetup();
	
	camera.x=player.x;
	camera.y=player.y;

}


function wormSetup() {
		
	playerBorder = new Sprite(500, 50, WORMWIDTH);

	playerBorder.strokeWeight=0;

	playerBorder.color="black";

	playerBorder.layer = 1;

	
    player = new Sprite(500, 50, WORMWIDTH-2, "n");

	player.color = "salmon";

	player.strokeWeight=0;

	player.layer = 10;





	for (i = 0; i < WORMLENGTH; i++) {

	tailBorder = new Sprite(player.x+(i-60)*WORMSPEED, player.y, WORMWIDTH, "n");

	tailBorder.layer = 1;

	tailBorder.color = "black";

	tailBorder.strokeWeight=0;

	tailBorderSegments.push(tailBorder);



	tail = new Sprite(player.x+(i-60)*WORMSPEED, player.y, WORMWIDTH-2, "n");

	tail.layer = 2;

	tail.color = "salmon";

	tail.strokeWeight = 0;

	tailSegments.push(tail);

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


function playerMove (speed) {

	let movingX = true;
	let movingY = true;
    
	if (kb.pressing('left') && !kb.pressing('right')) {
		playerBorder.x += -speed;
	} 

	else if (kb.pressing('right') && !kb.pressing('left')) {
		playerBorder.x += speed;
	} 

	else {
		playerBorder.vel.x = 0;

		movingX = false;
	}


	
	if (kb.pressing('up') && !kb.pressing('down')) {
		playerBorder.y += -speed;
	} 

	else if (kb.pressing('down') && !kb.pressing('up')) {
		playerBorder.y += speed;
	} 

	else {
		playerBorder.vel.y = 0;

		movingY = false;
	}


	if (Math.abs(playerBorder.x-WORLDX/2)+WORMWIDTH/2>WORLDX/2) {

		playerBorder.x = WORLDX/2+(playerBorder.x-WORLDX/2)/Math.abs(playerBorder.x-WORLDX/2)*(WORLDX/2-WORMWIDTH/2)

		movingX = false;

	}

		if (Math.abs(playerBorder.y-WORLDY/2)+WORMWIDTH/2>WORLDY/2) {

		playerBorder.y = WORLDY/2+(playerBorder.y-WORLDY/2)/Math.abs(playerBorder.y-WORLDY/2)*(WORLDY/2-WORMWIDTH/2)

		movingY = false;

	}


	player.x=playerBorder.x;
	player.y=playerBorder.y;

	if (movingX || movingY) {
		moveTail();
	}

}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
};


function moveCamera(percentPerFrame) {
	
	camera.x += (player.x - camera.x) * (percentPerFrame/100)
	camera.y += (player.y - camera.y) * (percentPerFrame/100)

	if (Math.abs(camera.x-WORLDX/2)+windowWidth/2>WORLDX/2) {

		camera.x = WORLDX/2+(camera.x-WORLDX/2)/Math.abs(camera.x-WORLDX/2)*(WORLDX/2-windowWidth/2)

	}

		if (Math.abs(camera.y-WORLDY/2)+windowHeight/2>WORLDY/2) {

		camera.y = WORLDY/2+(camera.y-WORLDY/2)/Math.abs(camera.y-WORLDY/2)*(WORLDY/2-windowHeight/2)

	}
}


function moveTail() {
	tailSegments[lastSegment].x=player.x;
	tailSegments[lastSegment].y=player.y;

	tailBorderSegments[lastSegment].x=player.x;
	tailBorderSegments[lastSegment].y=player.y;

	lastSegment++;
	if (lastSegment==WORMLENGTH) {
		lastSegment=0;
	}
}