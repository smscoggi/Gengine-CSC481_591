








function RotatingControlledSprite(startx, starty){

    this.X= startx;
    this.Y= startY;
    this.movement= 'none';

}

function rotatingDirection(MovableObject, degreeStep){
    switch(direction){
        case 'right':
            MovableObject.rotateDegree+= degreeStep;
        case 'left':
            MovableObject.rotateDegree-= degreeStep;
        case 'up':
            

    }
}




function update(){



}


function draw(){
    canvas.width = canvas.width;
    context.fillStyle="black";
    context.fillRect(0,0,canvas.width,canvas.height);
   


}

