
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

            thisCop.update=function(){
                //find nearest robber and get posx,posy of robber;
                var closestRobber=findClosest(this.posX, this.posY,robberArray);
              //  console.log(closestRobber.posX+ " "+ closestRobber.posY);

               // context.fillStyle="red";
                //context.fillRect(closestRobber.posX*cellWidth, closestRobber.posY*cellHeight,closestRobber.image.width,closestRobber.image.height);
              //copDirection=
              var nextTile= directionByAstar(this.posX,this.posY,closestRobber.posX,closestRobber.posY,LevelGridArray);
             if(nextTile!=null){ 
                var n=nextTile.posX;
                this.posX=nextTile.posX;
                this.posY=nextTile.posY;
                this.X=this.posX*cellWidth;
                this.Y=this.posY*cellHeight;
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
            this.X = this.posX*cellWidth;
             this.Y = this.posY*cellHeight;
       //}
       // console.log(pposX+" "+pposY);

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
    