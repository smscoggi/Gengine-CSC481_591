//Samantha Scoggins: smscoggi
//Giovanni Espinosa: gespino
//George Yang: ggyang


canvas = document.getElementById("whyupdate");
context = canvas.getContext('2d');

var sprites = new Array();
var drawnSprites = new Array();

function Sprite(x, y, width, height, src, ID) {
	this.X = x;
	this.Y = y;
	this.image = new Image();
	this.image.width = width;
	this.image.height = height;
	this.image.src = src;
	this.ID = ID;
}

function checkSprite(sprite, x, y) {
	var minX = sprite.X;
	var maxX = sprite.X + sprite.image.width;
	var minY = sprite.Y;
	var maxY = sprite.Y + sprite.image.height;
	var mx = x;
	var my = y;
	if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
		return true;
	}
	return false;
}

function addSprite(path, ID){
	tempSprite = new Sprite(20, 0, 100, 100, path, ID);
	sprites.push(tempSprite);
}
/////can't use really for snake... need to generalize////
function addDrawnSprite(Sprite) {
	var newY = 0;
	if(drawnSprites.length > 0){
		newY = drawnSprites[drawnSprites.length-1].Y + 140;
	}
	else{
		newY = 40;
	}
	Sprite.X = 20;
	Sprite.Y = newY;
	drawnSprites.push(Sprite);
}

function addDrawnSprites(oldSprite,newX,newY,newHeight,newWidth,newid) {
	var tempSprite = new Sprite(newX,newY,newWidth,newHeight,oldSprite.image.src,newid);
	drawnSprites.push(tempSprite);


}

function removeDrawnSprite(oldSprite){
	for(var i=0; i<drawnSprites.length; i++){
		if(drawnSprites[i].ID == oldSprite.ID){
			drawnSprites.splice(i,1);
		}
	}


}

function findSprite(spritearray,id){
	
	for(var i=0; i<spritearray.length; i++){
		if(spritearray[i].ID == id){
			

			return spritearray[i];
			
		}
	}
	return null;

}


///////////////////////////////////////

function addText(size,font,text, xLocation, yLocation,fillstyle){
	context.font = size+" "+font;
	context.fillStyle=fillstyle;
	context.fillText(text, xLocation, yLocation);
}

function selectedOutline(){
	if (selectedImage >= 0) {
		context.beginPath();
		context.lineWidth = "9";
		context.strokeStyle = "blue";
		context.rect(drawnSprites[selectedImage].X, drawnSprites[selectedImage].Y, drawnSprites[selectedImage].image.width, drawnSprites[selectedImage].image.height);
		context.stroke();

	}
}

function drawSprites(){
	for (var iter = 0; iter < drawnSprites.length; iter++) {
		context.drawImage(drawnSprites[iter].image, drawnSprites[iter].X, drawnSprites[iter].Y, drawnSprites[iter].image.width, drawnSprites[iter].image.height);
	}
}

function dragSprite(){
	sprites[selectedImage].X = xcoord - (sprites[selectedImage].image.width/2);
	sprites[selectedImage].Y = ycoord - (sprites[selectedImage].image.height/2);
}

//Collisions
var collided = false;

function checkCollide(){
	var collisionArray = new Array();
	var corners =new Array();
	corners.push(  spriteHit(drawnSprites[selectedImage].X,drawnSprites[selectedImage].Y));
	corners.push( spriteHit(drawnSprites[selectedImage].X + drawnSprites[selectedImage].image.width,drawnSprites[selectedImage].Y));
	corners.push( spriteHit(drawnSprites[selectedImage].X,drawnSprites[selectedImage].Y + drawnSprites[selectedImage].image.height));
	corners.push(spriteHit(drawnSprites[selectedImage].X+ drawnSprites[selectedImage].image.width,drawnSprites[selectedImage].Y+ drawnSprites[selectedImage].image.height));
	/////for right now.. checking corners of dragged sprite against possible overlaps and returning sprites it "collides" with...choosing sprite to check combination based on highest index of sprite... need to change for layering...

	var max=-1;
	for(var i=0; i<corners.length; i++){
		if(corners[i]>max){
			max=corners[i];
		}
	}


	if(max>=0){
		collided= true;
		collisionArray.push(drawnSprites[selectedImage]);
		collisionArray.push(drawnSprites[max]);
	}

	return collisionArray;
}

