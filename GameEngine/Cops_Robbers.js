
////set up grid 
var CRcellWidth = 35;
var CRcellHeight = 35;
var CRxcellCount = Math.floor(canvas.width/CRcellWidth);
var CRycellCount = Math.floor(canvas.height/CRcellHeight-1);
var gameFinished = 0;

setCanvasGrid(CRcellWidth,CRcellHeight, CRxcellCount, CRycellCount);

LevelGridArray=[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,
                1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
                1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
                1,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,
                1,0,1,1,1,1,1,1,0,1,0,0,0,1,0,0,0,0,0,1,1,1,
                1,0,0,0,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,
                1,1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,0,0,1,
                0,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,1,1,1,1,
                0,1,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,0,0,1,0,
                0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,1,1,0,0,0,1,0,
                0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,
                0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,
                1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
                1,1,0,0,1,1,1,0,0,0,1,0,0,1,0,0,0,0,0,1,1,0,
                1,1,0,0,1,0,0,0,1,1,1,0,0,1,1,1,1,0,0,1,1,0,
                0,1,1,1,1,1,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ];


////sprite setup for cops and robbers
    //cops
    addSprite("https://i.imgur.com/lnVxiLL.png","cop");
    var copsprite= findSprite(sprites,"cop");
    //robber
    addSprite("https://i.imgur.com/4ixYlLR.png","robber");
    var robbersprite= findSprite(sprites,"robber");



    //cop setup
    copsprite.image.width= cellWidth;
    copsprite.image.height=cellHeight;
    var copArray=new Array();
    var numCops=3;
    var copCount = numCops;
    //var spawnDistance = 10;
    
    makeCops(numCops);
    
    
    
    function makeCops(numCops){
    
        for(var i=0; i<numCops; i++){

            //setup start position
            
            var startposX;
            var startposY;
            var walkable=false;
            while(!walkable){
                startposX= Math.floor(Math.random()*xcellCount);
                startposY= Math.floor( Math.random()*ycellCount);
                walkable= checkWalkable(startposX,startposY);
               
            }

            //console.log(startposX+" "+ startposY+""+walkable);
            addDrawnSprites(copsprite, startposX*cellWidth, startposY*cellHeight,copsprite.image.width, copsprite.image.height,"cop"+i);
            var thisCop=findSprite(drawnSprites,"cop"+i);
            copArray.push(thisCop);
            thisCop.posX=thisCop.X/cellWidth;
            thisCop.posY=thisCop.Y/cellHeight;
            thisCop.collider = makeSpriteCollider(thisCop, "box");


            if(thisCop.ID=="cop1"){
                thisCop.user=true;
            }

            thisCop.update=function(){
            
               if(this.user){
                   this.moved=false;
                   walkable=false;
                    if(direction=="up"){
                        walkable=checkWalkable(this.posX,this.posY-1);
                            if(walkable){
                                this.posY--;
                                this.moved=true;
                            }
                    }
                    else if(direction=="down"){
                        walkable=checkWalkable(this.posX,this.posY+1);
                        if(walkable){
                            this.posY++;
                            this.moved=true;
                        }
                    }
                    else if(direction=="left"){
                        walkable=checkWalkable(this.posX-1,this.posY);
                        if(walkable){
                            this.posX--;
                            this.moved=true;
                        }
                    }
                    else if(direction=="right"){
                        walkable=checkWalkable(this.posX+1,this.posY);    
                        if(walkable){
                            this.posX++;
                            this.moved=true;
                        }                  
                    }
                    direction="none";
               }
               else{
                    if(robberArray.length>0){
                    var closestRobber=findClosest(this.posX, this.posY,robberArray);
                    }
                //  console.log(closestRobber.posX+ " "+ closestRobber.posY);

                // context.fillStyle="red";
                //context.fillRect(closestRobber.posX*cellWidth, closestRobber.posY*cellHeight,closestRobber.image.width,closestRobber.image.height);
                //copDirection=
                 if(closestRobber!=null){
                 var nextTile= directionByAstar(this.posX,this.posY,closestRobber.posX,closestRobber.posY,LevelGridArray);
                    if(nextTile!=null){ 
                        this.posX=nextTile.posX;
                        this.posY=nextTile.posY;
                        this.X=this.posX*cellWidth;
                        this.Y=this.posY*cellHeight;
                    }
                 }
                this.collider.update();
                this.collision();


            }
            this.X=this.posX*cellWidth;
            this.Y=this.posY*cellHeight;
            }

            thisCop.collision = function(){
            	for(var i = 0; i < robberArray.length; i++){
            		if(this.posX == robberArray[i].posX && this.posY == robberArray[i].posY){
            			robberArray[i].destroy();
            		}
            	}
            }
            
            thisCop.destroy = function(){
            	removeDrawnSprite(this);
            }

        }
    }  
    
