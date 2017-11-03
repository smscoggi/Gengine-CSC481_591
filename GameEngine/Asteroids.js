
///need to set up game state functionality... put everything in a start function that gets called at the beginning of the game...
///...resets all variables used at game restart? will go in engine (start function to stay in game... model after unity?)

var asteroidscellWidth = 15;
var asteroidscellHeight = 15;
var asteroidsxcellCount = Math.floor(canvas.width/cellWidth);
var asteroidsycellCount = Math.floor(canvas.height/cellHeight-3);

setCanvasGrid(asteroidscellWidth,asteroidscellHeight, asteroidsxcellCount, asteroidsycellCount)

//background sprite
addSprite("https://i.imgur.com/YeuKUD7.jpg","back");
var back=findSprite(sprites,"back");

addSprite("https://i.imgur.com/nfOhB08.png","splode");
var splode= findSprite(sprites,"splode");

///rocket objects
///image credit http://millionthvector.blogspot.com/p/free-sprites_12.html by MillionVector
addSprite("https://i.imgur.com/M15Q3Sp.png","rocket");
addDrawnSprites(back,0,0,canvas.width,asteroidsycellCount*asteroidscellHeight,"back");
var rocksprite= findSprite(sprites,"rocket");

rocksprite.image.width=3*cellWidth;
rocksprite.image.height=3*cellHeight;
var drawnRocket;

var rocketStartX= canvas.width/2-rocksprite.image.width/2;
var rocketStartY= canvas.height/2-rocksprite.image.height/2;

makeRocket();

function makeRocket(){
    removeDrawnSprite(findSprite(drawnSprites, "rocket"));
    addDrawnSprites(rocksprite, rocketStartX, rocketStartY,rocksprite.image.width, rocksprite.image.height, rocksprite.ID);
    drawnRocket= findSprite(drawnSprites,"rocket");
    drawnRocket.maxVelocity = 2;
    drawnRocket.rotating=false;
    drawnRocket.collider=makeSpriteCollider(drawnRocket,"circle");
    drawnRocket.type="rocket";

    drawnRocket.update=function(){
        adjustPosXYByCenterPoint(drawnRocket);
        //update center from new possible position to jump...
        jumpToOtherSideOfScreen(drawnRocket);
        drawnRocket.centerX=(drawnRocket.posX+drawnRocket.velocityX)*cellWidth;
        drawnRocket.centerY=(drawnRocket.posY+drawnRocket.velocityY)*cellHeight;
        adjustXYByCenterPoint(drawnRocket);
        
        rotatingDirection(drawnRocket,20,.2);

		drawnRocket.collider.update();

        drawnRocket.collision();
    }
    
    drawnRocket.collision=function(){
      
        for(var i=0; i<drawnRocket.collider.collidedObjectsArray.length; i++){

            if(drawnRocket.collider.collidedObjectsArray[i].type=="asteroid"){
                makeExplosion(drawnRocket);
               removeCollider(this.collider);
                game_reset();           /////will reset the game
                console.log("asteroid collision");

            }

        }
    }

}
/////end rocket objects

///explosion mechanics
explodeArray=new Array();

function makeExplosion(explodingObject){ 
    addDrawnSprites(splode,explodingObject.X,explodingObject.Y,explodingObject.image.width,explodingObject.image.height, "splode");
    var esplode= findSprite(drawnSprites,"splode");
    esplode.counter=2;
    explodeArray.push(esplode);

    esplode.update=function(){
       
        if(this.counter<=0){
            removeDrawnSprite(this);
            for(var i=0; i<explodeArray.length; i++){
                if(this== explodeArray[i]){
                    explodeArray.splice(i,1);
                }
            }
        }
        this.counter--;

    }


}

addSprite("https://i.imgur.com/iQ9zcMp.png", "booster");
var booster = findSprite(sprites,"booster");
booster.image.width = 1.5*cellWidth;
booster.image.height = 1.5*cellHeight;
var drawnbooster;

var boosterOn = false;
var numBooster = 0;
var maxBoosters = 1;

