//Samantha Scoggins: smscoggi
//Giovanni Espinosa: gespino
//George Yang: ggyang


canvas = document.getElementById("whyupdate");
context = canvas.getContext('2d');

var sprites = new Array();
var drawnSprites = new Array();
/////Gamestate- "camera view grid" variables
var cellWidth = 15;
var cellHeight = 15;
var xcellCount = Math.floor(canvas.width/cellWidth);
var ycellCount = Math.floor(canvas.height/cellHeight);

function setCanvasGrid(newcellWidth,newcellHeight,newxcellCount,newycellCount){
		cellWidth=newcellWidth;
		cellHeight=newcellHeight;
		xcellCount=newxcellCount;
		ycellCount=newycellCount;	
}

function Sprite(x, y, width, height, src, ID) {
	this.X = x;
	this.Y = y;
	this.image = new Image();
	this.image.width = width;
	this.image.height = height;
	this.image.src = src;
	this.ID = ID;


	this.rotateDegree=0;
	this.cXrelation=this.image.width/2;
	this.cYrelation=this.image.height/2;
	this.centerX=this.cXrelation + this.X;
	this.centerY=this.cYrelation + this.Y;
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

function addDrawnSprites(oldSprite,newX,newY,newWidth,newHeight,newid) {
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
		if(drawnSprites[iter].rotateDegree!=0 && drawnSprites[iter].rotateDegree!=360){
			//handles only if the drawnsprite has its rotationDegree set 
			//assumes rotation around center/fixed point in sprite
			//context.translate(-drawnSprites[iter].centerX,-drawnSprites[iter].centerY);
			
			context.rotate(drawnSprites[iter].rotateDegree * Math.PI/180);
			console.log(drawnSprites[iter].rotateDegree+"rotate degree");
			console.log(drawnSprites[iter].centerX+"centerx");
			console.log(drawnSprites[iter].centerY+"centery");
			console.log(drawnSprites[iter].X+"x");
			context.drawImage(drawnSprites[iter].image, drawnSprites[iter].centerX-drawnSprites[iter].cXrelation, drawnSprites[iter].centerY-drawnSprites[iter].cYrelation, drawnSprites[iter].image.width, drawnSprites[iter].image.height);
			context.rotate(-drawnSprites[iter].rotateDegree * Math.PI/180);
			//context.translate(drawnSprites[iter].centerX,drawnSprites[iter].centerY);		
		}
		else{
			context.drawImage(drawnSprites[iter].image, drawnSprites[iter].X, drawnSprites[iter].Y, drawnSprites[iter].image.width, drawnSprites[iter].image.height);
		}
	}
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
//////prevents window scrolling for arrows...
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);



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



/////movement functions////////////
var direction = 'none';

function dragSprite(){
	sprites[selectedImage].X = xcoord - (sprites[selectedImage].image.width/2);
	sprites[selectedImage].Y = ycoord - (sprites[selectedImage].image.height/2);
}

function basicDirection(basicMovableObject, backwardsDirection){
	///can move left,right, assumes auto move foward, can't move backwards

	switch(direction){
		case 'right':
			if (backwardsDirection != 'right' || backwardsDirection == 'none') {
				basicMovableObject.posX++;
				backwardsDirection = 'left';
			}
			if (backwardsDirection == 'right') {
				basicMovableObject.posX--;
			}
			break;
		case 'left':
			if (backwardsDirection != 'left' || backwardsDirection == 'none') {
				basicMovableObject.posX--;
				backwardsDirection = 'right';
			}
			if (backwardsDirection == 'left') {
				basicMovableObject.posX++;
			}
			break;
		case 'up':
			if (backwardsDirection != 'up' || backwardsDirection == 'none') {
				basicMovableObject.posY--;
				backwardsDirection = 'down';
			}
			if (backwardsDirection == 'up') {
				basicMovableObject.posY++;
			}
			break;
		case 'down':
			if (backwardsDirection != 'down' || backwardsDirection == 'none') {
				basicMovableObject.posY++;
				backwardsDirection = 'up';
			}
			if (backwardsDirection == 'down') {
				basicMovableObject.posY--;
			}
			break;
		}
		return  backwardsDirection;

}

function jumpToOtherSideOfScreen(movingObject){
	///takes moving object and jumps it to the other side of viewable screen
	//returns object with updated x,y positions 
	///need to possible change .posy/x to .x and .y to have all possible object have same pos name

	if (movingObject.posX < 0) {
		movingObject.posX = xcellCount - 1;
	}
	else if (movingObject.posX > xcellCount - 1) {
		movingObject.posX = 0;
	}
	else if (movingObject.posY < 0) {
		movingObject.posY = ycellCount - 1;
	}
	else if (movingObject.posY > ycellCount - 1) {
		movingObject.posY =  0;
	}
	return movingObject;
}