function spriteHit(x,y){
	for (var i = 0; i < drawnSprites.length; i++) {
		if(selectedImage!=i){
			var hitSprite =drawnSprites[i];
			var thisx= x;
			var thisy= y;

			var spriteX1= hitSprite.X;
			var spriteX2= hitSprite.X + hitSprite.image.width;
			var spriteY1= hitSprite.Y;
			var spriteY2= hitSprite.Y + hitSprite.image.height;

			if(thisx>=spriteX1 && thisx<=spriteX2 && thisy>=spriteY1 && thisy<=spriteY2){


				return i;
				break;
			}
		}
	}
	return -1;

}


//Collision check2
function checkAllCollisions() {
	var collisonArray = new Array();
	for (var iter = 0; iter < drawnSprites.length; iter++) {
		for (var jter = 0; jter < drawnSprites.length; jter++) {
			if(drawnSprites[iter].ID != drawnSprites[jter].ID && checkdistance(drawnSprites[iter].X, drawnSprites[iter].Y, drawnSprites[jter].X,drawnSprites[jter].Y, 20) == 1) {
				collided = true;
				collisonArray.push(drawnSprites[iter]);
				collisonArray.push(drawnSprites[jter]);
			}
		}
	}
	return collisonArray;
}

//This checks for collision between two points and the distance between two points.
//If the distance between two points is less than the desired distance then they are considered to be collided objects.
function checkdistance(x1, y1, x2, y2, distance) {
	if(Math.abs(x1-x2) <= distance && Math.abs(y1-y2) <= distance) {
		return 1;
	}

	return 0;
}

//KeyBoard and Mouse events
canvas.addEventListener("mousedown",mousedown);
canvas.addEventListener("mouseup",mouseup);
canvas.addEventListener("mousemove",mousemove);
document.addEventListener('keydown', handleKeypress);

var xcoord = 0;
var ycoord = 0;
var mouseisdown = 'no';
var mouseisup = 'yes';
var mouseismoving = 'no';

function mousedown(e) {
	mouseisdown = 'yes';
	mouseisup = 'no';
}

function mouseup(e) {
	mouseisup = 'yes';
	mouseisdown = 'no';
}

function mousemove(e) {
	xcoord = e.clientX;
	ycoord = e.clientY;
	mouseismoving = 'yes';
}

function handleKeypress(e){

	switch(e.keyCode){
	case 37:
		direction = 'left';
		break;
	case 38:
		direction = 'up';
		break;
	case 39:
		direction = 'right';
		break;
	case 40:
		direction = 'down';
		break;
	}

}

function Wall(xWall, yWall, xcellWidth, ycellLength) {
	this.xWall = xWall;
	this.yWall = yWall;
	this.xcellWidth = xcellWidth;
	this.ycellLength = ycellLength;

	this.update;

	this.draw;

}

function Food(x, y, spoilTime, maxTimeLife,id) {
	this.id=id;
	this.xfood = x;
	this.yfood = y;
	this.spoilTimer = 0;
	this.maxTimeLife = maxTimeLife;

	this.update;

	this.draw;
	this.reset;
}

////////////////////////////Testing/Validation functions//// for debugging////

function testDrawnSprites(){
	var testString= "";

	for(var i=0; i<drawnSprites.length; i++){
		testString = testString+ " " +drawnSprites[i].ID;
	}
	console.log(testString);
}
function testSprites(){
	var testString= "";
	
		for(var i=0; i<sprites.length; i++){
			testString = testString+ " " +sprites[i].ID;
		}
		console.log(testString);
}