//cop setup
robbersprite.image.width= cellWidth;
robbersprite.image.height=cellHeight;
var robberArray=new Array();
var numRobbers=2;
var robberCount = numRobbers;
var numCaughtRobbers=0;
//var spawnDistance = 10;

makeRobbers(numRobbers);



function makeRobbers(numRobbers){

    for(var i=0; i<numRobbers; i++){

        //setup start position
        
        var startposX;
        var startposY;
        var walkable=false;
        while(!walkable){
            startposX= Math.floor(Math.random()*xcellCount);
            startposY= Math.floor( Math.random()*ycellCount);
            walkable= checkWalkable(startposX,startposY);
           
        }

       // console.log(startposX+" "+ startposY+""+walkable);
       addDrawnSprites(robbersprite, startposX*cellWidth, startposY*cellHeight,robbersprite.image.width, robbersprite.image.height,"robber"+i);
       var thisRobber=findSprite(drawnSprites,"robber"+i);
       thisRobber.collider = makeSpriteCollider(thisRobber, "box");
       robberArray.push(thisRobber);
        thisRobber.posX=thisRobber.X/cellWidth;
        thisRobber.posY=thisRobber.Y/cellHeight;

    thisRobber.update= function(){
      
        var pposX=this.X/cellWidth;
        var pposY=this.Y/cellHeight;
        var moveable=false;
        while(!moveable){
             pposX=this.X/cellWidth;
             pposY=this.Y/cellHeight;
            randomdirection=Math.floor(Math.random()*4);
            if(randomdirection<2){
                if(randomdirection<1){
                    pposY++;
                }
                else{
                    pposY--;
                }
            }
            else{
                if(randomdirection<3){
                    pposX++;
                }
                else{
                    pposX--;
                }

            }
            moveable= checkWalkable(pposX,pposY);
           
        }
       //var furthestTile= findFurthestSpot(this.posX, this.posY,copArray);
      // var nextTile= directionByAstar(this.posX,this.posY,furthestTile.posX,furthestTile.posY,LevelGridArray);

        this.posX=pposX;
        this.posY=pposY;
       //if(nextTile!=null){
            //this.posX=nextTile.posX;
           // this.posY=nextTile.posY;
            this.X = pposX*cellWidth;
            this.Y = pposY*cellHeight;
       //}
       // console.log(pposX+" "+pposY);

        this.collider.update();
        this.collision();
    }
    
    thisRobber.collision = function(){
    	/*console.log(this.collider.top + " robber " + this.collider.bottom);
    	for(var i=0; i<this.collider.collidedObjectsArray.length; i++){
    		console.log("aaa");
			if(this.collider.collidedObjectsArray[i] != null){
				console.log("fadsd");
		    	robberCount--;
		    	removeDrawnSprite(this);
		    	removeCollider(this.collider);
		    	if(robberCount == 0){
		    		finishGame();
		    	}

			}
		}*/
    	for(var i = 0; i < copArray.length; i++){
    		if(this.posX == copArray[i].posX && this.posY == copArray[i].posY){
                this.destroy();
                numCaughtRobbers++;
    		}
    	}
    }
    
    thisRobber.destroy = function(){
    	console.log(numRobbers);
		robberCount--;
		removeDrawnSprite(this);
		for(var j = 0; j < robberArray.length; j++){
			if(this.ID == robberArray[j].ID){
				robberArray.splice(j,1);
			}
		}
		if(robberArray.length == 0){
			gameFinished = 1;
		}
		
    }
    
    }
}  
    


function findClosest(copPosX,copPosY,thisArray){
    var closestRobber=thisArray[0];
    var crDistance=actualDistance(copPosX,copPosY,closestRobber.posX,closestRobber.posY);
    for(var i=1; i<thisArray.length; i++){
        var tempDistance=actualDistance(copPosX,copPosY,thisArray[i].posX,thisArray[i].posY);
        if(tempDistance<crDistance){
            crDistance=tempDistance;
            closestRobber=thisArray[i];
        }
    }
    return closestRobber;

}
function findFurthestSpot(robposX, robposY,copArray){
   var  closestCop= findClosest(robposX,robposY,copArray);
   var  tiles= loadtiles(LevelGridArray);
   var goal;
    for(var i=0; i<tiles.length; i++){
        if(closestCop.posX==tiles[i].posX && closestCop.posY==tiles[i].posY){
            goal=tiles[i];
            tiles[i].distanceToGoal=0;
        }  
    }
    var furthesttile=goal;
    for(var i=0; i<tiles.length; i++){
        tiles[i].calcDistanceToCity(goal);
        if(tiles[i].distanceToGoal>furthesttile.distanceToGoal){
            furthesttile= tiles[i];
        }
    }
    return furthesttile;
    
}

