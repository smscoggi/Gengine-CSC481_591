var cellWidth = 20;
var cellHeight = 20;
var xcellCount = Math.floor(canvas.width/cellWidth);
var ycellCount = Math.floor(canvas.height/cellHeight);
var direction = 'none';


function Snake(numSegments, posX, posY){
	var segPos = 0;
	var backwardsDirection = 'none';
	this.posX = posX;
	this.posY = posY;
	this.segments = numSegments;
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
		while(this.snakeArray.length > this.segments) {
			this.snakeArray.shift();
		}

		for(var iter = 0; iter < this.snakeArray.length-1; iter++) {
			if (checkdistance(this.snakeArray[iter].x, this.snakeArray[iter].y, this.posX, this.posY, 0) && direction != 'none') {
				//make snake shorter
				this.segments = this.segments - this.snakeArray[iter].sP;
				if (this.segments < 3) {
					this.segments = 3;
				}
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
				foodArray.push(new Food(Math.floor(Math.random()*xcellCount), Math.floor(Math.random()*ycellCount), 50, 100))	
			}

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



} //snake

function Food(x, y, spoilTime, maxTimeLife) {
	this.xfood = x;
	this.yfood = y;
	this.spoilTimer = 0;
	this.maxTimeLife = maxTimeLife;

	this.update = function() {
		//console.log(snake.deadState);
		if (this.spoilTimer < maxTimeLife) {
			this.spoilTimer++;
		}
		if (this.spoilTimer == maxTimeLife) {
			this.spoilTimer = 0;
			this.xfood = Math.floor(Math.random()*xcellCount);
			this.yfood = Math.floor(Math.random()*ycellCount);
		}

		if (checkdistance(this.xfood, this.yfood, snake.posX, snake.posY, 0) && this.spoilTimer > spoilTime) { 
			snake.deadState = 'dead';
		}

		if (checkdistance(this.xfood, this.yfood, snake.posX, snake.posY, 0)) { 
			snake.segments++;
			score++;
			this.spoilTimer = 0;
			this.xfood = Math.floor(Math.random()*xcellCount);
			this.yfood = Math.floor(Math.random()*ycellCount);
		}


	}

	this.draw = function() {
		context.fillStyle='red';
		if (this.spoilTimer >= spoilTime) {
			context.fillStyle='purple';
		}
		context.fillRect(this.xfood*cellWidth, this.yfood*cellHeight, cellWidth, cellHeight);
	}
}

function Wall(xWall, yWall, xcellWidth, ycellLength) {
	this.xWall = xWall;
	this.yWall = yWall;
	this.xcellWidth = xcellWidth;
	this.ycellLength = ycellLength;

	this.update = function() {
		for (var iter = 0; iter < xcellWidth; iter++) {
			for (var jter = 0; jter < ycellLength; jter++) {
				if (checkdistance(this.xWall+iter, this.yWall+jter, snake.posX, snake.posY, 0)) { 	
					snake.deadState = 'dead';
				}
			}
		}
	}

	this.draw = function() {
		context.fillStyle='blue';
		context.fillRect(this.xWall*cellWidth, this.yWall*cellHeight, cellWidth*xcellWidth, cellHeight*ycellLength);
	}

}

var score = 0;
var highscore = 0;
var amountFood = 3;
var amountWalls = 3;
var snake = new Snake(5, Math.floor(xcellCount/2)-1, Math.floor(ycellCount/2)-1);
var foodArray = new Array();
var wallArray = new Array();
for(var iter = 0; iter < amountFood; iter++) {
	var food = new Food(Math.floor(Math.random()*xcellCount), Math.floor(Math.random()*ycellCount), 50, 100);
	foodArray.push(food);
}

wallArray.push(new Wall(0,0,3,1));
wallArray.push(new Wall(5,4,3,1));
wallArray.push(new Wall(15,16,1,3));

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
		wallArray[iter].update();
		wallArray[iter].draw();
	}
	draw();
	//console.log(snake.segments);
}
setInterval(game_loop, 60);