//Samantha Scoggins: smscoggi
//Giovanni Espinosa: gespino
//George Yang: ggyang


canvas = document.getElementById("whyupdate");
context = canvas.getContext('2d');

var dragX = 0;
var dragY = 0;
var selectedImage = -1;
var dragging = false;

var sprites = new Array();
var drawnSprites = new Array();

function Sprite(x, y, width, height, src, ID) {
    this.X = x;
    this.Y = y;
    this.image = new Image();
    this.image.width = width;
    this.image.height = height;
    this.image.src = src;
    this.ID = ID;
}

function checkSprite(sprite, x, y) {
  var minX = sprite.X;
  var maxX = sprite.X + sprite.image.width;
  var minY = sprite.Y;
  var maxY = sprite.Y + sprite.image.height;
  var mx = x;
  var my = y;
  console.log(minX + " " + maxX);
  if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {

    return true;
  }
  return false;
}

function addSprite(path, ID){
   
    tempSprite = new Sprite(20, 0, 100, 100, path, ID);
    sprites.push(tempSprite);
}

function addDrawnSprite(Sprite) {
	var newY = 0;
	if(drawnSprites.length > 0){
        newY = drawnSprites[drawnSprites.length-1].Y + 140;
    }
    else{
        newY = 40;
    }
    Sprite.X = 20;
    Sprite.Y = newY;
    drawnSprites.push(Sprite);
}


////////////////////myfunctions///////////////////

function addText(size,font,text){
			context.font = size+" "+font;
  	context.fillStyle="#000000";
  	context.fillText(text, canvas.width/3, 50);
}

function selectedOutline(){
	 if (selectedImage >= 0) {
        context.beginPath();
        context.lineWidth = "9";
        context.strokeStyle = "blue";
        context.rect(drawnSprites[selectedImage].X, drawnSprites[selectedImage].Y, drawnSprites[selectedImage].image.width, drawnSprites[selectedImage].image.height);
        context.stroke();
        
    }
}
function drawSprites(){
for (var iter = 0; iter < drawnSprites.length; iter++) {
        context.drawImage(drawnSprites[iter].image, drawnSprites[iter].X, drawnSprites[iter].Y, drawnSprites[iter].image.width, drawnSprites[iter].image.height);
    }
    }
    
function dragSprite(){
     sprites[selectedImage].X = dragX- (sprites[selectedImage].image.width/2);
        sprites[selectedImage].Y = dragY- (sprites[selectedImage].image.height/2);
}
////////////////////////////////////////////////
//TEST STUFF
var collided = false;

function checkCollide(){

			var collisionArray = new Array();
			var corners =new Array();
		corners.push(  spriteHit(drawnSprites[selectedImage].X,drawnSprites[selectedImage].Y));
    corners.push( spriteHit(drawnSprites[selectedImage].X + drawnSprites[selectedImage].image.width,drawnSprites[selectedImage].Y));
    corners.push( spriteHit(drawnSprites[selectedImage].X,drawnSprites[selectedImage].Y + drawnSprites[selectedImage].image.height));
    corners.push(spriteHit(drawnSprites[selectedImage].X+ drawnSprites[selectedImage].image.width,drawnSprites[selectedImage].Y+ drawnSprites[selectedImage].image.height));
    /////for right now.. checking corners of dragged sprite against possible overlaps and returning sprites it "collides" with...choosing sprite to check combination based on highest index of sprite... need to change for layering...
    
  var max=-1;
   for(var i=0; i<corners.length; i++){
   		if(corners[i]>max){
      	max=corners[i];
      }
   }
  
   
   if(max>=0){
   	collided= true;
    		collisionArray.push(drawnSprites[selectedImage]);
        collisionArray.push(drawnSprites[max]);
   }
   
   return collisionArray;
}

function spriteHit(x,y){
	for (var i = 0; i < drawnSprites.length; i++) {
  	if(selectedImage!=i){
  		var hitSprite =drawnSprites[i];
      var thisx= x;
      var thisy= y;
      
      var spriteX1= hitSprite.X;
      var spriteX2= hitSprite.X + hitSprite.image.width;
      var spriteY1= hitSprite.Y;
      var spriteY2= hitSprite.Y + hitSprite.image.height;
      
      if(thisx>=spriteX1 && thisx<=spriteX2 && thisy>=spriteY1 && thisy<=spriteY2){
      	
       
      	return i;
         break;
      }
  }
  }
   return -1;
  
}




function checkAllCollisions() {
var collisonArray = new Array();
  for (var iter = 0; iter < drawnSprites.length; iter++) {
  	for (var jter = 0; jter < drawnSprites.length; jter++) {
			if(drawnSprites[iter].ID != drawnSprites[jter].ID && Math.abs(drawnSprites[iter].X-drawnSprites[jter].X) < 20 && Math.abs(drawnSprites[iter].Y-drawnSprites[jter].Y) < 20) {
    		collided = true;
        collisonArray.push(drawnSprites[iter]);
        collisonArray.push(drawnSprites[jter]);
  		}
    }
   }
   return collisonArray;
}