////////functions... to move to engine??
    function checkWalkable(posX,posY){
        if(LevelGridArray[posY*xcellCount +posX] !=null){
        if(LevelGridArray[posY*xcellCount +posX] ==1){
            return true;
        }
        else{
            return false;
        }
    }

    }

function finishGame(){
	while(copArray.length > 0){
		copArray[0].destroy();
		copArray.splice(0,1);
	}
	while(robberArray.length > 0){
		robberArray[0].destroy();
	}
	console.log(numRobbers);
	robberCount = numRobbers;
	makeCops(numCops);
	makeRobbers(numRobbers);
	gameFinished = 0;
}



var turn=0;
var robberturn=0;
var copturn=0;
var waitnumber=6;
var waitcounter=0;

function update(){

    if(waitcounter>=6){
         if(robberturn<robberArray.length){
             robberArray[robberturn].update();
            robberturn++;
           // console.log(robberturn+"robberturn");
            waitcounter=0;
        }
        else if(copturn<copArray.length){
             copArray[copturn].update();
            if(copArray[copturn].ID=="cop1"){
                copArray[copturn].color="green";
                if (copArray[copturn].moved){
                    copArray[copturn].color="red";
                copturn++;
                waitcounter=0;
                }
                else{
                    waitcounter++
                }
        }
            else{
                copturn++;
                waitcounter=0;
            }
             //if user... then no update to this...
            //copturn++;
         //   console.log(copturn+"copturn");

            //if user... then waitcounter++ to keep open the turn
           // waitcounter=0;
         }
         else{
            turn++;
            robberturn=0;
            copturn=0;
          //  console.log(turn+ "turn");
            waitcounter=0;

        }
     
    }
    else{
        waitcounter++;
    }
   


    direction="none";
}




function draw(){
    
        canvas.width = canvas.width;
    
       
    
        context.fillStyle="grey";
        context.font = '16px monospace';
        context.fillRect(0,cellHeight*ycellCount,canvas.width,canvas.height-cellHeight*ycellCount);
        context.fillStyle="black";
       // context.strokeRect(0, cellHeight*ycellCount,canvas.width,canvas.height-cellHeight*ycellCount);
        //context.fillRect(0,0,canvas.width,cellHeight*ycellCount);       // drawStats();



        //grid drawing
        
       // context.fillRect(0,0,cellWidth,cellHeight);

      
    

        for(var i=0; i<LevelGridArray.length; i++){
            context.fillStyle="white";
           if(LevelGridArray[i]==1){
                    var ix = i-(Math.floor(i/(xcellCount))*xcellCount);
                    var iy =Math.floor(i/(xcellCount));
                    context.fillRect(ix*cellWidth,iy*cellHeight,cellWidth,cellHeight);
                    context.fillStyle="black";
                    context.strokeRect(ix*cellWidth,iy*cellHeight,cellWidth,cellHeight);
                  //  console.log(ix + " "+iy+ " " +iy*cellHeight);
           }

        }

        userSprite=findSprite(copArray,"cop1");
        context.fillStyle=userSprite.color;
        context.fillRect(userSprite.X,userSprite.Y,userSprite.image.width,userSprite.image.height);
        drawSprites();

        addText("30","comic Sans","Turn:"+turn,10,cellHeight*ycellCount+15,"white");
        addText("30","comic Sans","Robbers Caught:"+numCaughtRobbers,10,cellHeight*ycellCount+30,"white");
        
       /* if(onMenu){
            context.fillStyle = 'white';
            context.font = '48px monospace';
            measurement = context.measureText(title);
            context.fillText(title, (context.canvas.width - measurement.width) / 2, context.canvas.height / 2);
    
            context.fillStyle = 'red';
            context.font = '24px monospace';
            measurement = context.measureText(text);
            context.fillText(text, (context.canvas.width - measurement.width) / 2, context.canvas.height / 2 + 30);
        } */	
        if(gameFinished){
        	var text;
        	if(gameFinished == 1){
        		text = "Congratulations! You've won."
        	}
        	else{
        		text = "The robbers got away."
        	}
        	context.font = '50px monospace';
        	var textMeasurement = context.measureText(text);
        	var textXPos = (context.canvas.width - textMeasurement.width) / 2;
        	var textYPos = context.canvas.height / 2 - 50;
        	context.fillStyle = 'red';
    		context.fillText(text, textXPos, textYPos);
    		
    		var text2 = "Press spacebar to restart.";
    		var text2Measurement = context.measureText(text2);
    		var text2XPos = (context.canvas.width - text2Measurement.width) / 2;
    		context.fillText(text2, text2XPos, textYPos + 100)
    		
    		if(spacebar){
    			finishGame();
    		}
        }
    }
