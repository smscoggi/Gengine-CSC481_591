var cellWidth = 15;
var cellHeight = 15;
var xcellCount = Math.floor(canvas.width/cellWidth);
var ycellCount = Math.floor(canvas.height/cellHeight);
var direction = 'none';

var score = 0;
var highscore = 0;

//Snake
var snake = new Snake(5, Math.floor(xcellCount/2)-1, Math.floor(ycellCount/2)-1);

function Snake(numLinks, posX, posY){
	var segPos = 0;
	var backwardsDirection = 'none';
	this.posX = posX;
	this.posY = posY;
	this.snakeLinks = numLinks;
	this.snakeArray = new Array();
	this.deadState = 'notDead';

	this.update = function(){

		switch(direction){
		case 'right':
			if (backwardsDirection != 'right' || backwardsDirection == 'none') {
				this.posX++;
				backwardsDirection = 'left';
			}
			if (backwardsDirection == 'right') {
				this.posX--;
			}
			break;
		case 'left':
			if (backwardsDirection != 'left' || backwardsDirection == 'none') {
				this.posX--;
				backwardsDirection = 'right';
			}
			if (backwardsDirection == 'left') {
				this.posX++;
			}
			break;
		case 'up':
			if (backwardsDirection != 'up' || backwardsDirection == 'none') {
				this.posY--;
				backwardsDirection = 'down';
			}
			if (backwardsDirection == 'up') {
				this.posY++;
			}
			break;
		case 'down':
			if (backwardsDirection != 'down' || backwardsDirection == 'none') {
				this.posY++;
				backwardsDirection = 'up';
			}
			if (backwardsDirection == 'down') {
				this.posY--;
			}
			break;
		}

		if (this.posX < 0) {
			this.posX = xcellCount - 1;
		}
		if (this.posX > xcellCount - 1) {
			this.posX = 0;
		}
		if (this.posY < 0) {
			this.posY = ycellCount - 1;
		}
		if (this.posY > ycellCount - 1) {
			this.posY =  0;
		}

		this.snakeArray.push({x:this.posX, y:this.posY, sP:segPos});
		segPos = 0;
		for(var iter = 0; iter < this.snakeArray.length; iter++) {
			this.snakeArray[iter].sP = segPos++;
		}
		while(this.snakeArray.length > this.snakeLinks) {
			this.snakeArray.shift();
		}

		for(var iter = 0; iter < this.snakeArray.length-1; iter++) {
			if (checkdistance(this.snakeArray[iter].x, this.snakeArray[iter].y, this.posX, this.posY, 0) && direction != 'none') {
				//make snake shorter
				/*this.snakeLinks = this.snakeLinks - this.snakeArray[iter].sP;
				if (this.snakeLinks < 3) {
					this.snakeLinks = 3;
				}*/
				//restart game
				this.deadState = 'dead';
			}
		}

		if (this.deadState == 'dead') {
			snake = new Snake(5, Math.floor(xcellCount/2)-1, Math.floor(ycellCount/2)-1);
			direction = 'none'
				score = 0;

			resetFood();

			deadState = 'notDead';
		}
		//console.log(this.snakeArray[0].x, posX);
/////test to see if snake ran into food/////

		for(var iter=0; iter<foodArray.length; iter++){
			foodCollide=foodArray[iter].collision(this.posX,this.posY,0);

			if (foodCollide == 1) { 
				snake.snakeLinks = snake.snakeLinks - 1;
				if (snake.snakeLinks < 2) {
					snake.deadState = 'dead';
				}
				score--;
				foodArray[iter].reset();
			}
			else if (foodCollide==2) { 
				snake.snakeLinks++;
				score++;
				foodArray[iter].reset();
			}

		}

	};

	this.draw = function(){
		canvas.width = canvas.width;
		context.fillStyle="black";
		context.fillRect(0,0,canvas.width,canvas.height);

		for(var iter=0; iter<this.snakeArray.length; iter++){
			context.fillStyle='green';
			context.fillRect(this.snakeArray[iter].x*cellWidth, this.snakeArray[iter].y*cellHeight, cellWidth, cellHeight);
			context.strokeStyle = 'yellow';
			context.strokeRect(cellWidth*this.snakeArray[iter].x, this.snakeArray[iter].y*cellHeight, cellWidth, cellHeight)
		}

	};



} //Snake


