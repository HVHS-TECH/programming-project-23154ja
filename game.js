
/******************
preload
*****************/
	
function preload() {

  imgBG   = loadImage('assets/images/supersushi4.png');

}

const WORLDX = 3204;

const WORLDY = 1802;

const WORMLENGTH = 60;

const WORMSPEED = 5;

let lastSegment = 0;

let tailSegments = [];
let tailBorderSegments = [];


/******************
setup
*****************/

function setup() {

	bg = new Sprite(WORLDX/2, WORLDY/2, WORLDX, WORLDY, "n");
	bg.image = imgBG;
	bg.depth = 100;

    
    console.log("setup");
    frameRate(60);

    cnv = new Canvas(windowWidth, windowHeight);


	playerBorder = new Sprite(500, 50, 52);

	playerBorder.strokeWeight=0;

	playerBorder.color="black";

	playerBorder.layer = 1;

	
    player = new Sprite(500, 50, 50, "n");

	player.color = "salmon";

	player.strokeWeight=0;

	player.layer = 10;





	for (i = 0; i < WORMLENGTH; i++) {

	tailBorder = new Sprite(player.x+(i-60)*WORMSPEED, player.y, 52, "n");

	tailBorder.layer = 1;

	tailBorder.color = "black";

	tailBorder.strokeWeight=0;

	tailBorderSegments.push(tailBorder);



	tail = new Sprite(player.x+(i-60)*WORMSPEED, player.y, 50, "n");

	tail.layer = 2;

	tail.color = "salmon";

	tail.strokeWeight = 0;

	tailSegments.push(tail);

	}


console.log(tailBorderSegments);
	
	camera.x=player.x;
	camera.y=player.y;

    drawWalls();
}




/******************
drawFunc
*****************/

function draw() {
    
    background('green');


	

	
	//temp = new Sprite(player.x, player.y, 50, 50, "n");

	//temp.life = 60

	//temp.color = "blue";

	//cnv.drawImage(imgBG, 0, 0, WORLDX, WORLDY);

   controls(WORMSPEED);

   // camera.moveTo(player.x, player.y, 3)
    //camera.x=player.x;
    //camera.y=player.y;

	moveCamera(5);
    
   // console.log("camera then player");
   // console.log(camera.x);
   // console.log(camera.y);
   // console.log(player.x);
   // console.log(player.y);
}


function controls (playerSpeed) {

	let movingX = true;
	let movingY = true;
    
	if (kb.pressing('left') && !kb.pressing('right')) {
		player.x += -playerSpeed;
	} 

	else if (kb.pressing('right') && !kb.pressing('left')) {
		player.x += playerSpeed;
	} 

	else {
		player.vel.x = 0;

		movingX = false;
	}


	
	if (kb.pressing('up') && !kb.pressing('down')) {
		player.y += -playerSpeed;
	} 

	else if (kb.pressing('down') && !kb.pressing('up')) {
		player.y += playerSpeed;
	} 

	else {
		player.vel.y = 0;

		movingY = false;
	}

	playerBorder.x=player.x;
	playerBorder.y=player.y;

	if (movingX || movingY) {
		moveTail();
	}

}


function drawWalls() {



	wallLH  = new Sprite(0, WORLDY/2, 8, WORLDY, 'k');

	wallLH.color = 'black';

	wallLH.bounciness = 0;
	wallLH.friction = 0;
	wallLH.drag = 0;




	wallRH  = new Sprite(WORLDX, WORLDY/2, 8, WORLDY, 'k');

	wallRH.color = 'green';

	wallRH.bounciness = 0;
	wallRH.friction = 0;
	wallRH.drag = 0;




	wallTop = new Sprite(WORLDX/2, 0, WORLDX, 8, 'k');

	wallTop.color = 'blue';

	wallTop.bounciness = 0;
	wallTop.friction = 0;
	wallTop.drag = 0;






	wallBottom = new Sprite(WORLDX/2, WORLDY, WORLDX, 8, 'k');

	wallBottom.color = 'red';

	wallBottom.bounciness = 0;
	wallBottom.friction = 0;
	wallBottom.drag = 0;
	//wallBot = new Sprite(x, y, w, h, 'k');

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