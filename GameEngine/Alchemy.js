//Samantha Scoggins: smscoggi
//Giovanni Espinosa: gespino
//George Yang: ggyang



addSprite("https://i.imgur.com/KKigDQ5.jpg", 1);
addSprite("https://i.imgur.com/sPl17tf.jpg", 2);
addSprite("https://i.imgur.com/tSfVTJ1.jpg", 3);
addSprite("http://i.imgur.com/CuQvdVG.png", 4);
addDrawnSprite(sprites[0])
addDrawnSprite(sprites[1])

function onmousedown(){
	for (var iter = 0; iter < sprites.length; iter++) {
		if (checkSprite(sprites[iter], xcoord, ycoord)) {
			if (draggingImage == false) {
				selectedImage = iter;
			}

			draggingImage = true;
			break;
		}
	}
}


function checkMyCollisions(){
	var collisonArray = new Array();
	collisonArray = checkAllCollisions();
	if (collided) {
		mix(collisonArray);
	}
	draggingImage = false;
}

function update() {
	if(mouseisdown == 'yes') {
		onmousedown();
	}
	if(mouseisup == 'yes') {
		checkMyCollisions();
		selectedImage = -1;
	}
	if(draggingImage == true){
		dragSprite();
	}  
}

function draw() {
	canvas.width = canvas.width;
	context.fillStyle="#ffdead";
	context.fillRect(0,0,canvas.width,canvas.height);

	addText("15px","Verdana","Image count: " + drawnSprites.length);

	//draw selected outline
	selectedOutline();
	////draw everything in drawnSprites array
	drawSprites();

}

function mix(array){
	var num = array[0].ID + array[1].ID;
	if(num <= sprites.length) {
		var alreadyMixed = false;
		for(var iter = 0; iter < drawnSprites.length; iter++){
			if(drawnSprites[iter].ID == num){
				alreadyMixed = true;
				break;
			}
		}
		if(!alreadyMixed){
			var tempDrawn = new Array();
			loopNum = drawnSprites.length;
			for(var iter = 0; iter < loopNum; iter++){
				tempDrawn.push(drawnSprites.pop());
			}
			for(var iter = 0; iter < loopNum; iter++){
				addDrawnSprite(tempDrawn.pop());
			}
			addDrawnSprite(sprites[num-1]);
			//drawnSprites.push(sprites[2]);
		}
	}
	collided = false;
}


function game_loop() {
	update();
	draw();
}

setInterval(game_loop, 30);