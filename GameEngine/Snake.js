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

			for(var iter = 0; iter < amountFood; iter++) {
				foodArray.shift();	
			}
			makeFood(amountFood,foodSpoilTime,foodMaxLifeTime);

			deadState = 'notDead';
		}
		//console.log(this.snakeArray[0].x, posX);

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
var foodSpoilTime = 50;
var foodArray = new Array();

function makeFood(amountFood, foodSpoilTime, foodMaxLifeTime){
	for(var iter = 0; iter < amountFood; iter++) {
		var food = new Food(Math.floor(Math.random()*xcellCount), Math.floor(Math.random()*ycellCount), foodSpoilTime, foodMaxLifeTime);
		food.update = function() {
			//console.log(snake.deadState);
			if (this.spoilTimer < foodMaxLifeTime) {
				this.spoilTimer++;
			}
			if (this.spoilTimer == foodMaxLifeTime) {
				this.spoilTimer = 0;
				this.xfood = Math.floor(Math.random()*xcellCount);
				this.yfood = Math.floor(Math.random()*ycellCount);
			}

			if (checkdistance(this.xfood, this.yfood, snake.posX, snake.posY, 0) && this.spoilTimer >= foodSpoilTime) { 
				snake.snakeLinks = snake.snakeLinks - 1;
				if (snake.snakeLinks < 2) {
					snake.deadState = 'dead';
				}
				score--;
				this.spoilTimer = 0;
				this.xfood = Math.floor(Math.random()*xcellCount);
				this.yfood = Math.floor(Math.random()*ycellCount);
			}

			if (checkdistance(this.xfood, this.yfood, snake.posX, snake.posY, 0) && this.spoilTimer < foodSpoilTime) { 
				snake.snakeLinks++;
				score++;
				this.spoilTimer = 0;
				this.xfood = Math.floor(Math.random()*xcellCount);
				this.yfood = Math.floor(Math.random()*ycellCount);
			}
			console.log(snake.snakeLinks);

		}

		food.draw = function() {
			context.fillStyle='red';
			if (this.spoilTimer >= foodSpoilTime) {
				context.fillStyle='purple';
			}
			context.fillRect(this.xfood*cellWidth, this.yfood*cellHeight, cellWidth, cellHeight);
		}
		foodArray.push(food);
	}
}

makeFood(amountFood,foodSpoilTime,foodMaxLifeTime);
//Food Objects


//Wall Objects
var wallArray = new Array();
wallArray.push(new Wall(0,0,3,1));
wallArray.push(new Wall(6,4,4,1));
wallArray.push(new Wall(20,25,1,3));
wallArray.push(new Wall(2,24,5,1));
wallArray.push(new Wall(24,2,1,4));


for(var iter = 0; iter < wallArray.length; iter++){
	wallArray[iter].update = function wallUpdate(xWall, yWall, xcellWidth, ycellLength){
		for (var jter = 0; jter < xcellWidth; jter++) {
			for (var kter = 0; kter < ycellLength; kter++) {
				if (checkdistance(xWall+jter, yWall+kter, snake.posX, snake.posY, 0)) { 	
					snake.deadState = 'dead';
				}
			}
		}
	}
	
	wallArray[iter].draw = function wallDraw(xWall, yWall, xcellWidth, ycellLength) {
			context.fillStyle='blue';
			context.fillRect(xWall*cellWidth, yWall*cellHeight, cellWidth*xcellWidth, cellHeight*ycellLength);
		
	}
} //Wall Objects








function draw() {
	var score_text = "Score: " + score ;
	context.fillStyle="#FFFFFF";
	context.fillText(score_text, 5, canvas.height-5);

	if (highscore < score) {
		highscore = score;
	}
	var highscore_text = "Highscore: " + highscore ;
	context.fillStyle="#FFFFFF";
	context.fillText(highscore_text, 5, canvas.height-20);
}

function game_loop(){
	snake.update();
	snake.draw();
	for(var iter = 0; iter < foodArray.length; iter++){
		foodArray[iter].update();
		foodArray[iter].draw();
	}
	for(var iter = 0; iter < wallArray.length; iter++){
		wallArray[iter].update(wallArray[iter].xWall, wallArray[iter].yWall, wallArray[iter].xcellWidth, wallArray[iter].ycellLength);
		wallArray[iter].draw(wallArray[iter].xWall, wallArray[iter].yWall, wallArray[iter].xcellWidth, wallArray[iter].ycellLength);
	}
	draw();
	//console.log(snake.snakeLinks);
}
setInterval(game_loop, 50);