///////////////////////////////////////////////////////////////objects
function Wall(xWall, yWall, xcellWidth, ycellLength) {
	this.xWall = xWall;
	this.yWall = yWall;
	this.xcellWidth = xcellWidth;
	this.ycellLength = ycellLength;

	this.update;

	this.draw;

}

function Food(x, y, spoilTime, maxTimeLife,id) {
	/////Generalized this is a deteriorating/changing disappearing sprite
	this.id=id;
	this.xfood = x;
	this.yfood = y;
	this.spoilTimer = 0;
	this.maxTimeLife = maxTimeLife;

	this.update;

	this.draw;
	this.reset;
	this.collision;
}



////////Specific Object functions///////////////
var foodArray = new Array();
function makeFood(amountFood, foodSpoilTime, foodMaxLifeTime,goodSprite,badSprite){
	for(var iter = 0; iter < amountFood; iter++) {
		var foodid= "f"+iter;
		var food = new Food(Math.floor(Math.random()*xcellCount), Math.floor(Math.random()*ycellCount), foodSpoilTime, foodMaxLifeTime,foodid);
		this.foodSprite = null;
		
		food.update = function() {
			this.foodSprite= findSprite(drawnSprites,this.id);////finds the sprite that represents this food in drawnsprites

			if(this.foodSprite==null){
				//console.log("null founddddddd");
				addDrawnSprites(goodSprite,this.xfood*cellWidth, this.yfood*cellHeight, cellWidth, cellHeight, this.id);
			}
			else if(this.spoilTimer == foodSpoilTime){

				//console.log("spoillllleedddd!!!!!!!!!!!!!!");
				removeDrawnSprite(this.foodSprite);
				addDrawnSprites(badSprite,this.xfood*cellWidth, this.yfood*cellHeight, cellWidth, cellHeight,this.id);

			}
			//console.log(snake.deadState);
			if (this.spoilTimer < foodMaxLifeTime) {
				this.spoilTimer++;
			}
			if (this.spoilTimer == foodMaxLifeTime) {
				this.reset();
				
			}
		}
		food.collision=function(checkX, checkY,proximity){

				//collision when good, not spoiled
			if (checkdistance(this.xfood, this.yfood, checkX, checkY, proximity) && this.spoilTimer >= foodSpoilTime) { 
					return 1;
			}
				///collision when spoiled
			else if (checkdistance(this.xfood, this.yfood, checkX, checkY, proximity) && this.spoilTimer < foodSpoilTime) {
					return 2;
			}
			else{
				return 0;
			}
		}
		food.reset=function(){
			this.spoilTimer = 0;
			this.xfood = Math.floor(Math.random()*xcellCount);
			this.yfood = Math.floor(Math.random()*ycellCount);
			if(this.foodSprite !=null){
				removeDrawnSprite(this.foodSprite);
				addDrawnSprites(goodSprite,this.xfood*cellWidth, this.yfood*cellHeight, cellWidth, cellHeight,this.id);
			}
		}
		foodArray.push(food);
	}
}
function resetFood(){
	for(var iter = 0; iter < amountFood; iter++) {
		foodArray[iter].reset();
	}
}
////////////////////////////Testing/Validation functions//// for debugging////

function testDrawnSprites(){
	var testString= "";

	for(var i=0; i<drawnSprites.length; i++){
		testString = testString+ " " +drawnSprites[i].ID;
	}
	//console.log(testString);
}
function testSprites(){
	var testString= "";
	
		for(var i=0; i<sprites.length; i++){
			testString = testString+ " " +sprites[i].ID;
		}
		//console.log(testString);
}


////LocalHighScore
//////////////////Note: Local storage does not work correctly with Edge browser!!! Use Google chrome...///////////
var localhighscore = 0;
var score = 0;
var highscore = 0;

function checkHighscore(score) {
	localhighscore = localStorage.getItem("localhighscore");
	if(localhighscore !== null){
	    if (score > localhighscore) {
	        localStorage.setItem("localhighscore", score);      
	    }
	}
	else{
	    localStorage.setItem("localhighscore", score);
	}
}

function resetHighscore() {
    localStorage.setItem("localhighscore", 00);
}



//////Game Loop functions////////
function game_loop() {
	update();
	draw();
}
var gameLoopInterval=80;
var handle = setInterval(game_loop, gameLoopInterval);

function setGameLoopInterval(newInterval){
	gameLoopInterval=newInterval;
	clearInterval(handle);
	handle = setInterval(game_loop, gameLoopInterval);
}

