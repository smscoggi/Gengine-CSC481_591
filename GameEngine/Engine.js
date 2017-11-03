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
	this.velocityX = 0;
	this.velocityY = 0;
	this.maxVelocity = 0;
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
	if(oldSprite == null){
		return;
	}
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
function adjustPosXYByCenterPoint(MovableObject){
    MovableObject.posX=MovableObject.centerX/cellWidth;
    MovableObject.posY= MovableObject.centerY/cellHeight;
}

function adjustXYByCenterPoint(MovableObject){
    MovableObject.X=MovableObject.centerX-MovableObject.cXrelation;
    MovableObject.Y=MovableObject.centerY-MovableObject.cYrelation;
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

function updateVelocity(){
	
		for (var iter = 0; iter < drawnSprites.length; iter++) {
			if(drawnSprites[iter].velocityX!=0 && drawnSprites[iter].velocityY!=0){
			var signX = Math.sign(drawnSprites[iter].velocityX);
			var signY = Math.sign(drawnSprites[iter].velocityY);
			drawnSprites[iter].velocityX = signX*Math.min(Math.abs(drawnSprites[iter].velocityX), drawnSprites[iter].maxVelocity);
			drawnSprites[iter].velocityY = signY*Math.min(Math.abs(drawnSprites[iter].velocityY), drawnSprites[iter].maxVelocity);
			drawnSprites[iter].X += drawnSprites[iter].velocityX;
			drawnSprites[iter].Y += drawnSprites[iter].velocityY;
		}
	}
}

function drawSprites(){

	
	for (var iter = 0; iter < drawnSprites.length; iter++) {
	
		//console.log(findSprite(drawnSprites, "ast0").velocityX);
		if(drawnSprites[iter].rotating){
		
			context.translate(drawnSprites[iter].centerX,drawnSprites[iter].centerY);
			
			context.rotate(drawnSprites[iter].rotateDegree * Math.PI/180);
			//console.log(drawnSprites[iter].rotateDegree+"rotate degree");
			context.drawImage(drawnSprites[iter].image, -drawnSprites[iter].cXrelation, -drawnSprites[iter].cYrelation, drawnSprites[iter].image.width, drawnSprites[iter].image.height);
			context.rotate(-drawnSprites[iter].rotateDegree * Math.PI/180);
			context.translate(-drawnSprites[iter].centerX,-drawnSprites[iter].centerY);		
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
function actualDistance(x1, y1, x2, y2){
	var distance = Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
	return distance;
}
///////////////////////////////////////New general purpose collider containers...old collision will be transfered to this..//////////
var colliders= new Array();

function Collider(X,Y,width,height){
	this.top= Y;
	this.left=X;
	this.right=X+width;
	this.bottom=Y+height;

	this.collidedObjectsArray=new Array();
	this.update;
	this.object;

}
function Collider(centerX,centerY,radius){

	this.centerX= centerX;
	this.centerY= centerY;
	this.radius=radius;
	this.collidedObjectsArray=new Array();
	this.update;
	this.object;
}

function makeSpriteCollider(Object, type){

	if(type=="box"){
	var collider= new Collider(Object.X,Object.Y,Object.image.width,Object.image.height);
	

		collider.update= function(){
			this.top= this.object.Y;
			this.left=this.object.X;
			this.right=this.object.X+this.object.image.width;
			this.bottom=this.object.Y+this.object.image.height;

			}
		}
	else if(type=="circle"){

		//need to define this as an ellipse later...
		var collider = new Collider(Object.centerX,Object.centerY,Object.image.height/2);
		collider.update= function(){
			this.centerX=this.object.centerX;
			this.centerY=this.object.centerY;
	

		}
	}
	collider.type=type;
	collider.object=Object;
	colliders.push(collider);
	return collider;
}


function collisionDetection(){
	//console.log(colliders.length);
	for(var i=0; i<colliders.length; i++){
		var mainC = colliders[i];
		//console.log(mainC.collidedObjectsArray.length + mainC.object.type+ i);
		mainC.collidedObjectsArray.length=0;
		///console.log(mainC.collidedObjectsArray.length);
		for(var j=0; j<colliders.length; j++){
			var c2 = colliders[j];
			if(i==j){
				//do nothing
			}
			else{
				
				///check for collsions
				//console.log("maintop"+mainC.top);
				//console.log("mainbottom"+mainC.bottom);
				//console.log("ctop"+c2.top);
				//console.log("cbottom"+c2.bottom);
				if(mainC.type=="box"){	
					if((mainC.top<=c2.top && c2.top<=mainC.bottom) || (mainC.top<=c2.bottom && c2.bottom<=mainC.bottom)){
						//console.log("yesss");
						if((mainC.left<=c2.left && c2.left<=mainC.right) || (mainC.left<=c2.right && c2.right<=mainC.right)){
					////this means two edges of checked collider (j) have crossed into the main collider (i)
						//console.log("pushing c2");
							mainC.collidedObjectsArray.push(c2.object);
						

						}
					}
				}
				else if(mainC.type="circle"){
				

					var dist=actualDistance(mainC.centerX,mainC.centerY,c2.centerX,c2.centerY);
					var distcheck=mainC.radius+c2.radius;
					//console.log(mainC.object.ID+" "+c2.object.ID+" dist:"+ dist+"   distcheck:"+distcheck);
					if(dist<=distcheck){
						//console.log("dist:"+ dist+"   distcheck:"+distcheck);
						//console.log("yesss"+c2.object.ID);
						mainC.collidedObjectsArray.push(c2.object);
						
					}

				}
			}
		}
	}
}


function removeCollider(rcollider){
    for(var i=0; i<colliders.length; i++){
        if(rcollider == colliders[i]){
            colliders.splice(i,1);
        }
    }

}


///////////////////////////////////////////////End--collsions

//KeyBoard and Mouse events
canvas.addEventListener("mousedown",mousedown);
canvas.addEventListener("mouseup",mouseup);
canvas.addEventListener("mousemove",mousemove);
document.addEventListener('keydown', handleKeypress);
document.addEventListener('keyup',handlekeyup);
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

//////keys///////
var leftkey=false;
var rightkey=false;
var upkey=false;
var downkey= false;
var spacebar=false;
var menu = 0;
/////need to setup changing functions for changing keys meant for controls...
function handleKeypress(e){

	switch(e.keyCode){
	//spacebar
	case 32:
		spacebar=true;
		break;
	case 37:
		direction = 'left';
		leftkey=true;
		break;
	case 38:
		direction = 'up';
		upkey=true;
		break;
	case 39:
		direction = 'right';
		rightkey=true;
		break;
	case 40:
		direction = 'down';
		downkey=true;
		break;
	case 27:
		menu += 1;
		if(menu > 1){
			menu = 0;
		}
		break;
	}

}
function handlekeyup(e){
	switch(e.keyCode){
		
		case 32:
			spacebar=false;
			break;
		case 37:
			leftkey=false;
			break;
		case 38:
			upkey=false;
			break;
		case 39:
			rightkey=false;
			break;
		case 40:
			downkey=false;
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

function rotatingDirection(MovableObject, degreeStep,fowardStep){
    MovableObject.rotating= true;
    if(rightkey){
        
            rightRotation(MovableObject,degreeStep);
        	//direction="none";
            
    }
     else if(leftkey){ 
            leftRotation(MovableObject,degreeStep);
        	//direction="none";
     }
        	////need dynamic functionality to add/take direction usage for other games...///
        	///direction="none";
        	//break;
    
    if(upkey){
        angledFowardMotion(MovableObject,fowardStep,MovableObject.rotateDegree);

    }
}

function rightRotation(MovableObject,degreeStep){
    MovableObject.rotateDegree = MovableObject.rotateDegree + degreeStep;
   // console.log(MovableObject.rotateDegree);
    if(MovableObject.rotateDegree>=360){
        MovableObject.rotateDegree-= 360;
    }

}
function leftRotation(MovableObject,degreeStep){
    MovableObject.rotateDegree = MovableObject.rotateDegree - degreeStep;
   // console.log(MovableObject.rotateDegree);
    if(MovableObject.rotateDegree<0){
        MovableObject.rotateDegree+= 360;
    }
}
function angledFowardMotion(MovableObject,fowardStep,angle){
    var y1= fowardStep*(Math.cos(angle*Math.PI/180));
    var x1= fowardStep*(Math.sin(angle*Math.PI/180));
   // console.log("x1:", x1);
   // console.log("y1:", y1);
    
    MovableObject.velocityX += fowardStep*Math.sin(angle*Math.PI/180);
    MovableObject.velocityY -= fowardStep*Math.cos(angle*Math.PI/180);
    
    //MovableObject.X += x1;
    //MovableObject.Y -= y1;
    //MovableObject.centerX = MovableObject.cXrelation + MovableObject.X;
    //MovableObject.centerY = MovableObject.cYrelation + MovableObject.Y;
    
  //  console.log("X:", MovableObject.X);
  //  console.log("Y:", MovableObject.Y);
}

function jumpToOtherSideOfScreen(movingObject){
	///takes moving object and jumps it to the other side of viewable screen
	//returns object with updated x,y positions 
	///need to possible change .posy/x to .x and .y to have all possible object have same pos name
	jumped=false;
	

	if (movingObject.posX < 0) {
		movingObject.posX = xcellCount - 1;
		jumped=true;
		
	}
	else if (movingObject.posX > xcellCount - 1) {
		movingObject.posX = 0;
		jumped=true;
		
	}
	else if (movingObject.posY < 0) {
		movingObject.posY = ycellCount - 1;
		jumped=true;
		
	}
	else if (movingObject.posY > ycellCount - 1) {
		movingObject.posY =  0;
		jumped=true;
		
	}
	
	return movingObject;
}

function testSideCrossing(movingObject){
    if (movingObject.X < 0 || movingObject.X > canvas.width || movingObject.Y < 0 || movingObject.Y > canvas.height) {
        return true;
         
     }
     else{return false;}
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
	
	console.log(testString);
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

