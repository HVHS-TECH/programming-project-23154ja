
/******************
preload
*****************/
	
function preload() {

  imgBG   = loadImage('assets/images/supersushi4.png');

}

/******************
setup
*****************/

function setup() {
    
    console.log("setup");
    frameRate(60);

    cnv = new Canvas(3204, 1802);

    player = new Sprite(50, 50, 50, 50);

    drawWalls();
}




/******************
drawFunc
*****************/

function draw() {
    
    background("imgBG");
    camera.moveTo(player.x, player.y, 1)
   // camera.x=player.x;
   // camera.y=player.y;

   controls();
    
    console.log("camera then player");
    console.log(camera.x);
    console.log(camera.y);
    console.log(player.x);
    console.log(player.y);
}


function controls () {
    
	if (kb.pressing('left')) {

		player.vel.x = player.vel.x - 5;


	}  
    
    if (kb.pressing ('right')) {

		player.vel.x = player.vel.x + 5;
       

	};

    if (player.vel.x>5) {

        player.vel.x=5;
    } else if (player.vel.x<-5) {
        player.vel.x=-5;
    }



	if (kb.released('left')) {

	player.vel.x = 0;

	} else if (kb.released('right')) {

		player.vel.x = 0;
	}

	if (kb.pressing('up')) {

		player.vel.y = -5;


	} else if (kb.pressing ('down')) {

		player.vel.y = 5;
	}

	if (kb.released('up')) {

	player.vel.y = 0;

	} else if (kb.released('down')) {

		player.vel.y = 0;
	}

}


function drawWalls() {



	wallLH  = new Sprite(0, 901, 8, 1802, 'k');

	wallLH.color = 'black';

	wallLH.bounciness = 0;
	wallLH.friction = 0;
	wallLH.drag = 0;




	wallRH  = new Sprite(windowWidth, windowHeight/2, 8, windowHeight, 'k');

	wallRH.color = 'green';

	wallRH.bounciness = 0;
	wallRH.friction = 0;
	wallRH.drag = 0;




	wallTop = new Sprite(windowWidth/2, 0, windowWidth, 8, 'k');

	wallTop.color = 'blue';

	wallTop.bounciness = 0;
	wallTop.friction = 0;
	wallTop.drag = 0;






	wallBottom = new Sprite(windowWidth/2, windowHeight, windowWidth, 8, 'k');

	wallBottom.color = 'red';

	wallBottom.bounciness = 0;
	wallBottom.friction = 0;
	wallBottom.drag = 0;
	//wallBot = new Sprite(x, y, w, h, 'k');

}