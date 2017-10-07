
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

var rocketStartX= canvas.width/2-rocksprite.image.width/2;
var rocketStartY= canvas.height/2-rocksprite.image.height/2;

makeRocket();

function makeRocket(){
    
    addDrawnSprites(rocksprite, rocketStartX, rocketStartY,rocksprite.image.width, rocksprite.image.height, rocksprite.ID);
    drawnRocket= findSprite(drawnSprites,"rocket");

    drawnRocket.rotating=false;
    drawnRocket.collider=makeSpriteCollider(drawnRocket);


    drawnRocket.update=function(){
        adjustPosXYByCenterPoint(drawnRocket);
        //update center from new possible possition to jump...
        jumpToOtherSideOfScreen(drawnRocket);
        drawnRocket.centerX=drawnRocket.posX*cellWidth;
        drawnRocket.centerY=drawnRocket.posY*cellHeight;
        adjustXYByCenterPoint(drawnRocket);

        rotatingDirection(drawnRocket,20,20);

        drawnRocket.collider.update();

        drawnRocket.collision();
    }

    drawnRocket.collision=function(){
       // console.log(drawnRocket.collider.collidedObjectsArray.length)
        for(var i=0; i<drawnRocket.collider.collidedObjectsArray.length; i++){

            if(drawnRocket.collider.collidedObjectsArray[i].type=="asteroid"){
               // drawnRocket.explode(); /// will put explosion on top of rocket...
              //  Game.reset();           /////will reset the game
                console.log("asteroid collision");

            }

        }
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
        ast.type="asteroid";

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
var bulletSprite= findSprite(sprites,"bullet");
bulletSprite.image.width= 1*cellWidth;
bulletSprite.image.height=1*cellHeight;
var bulletArray=new Array();
var bulletSpacing=1.5;
var bulletTime = 0;
var numBullets = 0;
var maxBullets = 3;
var bulletID = 0;
var buffer = 10;

function MakeBullet(){
	numBullets++;
	if(bulletID >= maxBullets*buffer){
		bulletID = 0;
	}
	bulletID++;
    var startposX=  drawnRocket.centerX-bulletSprite.image.width/2;
    var startposY=  drawnRocket.centerY-bulletSprite.image.height/2;
    
    addDrawnSprites(bulletSprite, startposX, startposY,bulletSprite.image.width, bulletSprite.image.height,"bullet"+bulletID);
    var bullet=findSprite(drawnSprites,"bullet"+bulletID);
    bullet.trajectory=drawnRocket.rotateDegree;
    bullet.speed=25;
    
    bulletArray.push(bullet);

    bullet.update=function(){
        if(testSideCrossing(this)==true){
        	removeDrawnSprite(this);
        	for(var i=0; i<bulletArray.length; i++){
                if(bulletArray[i].ID==bullet.ID){
                   bulletArray.splice(i,1);
                }
            }
            //destroyBullet(this);
            numBullets--;
        	
        }


        angledFowardMotion(this,this.speed,this.trajectory);
    }

  //****This stuff does not work. Should either move code above here and call method or just remove method***//
    this.destroyBullet=function(bullet){
    	
        /*for(var i=0; i<bulletArray.length; i++){
        	console.log("1", bulletArray[i]);
        	console.log("2", bullet);
        }*/
        /*for(var i=0; i<bulletArray.length; i++){
            if(bulletArray[i].ID==bullet.ID){
               bulletArray.splice(i,1);
            }
        }*/
        //if(numBullets > 0) {
        //numBullets--;
        //}
        //console.log("remove");

    }


}

//MakeBullet();



/////////Possible adds to engine//////////////////////////////////////
function testSideCrossing(movingObject){
    if (movingObject.X < 0 || movingObject.X > canvas.width || movingObject.Y < 0 || movingObject.Y > canvas.height) {
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
    }

    if(spacebar && bulletTime >= bulletSpacing){
    	if (numBullets < maxBullets){
    		MakeBullet();
    		bulletTime = 0;
    	}
    }
    bulletTime++;
    
    for(var i=0; i<bulletArray.length; i++){
    	bulletArray[i].update();
    }
    //console.log(numBullets,"number:", bulletID, "ID");
    //testDrawnSprites();
    //testBulletArray();

    collisionDetection()

}

function testBulletArray() {   
	var testString = "";
	for(var i=0; i<bulletArray.length; i++){
		testString = testString+ " " +bulletArray[i].ID;
	}
	console.log(testString);
}



function draw(){


    canvas.width = canvas.width;
    context.fillStyle="black";
    context.fillRect(0,0,canvas.width,canvas.height);

    
   
    drawSprites();

}