//Food Objects
var amountFood = 3;
var foodMaxLifeTime = 100;
var foodSpoilTime = 65;

addSprite("https://i.imgur.com/2IhGuoJ.png","redapple");
addSprite("https://i.imgur.com/dIPgiDN.png","greenapple");
var redApple = findSprite(sprites,"redapple");
var greenApple = findSprite(sprites,"greenapple");






makeFood(amountFood,foodSpoilTime,foodMaxLifeTime,redApple,greenApple);
//Food Objects


//Wall Objects
addSprite("https://i.imgur.com/3vugqUb.jpg","walltexture");
var wallSprite = findSprite(sprites,"walltexture");
var wallArray = new Array();
wallArray.push(new Wall(0,0,3,1));
wallArray.push(new Wall(6,4,4,1));
wallArray.push(new Wall(20,25,1,3));
wallArray.push(new Wall(2,24,5,1));
wallArray.push(new Wall(24,2,1,4));

for(var iter = 0; iter < wallArray.length; iter++){

	addDrawnSprites(wallSprite,wallArray[iter].xWall*cellWidth, wallArray[iter].yWall*cellHeight, cellWidth*wallArray[iter].xcellWidth, cellHeight*wallArray[iter].ycellLength,wallSprite.ID);

	/*wallArray[iter].draw = function wallDraw(xWall, yWall, xcellWidth, ycellLength) {
			context.fillStyle='blue';
			context.fillRect(xWall*cellWidth, yWall*cellHeight, cellWidth*xcellWidth, cellHeight*ycellLength);
		
	}*//////////// for block walls
} //Wall Objects


function makeWalls(){
	for(var iter = 0; iter < wallArray.length; iter++) {
		var wallid = "w"+iter;
		var wall = new Wall()
		var ThisWallSprite;

		for (var jter = 0; jter < wallArray[iter].xcellWidth; jter++) {
			for (var kter = 0; kter < wallArray[iter].ycellLength; kter++) {
				if (checkdistance(wallArray[iter].xWall+jter, wallArray[iter].yWall+kter, snake.posX, snake.posY, 0)) { 	
					snake.deadState = 'dead';
				}
			}
		}

		}
	}







function drawStats(){
	
		var textfont ="verdana";
		var textfillstyle = "#FFFFFF";
		var textsize = 10;
	
		var score_text = "Score: " + score ;
			//context.fillStyle="#FFFFFF";
			//context.fillText(score_text, 5, canvas.height-5);
		addText(textsize,textfont,score_text,5, canvas.height-5,textfillstyle);
	
		var highscore_text = "Session Highscore: " + highscore ;
			//context.fillStyle="#FFFFFF";
			//context.fillText(highscore_text, 5, canvas.height-20);
		addText(textsize,textfont,highscore_text,5, canvas.height-20,textfillstyle);
	
	
		var highscore_text2 = "Alltime Highscore: " + localhighscore;
			//context.fillStyle="#FFFFFF";
			//context.fillText(highscore_text2, 5, canvas.height-45);
		addText(textsize,textfont,highscore_text2,5, canvas.height-45,textfillstyle);
		
	
	}


/////////////////////////////////////////////////////////UPDATE + Draw

function update() {
	
	////moved from game_loop
	snake.update();
	
	for(var iter = 0; iter < foodArray.length; iter++){
		foodArray[iter].update();
		//foodArray[iter].draw();
	}
	makeWalls();
	//////////////////////////

	if (highscore < score) {
		highscore = score;
	}
	
	checkHighscore(score);
}


function draw() {
	testDrawnSprites();
	testSprites();

	snake.draw();
	drawSprites();

	drawStats();

}