function makeBooster(){
	boosterOn = true;
	numBooster++;
    addDrawnSprites(booster, drawnRocket.centerX, drawnRocket.centerY,booster.image.width, booster.image.height, booster.ID);
    drawnbooster= findSprite(drawnSprites,"booster");
    drawnbooster.maxVelocity = drawnRocket.maxVelocity;
    drawnbooster.rotating=false;
    drawnbooster.rotateDegree = drawnRocket.rotateDegree + 180;
    
    drawnbooster.update=function(){
        
        adjustPosXYByCenterPoint(drawnbooster);
        //update center from new possible possition to jump...
        jumpToOtherSideOfScreen(drawnbooster);
        var y1= 25*(Math.cos(drawnbooster.rotateDegree*Math.PI/180));
        var x1= 25*(Math.sin(drawnbooster.rotateDegree*Math.PI/180));
        drawnbooster.centerX= drawnRocket.centerX+x1;
        drawnbooster.centerY= drawnRocket.centerY-y1;
        
        if(leftkey){
        	drawnbooster.rotateDegree = drawnRocket.rotateDegree + 190;
        }
        if(rightkey){
        	drawnbooster.rotateDegree = drawnRocket.rotateDegree + 160;
        }
        
        adjustXYByCenterPoint(drawnbooster);
        
        rotatingDirection(drawnbooster,20,0);

    }

}

function removeBooster(){
	removeDrawnSprite(booster);
	boosterOn = false;
	if(numBooster > 0) {
		numBooster--;
     }
}


//asteroid objects
addSprite("https://i.imgur.com/pusVJBx.png","asteroid1");
var asteroidSprite1= findSprite(sprites,"asteroid1");
asteroidSprite1.image.width= 2*cellWidth;
asteroidSprite1.image.height=2*cellHeight;
var AsteroidArray=new Array();
var numAster=6;
var astCount = numAster;
var spawnDistance = 10;

makeAsteroids(numAster,1,cellWidth,cellHeight,0,0);



