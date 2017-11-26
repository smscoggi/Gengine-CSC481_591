









function draw(){
    
        canvas.width = canvas.width;
    
        drawSprites();
    
        context.fillStyle="green";
        context.font = '16px monospace';
        context.fillRect(0,asteroidscellHeight*asteroidsycellCount,canvas.width,canvas.height-asteroidscellHeight*asteroidsycellCount);
        context.fillStyle="black";
        context.strokeRect(0, asteroidscellHeight*asteroidsycellCount,canvas.width,canvas.height-asteroidscellHeight*asteroidsycellCount);
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
    