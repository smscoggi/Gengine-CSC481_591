
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



function rotatingDirection(MovableObject, degreeStep,fowardStep){
    switch(direction){
        case 'right':
            MovableObject.rotateDegree+= degreeStep;
                if(MovableObject.rotateDegree>360){
                    MovableObject.rotateDegree-= 360;
                }
                direction="none";
        case 'left':
            MovableObject.rotateDegree= MovableObject.rotateDegree- degreeStep;
            if(MovableObject.rotateDegree<0){
                console.log(MovableObject.rotateDegree);
                MovableObject.rotateDegree+= 360;

            }
            direction="none";
        case 'up':

            var x1= fowardStep*Math.floor(Math.cos(MovableObject.rotateDegree*Math.PI/180));
            var y1= fowardStep*Math.floor(Math.sin(MovableObject.rotateDegree*Math.PI/180));

            MovableObject.centerX= MovableObject.centerX+y1;
            MovableObject.centerY= MovableObject.centerY-x1;
            ////need dynamic functionality to add/take direction usage for other games...///
           
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

