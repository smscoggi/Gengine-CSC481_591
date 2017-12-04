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
function Menu(title, size, font, fillStyle, X, Y, alignment){
	this.title = title;
	this.size = size;
	this.font = font;
	this.fillStyle = fillStyle;
	context.font = this.size+" "+this.font
	this.titleMeasurement = context.measureText(title);
	this.titleXPos = X;
	if(alignment == 'centered'){
		this.titleXPos = (X - this.titleMeasurement.width) / 2;
	}
	this.titleYPos = Y;
	
}

function drawMenu(menu){
	addText(menu.size, menu.font, menu.title, menu.titleXPos, menu.titleYPos, menu.fillStyle);
}

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

/////Other physics related functions and features

//particle "system"-
function makeParticles(astSprite,numAsteroids,iter,scalew,scaleh,OriginStartposX,OriginStartposY,spawnDistance,ParticleArray,id){
	///ast used because this was origionally an asteroid function that allowed for randomly moving circlular varying scale particles
		for(var i=0; i<numAsteroids; i++){
			thisid= id+""+i;
			if(iter==1){ 
				startposX= Math.random()*xcellCount;
				startposY= Math.random()*ycellCount;
				while(Math.abs(startposX - OriginStartposX) <= spawnDistance || Math.abs(startposY - OriginStartposX) <= spawnDistance) {
					startposX= Math.random()*xcellCount;
					startposY= Math.random()*ycellCount;
					console.log("restereitn");
				}
			}
			addDrawnSprites(astSprite, startposX*cellWidth, startposY*cellHeight,asteroidSprite1.image.width, asteroidSprite1.image.height,thisid);
			var ast=findSprite(drawnSprites,thisid);
			ParticleArray.push(ast);
			var randDimension=(1.5+Math.random()*2);
			ast.image.width= randDimension*scalew;
			ast.image.height= randDimension*scaleh;
			ast.rotateDegree=Math.random()*360;
			ast.rotating=true;
			ast.rotatedirection=Math.floor(Math.random()*2);
			ast.trajectory=Math.random()*360;
			ast.maxVelocity = 300;
			ast.speed=Math.random()*15;
			ast.type=id;
			ast.collider=makeSpriteCollider(ast,"circle");
			ast.iteration=iter;
			ast.rotationSpeed=10;
	
			ast.update=function(){
				adjustPosXYByCenterPoint(this);
				//update center from new possible position to jump...
				jumpToOtherSideOfScreen(this);
				this.centerX=this.posX*cellWidth;
				this.centerY=this.posY*cellHeight;
				adjustXYByCenterPoint(this);
	
				if(this.rotatedirection==0){
					leftRotation(this,this.rotationSpeed);
				}
				else if(this.rotatedirection==1){
					rightRotation(this,this.rotationSpeed);
				}
	
	
	
				this.X += this.speed*Math.sin(this.trajectory*Math.PI/180);
				this.Y -= this.speed*Math.cos(this.trajectory*Math.PI/180);
				this.centerX = this.cXrelation + this.X;
				this.centerY = this.cYrelation + this.Y;
				///update based on trajectory...
				this.collider.update();
				this.collision();
	
				if(numAsteroids <= 0) {
					numAster=Math.floor(numAster*1.25);
					astCount = numAster;
					if(ParticleArray.length>0){
						for(var i = 0; i<ParticleArray.length; i++){
							removeCollider(ParticleArray[i].collider);
							removeDrawnSprite(ParticleArray[i]);
						}
					}
					makeParticles(astSprite,numAsteroids,1,cellWidth,cellHeight,OriginStartposX,OriginStartposY,spawnDistance,ParticleArray,thisid);
				}
	
			}
	
			ast.collision=function(){
			}
	
			ast.reset=function(){
				removeDrawnSprite(this);
				removeCollider(this.collider);
				for(var j=0; j<ParticleArray.length; j++){
					if(this == ParticleArray[j]){
						ParticleArray.splice(j,1);
					}
				}
	
			}   
		}
	}

