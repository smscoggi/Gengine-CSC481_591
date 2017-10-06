
///need to set up game state functionality... put everything in a start function that gets called at the beginning of the game...
///...resets all variables used at game restart? will go in engine (start function to stay in game... model after unity?)

//background sprite
addSprite("https://i.imgur.com/YeuKUD7.jpg","back");
var back=findSprite(sprites,"back");
addDrawnSprites(back,0,0,canvas.width,canvas.height,"back");

///rocket objects
addSprite("https://i.imgur.com/M15Q3Sp.png","rocket");
var rocksprite= findSprite(sprites,"rocket");
rocksprite.image.width= 3*cellWidth;
rocksprite.image.height=3*cellHeight;
var drawnRocket;

makeRocket();

function makeRocket(){
    var rocketStartX= canvas.width/2-rocksprite.image.width/2;
    var rocketStartY= canvas.height/2-rocksprite.image.height/2;
    addDrawnSprites(rocksprite, rocketStartX, rocketStartY,rocksprite.image.width, rocksprite.image.height, rocksprite.ID);
    drawnRocket= findSprite(drawnSprites,"rocket");

    drawnRocket.rotating=false;

    
    drawnRocket.update=function(){
        adjustPosXYByCenterPoint(drawnRocket);
        
        //update center from new possible possition to jump...
        jumpToOtherSideOfScreen(drawnRocket);
        drawnRocket.centerX=drawnRocket.posX*cellWidth;
        drawnRocket.centerY=drawnRocket.posY*cellHeight;
        adjustXYByCenterPoint(drawnRocket);


        rotatingDirection(drawnRocket,20,20);
        

    }

}
/////end rocket objects


//asteroid objects
addSprite("https://i.imgur.com/pusVJBx.png","asteroid1");
var asteroidSprite1= findSprite(sprites,"asteroid1");
asteroidSprite1.image.width= 2*cellWidth;
asteroidSprite1.image.height=2*cellHeight;
var AsteroidArray=new Array();
var numAsteroids=6;


makeAsteroids();



function makeAsteroids(){
    
    for(var i=0; i<numAsteroids; i++){
      

        var startposX= Math.random()*xcellCount;
        var startposY= Math.random()*ycellCount;
        addDrawnSprites(asteroidSprite1, startposX*cellWidth, startposY*cellHeight,asteroidSprite1.image.width, asteroidSprite1.image.height,"ast"+i);
       var ast=findSprite(drawnSprites,"ast"+i);
        AsteroidArray.push(ast);
        var randDimension=(1.5+Math.random()*2);
        ast.image.width= randDimension*cellWidth;
        ast.image.height= randDimension*cellHeight;
        ast.rotateDegree=Math.random()*360;
        ast.rotating=true;
        ast.rotatedirection=Math.floor(Math.random()*2);
        ///random slope calculation...may need more refining..
        //ast.trajectory=Math.pow(-1,Math.floor(Math.random()*2))*Math.random()*ycellCount/(Math.random()*xcellCount);
        ast.trajectory=Math.random()*360;
        ast.speed=Math.random()*15;


        ast.update=function(){
            adjustPosXYByCenterPoint(this);
            //update center from new possible possition to jump...
            jumpToOtherSideOfScreen(this);
            this.centerX=this.posX*cellWidth;
            this.centerY=this.posY*cellHeight;
            adjustXYByCenterPoint(this);

            if(this.rotatedirection==0){
                leftRotation(this,10);
            }
            else if(this.rotatedirection==1){
                rightRotation(this,10);
            }

            angledFowardMotion(this,this.speed,this.trajectory);
            ///update based on trajectory...
           



        }

        ////to create ast.reset or create a new astoroid when needed
        
    }

}


////bullets
addSprite("https://i.imgur.com/nfOhB08.png","bullet");
var bulletSprite= findSprite(sprites,"asteroid1");
bulletSprite.image.width= .5*cellWidth;
bulletSprite.image.height=.5*cellHeight;
var bulletArray=new Array();
bulletSpacing=10;

function MakeBullet(){
    var startposX= drawnRocket.posX;
    var startposY= drawnRocket.posY;
    
    addDrawnSprites(bulletSprite, startposX*cellWidth, startposY*cellHeight,bulletSprite.image.width, bulletSprite.image.height,"bullet");
    var bullet=findSprite(drawnSprites,"bullet");
    bulletArray.push(bullet);
    bullet.rotating=true;
    bullet.rotatedirection=Math.floor(Math.random()*2);
    bullet.trajectory=drawnRocket.rotateDegree;
    bullet.speed=15

    bullet.update=function(){
        if(testSideCrossing(this)){
            this.destroy();

        }

        if(this.rotatedirection==0){
            leftRotation(this,10);
        }
        else if(this.rotatedirection==1){
            rightRotation(this,10);
        }

        angledFowardMotion(this,this.speed,this.trajectory);
    }

    this.destroy=function(){
        var index;
        for(var i=0; i<drawnSprites; i++){
            if(drawnSprites[i]==this){
               index=i;
            }
        }
        drawnSprites[index].splice(index,1);
////needs to remove from bulletarray too..

    }


}

MakeBullet();





/////////Possible adds to engine//////////////////////////////////////
function testSideCrossing(MovableObject){
    if (movingObject.posX < 0 || movingObject.posX > xcellCount - 1 ||movingObject.posY < 0 || movingObject.posY > ycellCount - 1) {
        return true;
         
     }
     else{return false;}
}

function adjustPosXYByCenterPoint(MovableObject){
    MovableObject.posX=MovableObject.centerX/cellWidth;
    MovableObject.posY= MovableObject.centerY/cellHeight;
}

function adjustXYByCenterPoint(MovableObject){
    MovableObject.X=MovableObject.centerX-MovableObject.cXrelation;
    MovableObject.Y=MovableObject.centerY-MovableObject.cYrelation;
}



//var rotating=false;


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

    MovableObject.X += x1;
    MovableObject.Y -= y1;
    MovableObject.centerX = MovableObject.cXrelation + MovableObject.X;
    MovableObject.centerY = MovableObject.cYrelation + MovableObject.Y;
    
  //  console.log("X:", MovableObject.X);
  //  console.log("Y:", MovableObject.Y);
}



///////////////////////////////////////possible adds to engene----end////////////////////////






function update(){
    drawnRocket.update();
    for(var i=0; i<AsteroidArray.length; i++){
        AsteroidArray[i].update();
        console.log(AsteroidArray[i].X+", "+AsteroidArray[i].Y);
    }
    console.log(AsteroidArray.length);

    for(var i=0; i<bulletArray; i++){
        bulletArray[i].update();
    }
    

}


function draw(){


    canvas.width = canvas.width;
    context.fillStyle="black";
    context.fillRect(0,0,canvas.width,canvas.height);

    
   
    drawSprites();

}
