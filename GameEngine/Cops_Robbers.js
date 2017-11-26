
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

            console.log(startposX+" "+ startposY+""+walkable);
            addDrawnSprites(copsprite, startposX*cellWidth, startposY*cellHeight,copsprite.image.width, copsprite.image.height,"cop"+i);
            var thisCop=findSprite(drawnSprites,"cop"+i);
            copArray.push(thisCop);


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

        console.log(startposX+" "+ startposY+""+walkable);
       addDrawnSprites(robbersprite, startposX*cellWidth, startposY*cellHeight,robbersprite.image.width, robbersprite.image.height,"robber"+i);
       var thisRobber=findSprite(drawnSprites,"robber"+i);
       robberArray.push(thisRobber);


    }
}  
    




////////functions... to move to engine??
    function checkWalkable(posX,posY){
        if(LevelGridArray[posY*xcellCount +posX] ==1){
            return true;
        }
        else{
            return false;
        }

    }








var turn=0;
var robberturn=0;
var copturn=0;
var waitnumber=6;
var waitcounter=0;
function update(){

    if(waitcounter==6){
         if(robberturn<robberArray.length){
             robberArray[robberturn].update;
            robberturn++;
            console.log(robberturn+"robberturn");
        }
        else if(copturn<copArray.length){
             copArray[copturn].update;
            copturn++;
            console.log(copturn+"copturn");
         }
         else{
            turn++;
            robberturn=0;
            copturn=0;
            console.log(turn+ "turn");

        }
     waitcounter=0;
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
    