////velocity function to be used for velocity related needs
	function updateVelocity(){
		
			for (var iter = 0; iter < drawnSprites.length; iter++) {
				var signX = Math.sign(drawnSprites[iter].velocityX);
				var signY = Math.sign(drawnSprites[iter].velocityY);
				drawnSprites[iter].velocityX = signX*Math.min(Math.abs(drawnSprites[iter].velocityX), drawnSprites[iter].maxVelocity);
				drawnSprites[iter].velocityY = signY*Math.min(Math.abs(drawnSprites[iter].velocityY), drawnSprites[iter].maxVelocity);
				drawnSprites[iter].X += drawnSprites[iter].velocityX;
				drawnSprites[iter].Y += drawnSprites[iter].velocityY;
				//drawnSprites[iter].centerX=drawnSprites[iter].cXrelation;
				//drawnSprites[iter].centerY=drawnSprites[iter].cYrelation;
			}
		}
	


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
	var rect = canvas.getBoundingClientRect();
	xcoord = Math.round((e.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
	ycoord = Math.round((e.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);
	mouseismoving = 'yes';
}


//////keys///////
var leftkey=false;
var rightkey=false;
var upkey=false;
var downkey= false;

var leftkey2=false;
var rightkey2=false;
var upkey2=false;
var downkey2= false;

var spacebar=false;
var menu = 0;

var arrows=true;
var aswd=true;

/////need to setup changing functions for changing keys meant for controls...
function handleKeypress(e){

	switch(e.keyCode){
	case 32: //spacebar
		spacebar=true;
		break;
	
	//arrow keys
	case 37: //leftkey
		if(arrows){
			direction = 'left';
			leftkey=true;
		}
			break;
		
	case 38: //upkey
		if(arrows){
		direction = 'up';
		upkey=true;
		}
		break;
		
	case 39: //rightkey
		if(arrows){
		direction = 'right';
		rightkey=true;
		}
		break;
		
	case 40: //downkey
		if(arrows){
		direction = 'down';
		downkey=true;
		}
		break;
		
	//'wasd' keys
	case 65: //a
	if(aswd){
		direction2 = 'left';
		leftkey=true;
	}
		break;

	case 87: //w
	if(aswd){
		direction2 = 'up';
		upkey=true;
	}
		break;
	
	case 68: //d
	if(aswd){
		direction2 = 'right';
		rightkey=true;
	}
		break;
	
	case 83: //s
	if(aswd){
		direction2 = 'down';
		downkey=true;
	}
		break;
		
	case 27: //Esc
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

	case 65: //a
		leftkey2=false;
		break;
	case 87: //w
		upkey2=false;
		break;
	case 68: //d
		rightkey2=false;
		break;
	case 83: //s
		downkey2=false;
		break;
	}


}



/////movement functions////////////
var direction = 'none';
var direction2 = 'none';

function dragSprite(){
	sprites[selectedImage].X = xcoord - (sprites[selectedImage].image.width/2);
	sprites[selectedImage].Y = ycoord - (sprites[selectedImage].image.height/2);
}

function basicDirection(basicMovableObject, direction, backwardsDirection){
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
			else if(this.spoilTimer == foodSpoilTime && !connected2){

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
			if(!connected2){
				this.spoilTimer = 0;
				this.xfood = Math.floor(Math.random()*xcellCount);
				this.yfood = Math.floor(Math.random()*ycellCount);
				if(this.foodSprite !=null){
					removeDrawnSprite(this.foodSprite);
					addDrawnSprites(goodSprite,this.xfood*cellWidth, this.yfood*cellHeight, cellWidth, cellHeight,this.id);
				}
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





///////////////////Planning/Search algorithms and related functions////////////////////////////////////////////


    //////astar search planning used for cops to get to robbers/////////////////////////////////////////////////////////////////
   ////note implemented based on/similar to code by Samantha Scoggins submitted for AI class hw2 csc520///
   function directionByAstar(srcposX, srcposY,goalposX,goalposY,GridArray){ 
	////gridArray must have 0 for nonwalkable tiles, and 1 for walkable tiles
	////needs to return next tile to move based on optimum path
	var src;
	var goal;

	var tilelist = loadtiles(GridArray);
	var roadlist = loadRoads(GridArray,tilelist);

   
	for(var i=0; i<tilelist.length; i++){
		if(goalposX==tilelist[i].posX && goalposY==tilelist[i].posY){
			goal = tilelist[i];
		}
		if(srcposX==tilelist[i].posX && srcposY==tilelist[i].posY){
			src=tilelist[i];
		}
		
	}
	///calculate distance to goal for all tiles
	for(var i=0; i<tilelist.length; i++){
		tilelist[i].calcDistanceToCity(goal);
	  } 
	///list setup
	var SQ = new Array();   //// array of paths
	var expansionList = new Array(); ///array of expanded tiles
	///initialize
	var myPathlist = new Array(); ///array of tiles
	var myPath= new path(myPathlist,0);
	myPath.thispath.push(src);
	myPath.fvalue=src.distanceToGoal;
	SQ.push(myPath);
	var myNode;  ///tile
	var myNodeIndex; ///// to find node in myPath
	var Goalreached=false;
	while(SQ.length!=0 && !Goalreached){
		myPath = SQ.pop();
		//get last node and check if goal
		myNodeIndex = myPath.thispath.length-1;
		myNode= myPath.thispath[myNodeIndex];
		expansionList.push(myNode);
		myNode.visited=true;
		if(goalCheck(myNode.name,goal.name)){
			Goalreached=true;
		  
		  if(myPath.thispath.length>=1){
		   return myPath.thispath[1];
		  }
		  else{
			  return null;
		  }
		  
		}
		else{
			SQ= expand(myPath,myNode,roadlist,SQ);
		}
	}
	for(var c=1; c<tilelist.length; c++){
		tilelist[c].reset();
	}

}

function goalCheck(possibleGoal,actualgoal){
	
	if(possibleGoal==actualgoal){
		return true;
	}
	else{
		return false;
	}
}

function path(thispath, fvalue){
	
	var thispath; ///array of tiles leading to goal
	var pathcost=0;
	var fvalue=0;
	
	
	this.thispath= thispath;
	this.fvalue=fvalue;
}

function tile(name,pposX,pposY){
	var name;
	var posX;
	var posY;
	var distanceToGoal=0;
	var visited= false;

	this.name = name;
	this.posX = pposX;
	this.posY = pposY; 
	
	
	this.calcDistanceToCity=function(gc){            
		distanceToGoal= actualDistance(gc.posX,gc.posY,this.posX,this.posY);
		//set distanceToGoal
	}
	
	this.reset= function(){
		visited=false;
		distanceToGoal=0;
	}  
}
function road(city1,  city2){
	var tile1;
	var tile2;
	var distance=1;
	
   
	this.tile1 = city1;
	this.tile2 = city2;
	this.distance = distance;
}


function loadtiles(gridArray){
tlist=new Array();
for(var i=0; i<gridArray.length; i++){
	if(gridArray[i]==1){
		tlist.push(new tile(i,i-(Math.floor(i/(xcellCount))*xcellCount),Math.floor(i/(xcellCount)) ))
	}
}

return tlist;
}
function loadRoads(gridArray,tilelist){
rlist=new Array();
var tile1;
var tile2;

for(var i=0; i<tilelist.length; i++){
	for(var j=i+1; j<tilelist.length; j++){
		if((tilelist[j].posX==tilelist[i].posX+1 || tilelist[j].posX==tilelist[i].posX-1) &&tilelist[j].posY==tilelist[i].posY){
			tile1=tilelist[j];
			tile2=tilelist[i];
			
			rlist.push(new road(tile1,tile2));
		}
		else if((tilelist[j].posY==tilelist[i].posY+1 ||tilelist[j].posY==tilelist[i].posY-11 )&&tilelist[j].posX==tilelist[i].posX){
			tile1=tilelist[j];
			tile2=tilelist[i];
			
			rlist.push(new road(tile1,tile2));
		}
	}
}
return rlist;


}

function expand(oldpath,oldnode,roadlist,stackqueue){
///expands based on astar, could be made to  implement greedy or uniform with a couple lines of code
var pushList= new Array();
var ntile1;
var ntile2;
for(var i=0; i<roadlist.length; i++){
	 ntile1=roadlist[i].tile1;
	 ntile2=roadlist[i].tile2;
	 if(oldnode.name==ntile1.name || oldnode.name==ntile2.name){
		 pushList.push(roadlist[i]);
	 }
  }
//////setting f-value
for(var i=0; i<pushList.length; i++){
	var pushtile;
	if(oldnode.name==pushList[i].tile1.name){
		pushtile=pushList[i].tile2;
	}
	else{
		pushtile=pushList[i].tile1;
	}
	if(!pushtile.visited){
		var newtilepath = new Array();
		for(var j=0; j<oldpath.thispath.length; j++){
			newtilepath.push(oldpath.thispath[j]);
		}
		newtilepath.push(pushtile);
		var newfvalue=0;
		/////set fvalue..... 
		////astar setting for fvalue
			newfvalue=oldpath.pathcost+pushList[i].distance + pushtile.distanceToGoal;
		///////
		var newpath = new path(newtilepath,newfvalue);
		newpath.pathcost=oldpath.pathcost+pushList[i].distance;
		var sameLastNodeIndex = -1;
		///check for other paths in SQ with same last node
		for(var iter=0; iter<stackqueue.length; iter++){
			var lastNodeIndex= stackqueue[iter].thispath.length-1;
			if(pushtile.name==stackqueue[iter].thispath[lastNodeIndex].name){
				sameLastNodeIndex=iter;
			}
			else{
				lastNodeIndex=-1;
			}
		}
		if(sameLastNodeIndex>=0){
			n= new Array();
			n.splice()
			if(stackqueue[sameLastNodeIndex].fvalue>newpath.fvalue){
				stackqueue.pop(sameLastNodeIndex);
				stackqueue.unshift(newpath);
				stackqueue=heapify(stackqueue,0);
			}
		}
		else{
			stackqueue.unshift(newpath);
			stackqueue=heapify(stackqueue,0);
		}
	}
}
return stackqueue;
}

function heapify(stackqueue,i){
var newi= 2*(i)+1;
if(newi <stackqueue.length){
	if(newi+1<stackqueue.length){
		if(stackqueue[newi].fvalue>stackqueue[newi+1].fvalue){
			newi++;
		}
	}
	if(stackqueue[i].fvalue>stackqueue[newi].fvalue){
		var pnewi= stackqueue.pop(newi);
		var pi= stackqueue.pop(i);
		stackqueue.push(i,pnewi);
		stackqueue.push(newi,pi);
		stackqueue=heapify(stackqueue,newi);
	}
}
return stackqueue;
}





///////end astar functionality



////networking/////////////////////////////
//implements basic peer to peer using peer.js library and peerServer
//uses one peer object

var peer1;
//var peer2 = new Peer({key: 'riw1ul3wmdjthuxr'});
var connected1=false;
var connected2=false;
var peer1ID =0;
var conn;
var peer1OnStartConnection=function(){}
var peer1OnGetConnection=function(){}
var gotAConnection=false;

peer1= new Peer({key: 'rr8fcgawspd2huxr'});



	peer1.on('open', function(id) {
	peer1ID= id;
	console.log('My peer1 ID is: ' + id);

  });

	peer1.on('connection', function(dataConnection){
	connected2=true;
	conn = dataConnection;
	gotAConnection=true;
	conn.on('data', function(data){
		//console.log("Data received: "+data);
		peer1OnStartConnection(data);
	});

	console.log("Connected");
	});

function connectToPeer2(peer2ID){
	conn = peer1.connect(peer2ID);
	//peer1.on('connection', function(conn) { });
   
	conn.on('open', function() {
	   console.log(peer2ID);
	   connected1=true;
	   // Receive messages
	   conn.on('data', function(data) {
			// console.log('Received', data);
			 peer1OnGetConnection(data);
	   });
	   // Send messages
	   conn.send('Hello!');
	 });
}
 


function getOtherPlayer() {
///basic ui to get other players id.
    var txt;
    var person = prompt("Your ID is:       "+peer1ID+"\n\nEnter other player's ID\nLocalMultiplayer: Select Cancel", peer1ID);
    if (person == null || person == "") {
        txt = "User cancelled the prompt.";
    } else {
        txt = "Hello " + person + "! How are you today?";
    }
	console.log(txt);
	return person;
}

	/////useful functions set up for basic sending information specific to this engine

function menuConnectUpdate(data){
		if(data.constructor === Array){
			if(data[0]=="menu"){
				menu=data[1];
			}}
	
	
	}
	
function scoringConnectUpdate(data){
		if(data.constructor === Array){
			if(data[0]=="statsA"){
	
				score=data[1];
				score2=data[2];
				highscore=data[3];
				highscore2=data[4];
				localhighscore=data[5];
	
		}}}
		

function drawnSpritesConnectUpdate(data){
	if(data.constructor === Array){
		
		if(data[0]=="ds"){
			

			var myDS=findSprite(drawnSprites,data[6]);
			if(myDS!= null){
			myDS.X=data[1];
			myDS.Y=data[2];
			myDS.image.width=data[3];
			myDS.image.height=data[4];
			myDS.image.src=data[5];
			}
		}
	}
}


function directionConnectUpdate(data){
	if(data.constructor === Array){
		if(data[0]=="dir"){
			direction2=data[1];
		}}
}


////////////End Networking

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

