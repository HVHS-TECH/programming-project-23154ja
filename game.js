
/******************
preload
*****************/
	
function preload() {

  imgBG   = loadImage('assets/images/supersushi4.png');

}

var worldX = 3204;

var worldY = 1802;

/******************
setup
*****************/

function setup() {

	bg = new Sprite(worldX/2, worldY/2, worldX, worldY, "n");
	bg.image = imgBG;
	bg.depth = 100;

    
    console.log("setup");
    frameRate(60);

    cnv = new Canvas(windowWidth, windowHeight);

	
    player = new Sprite(50, 50, 50, 50);

	player.layer = 10;

	
	camera.x=player.x;
	camera.y=player.y;

    drawWalls();
}




/******************
drawFunc
*****************/

function draw() {
    
    background('green');


	//cnv.drawImage(imgBG, 0, 0, worldX, worldY);

   controls();

   // camera.moveTo(player.x, player.y, 3)
    //camera.x=player.x;
    //camera.y=player.y;
	camera.x += (player.x - camera.x) * 0.1
	camera.y += (player.y - camera.y) * 0.1

	if (Math.abs(camera.x-worldX/2)+windowWidth/2>worldX/2) {

		camera.x = worldX/2+(camera.x-worldX/2)/Math.abs(camera.x-worldX/2)*(worldX/2-windowWidth/2)

	}

		if (Math.abs(camera.y-worldY/2)+windowHeight/2>worldY/2) {

		camera.y = worldY/2+(camera.y-worldY/2)/Math.abs(camera.y-worldY/2)*(worldY/2-windowHeight/2)

	}
    
   // console.log("camera then player");
   // console.log(camera.x);
   // console.log(camera.y);
   // console.log(player.x);
   // console.log(player.y);
}


function controls () {
    
	if (kb.pressing('left') && !kb.pressing('right')) {
		player.vel.x = -5;
	} 

	else if (kb.pressing('right') && !kb.pressing('left')) {
		player.vel.x = 5;
	} 

	else {
		player.vel.x = 0;
	}


	
	if (kb.pressing('up') && !kb.pressing('down')) {
		player.vel.y = -5;
	} 

	else if (kb.pressing('down') && !kb.pressing('up')) {
		player.vel.y = 5;
	} 

	else {
		player.vel.y = 0;
	}


}


function drawWalls() {



	wallLH  = new Sprite(0, worldY/2, 8, worldY, 'k');

	wallLH.color = 'black';

	wallLH.bounciness = 0;
	wallLH.friction = 0;
	wallLH.drag = 0;




	wallRH  = new Sprite(worldX, worldY/2, 8, worldY, 'k');

	wallRH.color = 'green';

	wallRH.bounciness = 0;
	wallRH.friction = 0;
	wallRH.drag = 0;




	wallTop = new Sprite(worldX/2, 0, worldX, 8, 'k');

	wallTop.color = 'blue';

	wallTop.bounciness = 0;
	wallTop.friction = 0;
	wallTop.drag = 0;






	wallBottom = new Sprite(worldX/2, worldY, worldX, 8, 'k');

	wallBottom.color = 'red';

	wallBottom.bounciness = 0;
	wallBottom.friction = 0;
	wallBottom.drag = 0;
	//wallBot = new Sprite(x, y, w, h, 'k');

}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
};