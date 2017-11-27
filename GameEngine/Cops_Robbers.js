
////set up grid 
var CRcellWidth = 35;
var CRcellHeight = 35;
var CRxcellCount = Math.floor(canvas.width/CRcellWidth);
var CRycellCount = Math.floor(canvas.height/CRcellHeight-1);

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

            thisCop.update=function(){
                //find nearest robber and get posx,posy of robber;
                var closestRobber=findClosest(this.posX, this.posY,robberArray);
              //  console.log(closestRobber.posX+ " "+ closestRobber.posY);

               // context.fillStyle="red";
                //context.fillRect(closestRobber.posX*cellWidth, closestRobber.posY*cellHeight,closestRobber.image.width,closestRobber.image.height);
              //copDirection=
              var nextTile= directionByAstar(this.posX,this.posY,closestRobber.posX,closestRobber.posY,LevelGridArray);
              this.posX=nextTile.posX;
              this.posY=nextTile.posY;
              this.X=this.posX*cellWidth;
              this.Y=this.posY*cellHeight;
              this.collider.update();
              this.collision();
            }

            thisCop.collision = function(){
            	for(var i = 0; i < robberArray.length; i++){
            		if(this.posX == robberArray[i].posX && this.posY == robberArray[i].posY){
            			robberArray[i].destroy();
            		}
            	}
            }

        }
    }  
    
//cop setup
robbersprite.image.width= cellWidth;
robbersprite.image.height=cellHeight;
var robberArray=new Array();
var numRobbers=2;
var robberCount = numRobbers;
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
        this.posX=pposX;
        this.posY=pposY;

        this.X = pposX*cellWidth;
        this.Y = pposY*cellHeight;
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
    			console.log("a");
    			this.destroy();
    		}
    	}
    }
    
    thisRobber.destroy = function(){
    	console.log("collision");
		numRobbers--;
		removeDrawnSprite(this);
		for(var j = 0; j < robberArray.length; j++){
			if(this.ID == robberArray[j].ID){
				robberArray.splice(j,1);
			}
		}
    }
    
    }
}  
    


function findClosest(copPosX,copPosY,thisArray){
    closestRobber=thisArray[0];
    crDistance=actualDistance(copPosX,copPosY,closestRobber.posX,closestRobber.posY);
    for(var i=1; i<thisArray.length; i++){
        tempDistance=actualDistance(copPosX,copPosY,robberArray[i].posX,thisArray[i].posY);
        if(tempDistance<crDistance){
            crDistance=tempDistance;
            closestRobber=thisArray[i];
        }
    }
    return closestRobber;

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

             //if user... then no update to this...
            copturn++;
         //   console.log(copturn+"copturn");

            //if user... then waitcounter++ to keep open the turn
            waitcounter=0;
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
        drawSprites();
    
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
    }
    