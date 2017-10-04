
///need to set up game state functionality... put everything in a start function that gets called at the beginning of the game...
///...resets all variables used at game restart? will go in engine (start function to stay in game... model after unity?)


addSprite("https://i.imgur.com/M15Q3Sp.png","rocket");
var rocksprite= findSprite(sprites,"rocket");
rocksprite.image.width= 3*cellWidth;
rocksprite.image.height=3*cellHeight;

var rocketStartX= canvas.width/2-rocksprite.image.width/2;
var rocketStartY= canvas.height/2-rocksprite.image.height/2;
addDrawnSprites(rocksprite, rocketStartX, rocketStartY,rocksprite.image.width, rocksprite.image.height, rocksprite.ID);
var drawnRocket= findSprite(drawnSprites,"rocket");

var rotating=false;

function rotatingDirection(MovableObject, degreeStep,fowardStep){
    rotating= true;
    switch(direction){
        case 'right':
        	MovableObject.rotateDegree = MovableObject.rotateDegree + degreeStep;
        	console.log(MovableObject.rotateDegree);
        	if(MovableObject.rotateDegree>=360){
        		MovableObject.rotateDegree-= 360;
        	}
        	direction="none";
        	break;
        case 'left':
        	MovableObject.rotateDegree = MovableObject.rotateDegree - degreeStep;
        	console.log(MovableObject.rotateDegree);
        	if(MovableObject.rotateDegree<0){
        		MovableObject.rotateDegree+= 360;
        	}
        	direction="none";
        	break;
        case 'up':
        	console.log(MovableObject.rotateDegree);
        	var x1= fowardStep*Math.cos((MovableObject.rotateDegree-90)*Math.PI/180);
        	var y1= fowardStep*Math.sin((MovableObject.rotateDegree-90)*Math.PI/180);
            console.log(x1+" x1");
            console.log(y1+ " y1");
        	MovableObject.centerX= MovableObject.centerX+x1;
        	MovableObject.centerY= MovableObject.centerY+y1;
        	////need dynamic functionality to add/take direction usage for other games...///
        	///direction="none";
        	break;
    }
}




function update(){

    rotatingDirection(drawnRocket,10,15);

}


function draw(){


    canvas.width = canvas.width;
    context.fillStyle="black";
    context.fillRect(0,0,canvas.width,canvas.height);

    
   
    drawSprites();

}