function makeAsteroids(numAsteroids,iter,scalew,scaleh,startposX,startposY){
    
    for(var i=0; i<numAsteroids; i++){
      
        if(iter==1){ 
        	startposX= Math.random()*xcellCount;
        	startposY= Math.random()*ycellCount;
        	while(Math.abs(startposX - rocketStartX/cellWidth) <= spawnDistance || Math.abs(startposY - rocketStartY/cellHeight) <= spawnDistance) {
        		startposX= Math.random()*xcellCount;
            	startposY= Math.random()*ycellCount;
            	console.log("restereitn");
        	}
        }
        addDrawnSprites(asteroidSprite1, startposX*cellWidth, startposY*cellHeight,asteroidSprite1.image.width, asteroidSprite1.image.height,"ast"+i);
       var ast=findSprite(drawnSprites,"ast"+i);
        AsteroidArray.push(ast);
        var randDimension=(1.5+Math.random()*2);
        ast.image.width= randDimension*scalew;
        ast.image.height= randDimension*scaleh;
        ast.rotateDegree=Math.random()*360;
        ast.rotating=true;
        ast.rotatedirection=Math.floor(Math.random()*2);
        ast.trajectory=Math.random()*360;
        ast.maxVelocity = 300;
        ast.speed=Math.random()*15;
        ast.type="asteroid";
        ast.collider=makeSpriteCollider(ast,"circle");
        ast.iteration=iter;


        ast.update=function(){
            adjustPosXYByCenterPoint(this);
            //update center from new possible position to jump...
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

            

            this.X += this.speed*Math.sin(this.trajectory*Math.PI/180);
            this.Y -= this.speed*Math.cos(this.trajectory*Math.PI/180);
            this.centerX = this.cXrelation + this.X;
            this.centerY = this.cYrelation + this.Y;
            ///update based on trajectory...
            this.collider.update();
            this.collision();
            
            if(astCount <= 0) {
            	numAster=Math.floor(numAster*1.25);
            	astCount = numAster;
            	if(AsteroidArray.length>0){
                	for(var i = 0; i<AsteroidArray.length; i++){
                		removeCollider(AsteroidArray[i].collider);
                		removeDrawnSprite(AsteroidArray[i]);
                	}
                }
            	makeAsteroids(numAster,1,cellWidth,cellHeight,0,0);
            }

        }

        ast.collision=function(){
             for(var i=0; i<this.collider.collidedObjectsArray.length; i++){
     
                 if(this.collider.collidedObjectsArray[i].type=="bullet"){
                    if(this.iteration==1){
                    	if(astCount > 0 ) {
                    		astCount--;
                    	}
                        this.reset();
                        makeExplosion(this);             
                    }
                 }
             }
         }
         
         ast.reset=function(){
            removeDrawnSprite(this);
            removeCollider(this.collider);
            for(var j=0; j<AsteroidArray.length; j++){
                if(this == AsteroidArray[j]){
                    AsteroidArray.splice(j,1);
                }
            }

         }   
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
    
    
    bulletArray.push(bullet);

    bullet.type="bullet";
    bullet.collider=makeSpriteCollider(bullet,"circle");

    bullet.objectArray=bulletArray;

    bullet.update=function(){
    	bullet.speed=25;
        bullet.maxVelocity = 25;
        bullet.velocityX = bullet.speed*Math.sin(bullet.trajectory*Math.PI/180);
        bullet.velocityY = -1*bullet.speed*Math.cos(bullet.trajectory*Math.PI/180);
        if(onMenu) {
        	bullet.speed=0;
            bullet.maxVelocity = 0;
            bullet.velocityX = 0;
            bullet.velocityY = 0;
        }
        if(testSideCrossing(this)){
            removeDrawnSprite(this);
            removeCollider(this.collider);
        	for(var i=0; i<bulletArray.length; i++){
                if(bulletArray[i].ID==bullet.ID){
                   bulletArray.splice(i,1);
                }
            }
            numBullets--;        	
        }
        
        this.centerX = this.cXrelation + this.X;
        this.centerY = this.cYrelation + this.Y;
        this.collider.update();
        this.collision();
    }

    bullet.collision=function(){
        for(var i=0; i<this.collider.collidedObjectsArray.length; i++){
            if(this.collider.collidedObjectsArray[i].type=="asteroid"){
            	removeDrawnSprite(this);
                removeCollider(this.collider);
                score++;
            	for(var i=0; i<bulletArray.length; i++){
                    if(bulletArray[i].ID==bullet.ID){
                       bulletArray.splice(i,1);
                    }
                }
                numBullets--; 

            }
        }

    }

}

///not called any where else
function testBulletArray() {   
	var testString = "";
	for(var i=0; i<bulletArray.length; i++){
		testString = testString+ " " +bulletArray[i].ID;
	}
	console.log(testString);
}


function game_reset(){
	numAster= 6;
	astCount = numAster;
    if(AsteroidArray.length>0){
    	for(var i = 0; i<AsteroidArray.length; i++){
    		removeCollider(AsteroidArray[i].collider);
    		removeDrawnSprite(AsteroidArray[i]);
    	}
    }
	makeAsteroids(numAster,1,cellWidth,cellHeight,0,0);
	removeBooster();
	makeRocket();
	score = 0;
	
}

function drawStats(){
	
	var textfont ="verdana";
	var textfillstyle = "#FFFFFF";
	var textsize = 10;

	var score_text = "Score: " + score ;
	addText(textsize,textfont,score_text,5, canvas.height-5,textfillstyle);

	var highscore_text = "Session Highscore: " + highscore ;
	addText(textsize,textfont,highscore_text,5, canvas.height-20,textfillstyle);
}



///menu stuff
var onMenu = true;
var title = 'Asteroids';
var text = 'Esc to begin';
var measurement = 0;

function update(){
    ///new menu
    if(menu == 0) {
		onMenu = true;
	} else {
		onMenu = false;
	}
	if(!onMenu){



		drawnRocket.update();

		if(upkey){
			boosterOn = true;
		}
		if(upkey == false) {
			boosterOn = false;
			removeBooster();
		}
		if(boosterOn == true) {
			if( numBooster < maxBoosters )
				makeBooster();
			drawnbooster.update();
		}


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

		
	
        updateVelocity();
		collisionDetection();

		if (highscore < score) {
			highscore = score;
		}

		checkHighscore(score);

		for(var i=0; i<explodeArray.length; i++){
			explodeArray[i].update();
		}
	}
	for(var i=0; i<bulletArray.length; i++){
		bulletArray[i].update();
	}
}





function draw(){

	canvas.width = canvas.width;
    
	drawSprites();

    context.fillStyle="blue";
    context.font = '16px monospace';
    context.fillRect(0,asteroidscellHeight*asteroidsycellCount,canvas.width,canvas.height-asteroidscellHeight*asteroidsycellCount);
    drawStats();
    
    
	if(onMenu){
		context.fillStyle = 'white';
		context.font = '48px monospace';
		measurement = context.measureText(title);
		context.fillText(title, (context.canvas.width - measurement.width) / 2, context.canvas.height / 2);

		context.fillStyle = 'red';
		context.font = '24px monospace';
		measurement = context.measureText(text);
		context.fillText(text, (context.canvas.width - measurement.width) / 2, context.canvas.height / 2 + 30);
	} 	
}



