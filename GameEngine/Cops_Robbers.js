
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

console.log(canvas.width/cellWidth);
console.log(canvas.height/cellHeight);










function update(){

}




function draw(){
    
        canvas.width = canvas.width;
    
        drawSprites();
    
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
                    console.log(ix + " "+iy+ " " +iy*cellHeight);
           }

        }
    
    
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
    