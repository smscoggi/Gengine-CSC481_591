//peer to peer
var peer1 = new Peer({key: 'rr8fcgawspd2huxr'});
//var peer2 = new Peer({key: 'riw1ul3wmdjthuxr'});
var connected1=false;
var connected2=false;
var peer1ID;
peer1.on('open', function(id) {
	peer1ID= id;
	console.log('My peer1 ID is: ' + id);

  });

  var conn;

  // Call a peer, providing our mediaStream

  peer1.on('connection', function(dataConnection){
	connected2=true;
	conn = dataConnection;
	multiplayerSnakeSetup();
	conn.on('data', function(data){
		//console.log("Data received: "+data);
		drawnSpritesConnectUpdate(data);
		snakeConnectUpdate(data);

		//conn.send(" I GOOT YOUUU");
		//testSend();

	});

	console.log("Connected");
		
		

	});

function snakeConnectUpdate(data){
	if(data.constructor === Array){
		if(data[0]=="sn"){
			if(data[4]==1){
				//snake1.numLinks=data[1];
				//snake1.posX= data[2];
				//snake1.posY= data[3];
				//snake1.deadState=data[5];
				
				snake1.snakeArray=data[6];
				
				//console.log(data[6].length);
			}
			else{
				snake2.snakeArray=data[6];
			}


	}}
}


function drawnSpritesConnectUpdate(data){
	if(data.constructor === Array){
		if(data[0]=="ds"){
			//console.log("got the DSSSSS");

			var myDS=findSprite(drawnSprites,data[6]);
			myDS.X=data[1];
			myDS.Y=data[2];
			myDS.image.width=data[3];
			myDS.image.height=data[4];
			myDS.image.src=data[5];
			
			
		}
	}

}




function testSend(){
	conn.send('This is a test send');
}


function connectToPeer2(peer2ID){
 	conn = peer1.connect(peer2ID);
 	//peer1.on('connection', function(conn) { });
	
 	conn.on('open', function() {
		console.log(peer2ID);
		connected1=true;
		// Receive messages
		conn.on('data', function(data) {
			
	 		 console.log('Received', data);
		});
  
		// Send messages
		conn.send('Hello!');
	  });
	  
	 
}



  function getOtherPlayer() {
    var txt;
    var person = prompt("Your ID is:       "+peer1ID+"\n\nEnter other player's ID", peer1ID);
    if (person == null || person == "") {
        txt = "User cancelled the prompt.";
    } else {
        txt = "Hello " + person + "! How are you today?";
    }
	console.log(txt);
	return person;
}


/////Snake
var difficulty = 2;

var highscore2=0;
var score2=0;

var player1XPos = Math.floor(xcellCount/4)*1-1;
var player1YPos = Math.floor(ycellCount/2)-1;
var player2XPos = Math.floor(xcellCount/4)*3-1;
var player2YPos = Math.floor(ycellCount/2)-1;

var snake1 = new Snake(5, player1XPos, player1YPos, 1);
var snake2 = new Snake(5, player2XPos, player2YPos, 2);

function newSnake(snakeID){
	if (snakeID == 1) {
		snake1 = new Snake(5, player1XPos, player1YPos, 1);
	}
	if (snakeID == 2) {
		snake2 = new Snake(5, player2XPos, player2YPos, 2);
	}
}

function Snake(numLinks, posX, posY, snakeID){
	var segPos = 0;
	var backwardsDirection = 'none';
	this.posX = posX;
	this.posY = posY;
	this.snakeLinks = numLinks;
	this.snakeArray = new Array();
	this.deadState = 'notDead';
	this.snakeID = snakeID;

	this.update = function(){
		if(!connected2){
		if(snakeID == 1){
			backwardsDirection=basicDirection(this, direction,backwardsDirection);
		}
		if(snakeID == 2){
			backwardsDirection=basicDirection(this, direction2,backwardsDirection);
		}
		var tempObject =jumpToOtherSideOfScreen(this);
		this.posX= tempObject.posX;
		this.posY = tempObject.posY;
		

		this.snakeArray.push({x:this.posX, y:this.posY, sP:segPos});
		segPos = 0;
		for(var iter = 0; iter < this.snakeArray.length; iter++) {
			this.snakeArray[iter].sP = segPos++;
		}
		while(this.snakeArray.length > this.snakeLinks) {
			this.snakeArray.shift();
		}

		for(var iter = 0; iter < this.snakeArray.length-1; iter++) {
			if(snakeID == 1){
				if (checkdistance(this.snakeArray[iter].x, this.snakeArray[iter].y, this.posX, this.posY, 0) && direction != 'none') {
					this.deadState = 'dead';
				}
				for(var jter = 0; jter < snake2.snakeArray.length-1; jter++) {
					if (checkdistance(this.snakeArray[iter].x, this.snakeArray[iter].y, snake2.snakeArray[jter].x, snake2.snakeArray[jter].y, 0) && direction != 'none') {
						this.deadState = 'dead';
					}
				}
				
			}
			if(snakeID == 2){
				if (checkdistance(this.snakeArray[iter].x, this.snakeArray[iter].y, this.posX, this.posY, 0) && direction2 != 'none') {
					this.deadState = 'dead';
				}
				for(var jter = 0; jter < snake1.snakeArray.length-1; jter++) {
					if (checkdistance(this.snakeArray[iter].x, this.snakeArray[iter].y, snake1.snakeArray[jter].x, snake1.snakeArray[jter].y, 0) && direction2 != 'none') {
						this.deadState = 'dead';
					}
				}
			}
		}

		if (this.deadState == 'dead') {
			newSnake(this.snakeID);
		
			if(this.snakeID == 1){
				direction = 'none';
				score = 0;
			}
			if(this.snakeID == 2){
				direction2 = 'none';
				score2 = 0;
			}
			
			

			//resetFood();

			this.deadState = 'notDead';
		}
		//console.log(this.snakeArray[0].x, posX);
/////test to see if snake ran into food/////

		for(var iter=0; iter<foodArray.length; iter++){
			foodCollide=foodArray[iter].collision(this.posX,this.posY,0);

			if (foodCollide == 1) { 
				this.snakeLinks = this.snakeLinks - 1;
				if (this.snakeLinks < 2) {
					this.deadState = 'dead';
				}
				if(this.snakeID==2){
					score2--;
				}
				else {score--; }
				foodArray[iter].reset();
			}
			else if (foodCollide==2) { 
				this.snakeLinks++;
				if(this.snakeID==2){
					score2++;
				}
				else{score++;}
				foodArray[iter].reset();
			}

		}

	}
	};
	this.draw = function(){
		
		if(this.snakeID == 1) {
			for(var iter=0; iter<this.snakeArray.length; iter++){
				context.fillStyle='green';
				context.fillRect(this.snakeArray[iter].x*cellWidth, this.snakeArray[iter].y*cellHeight, cellWidth, cellHeight);
				context.strokeStyle = 'yellow';
				context.strokeRect(cellWidth*this.snakeArray[iter].x, this.snakeArray[iter].y*cellHeight, cellWidth, cellHeight)
			}
		}
		
		if(this.snakeID == 2) {
			for(var iter=0; iter<this.snakeArray.length; iter++){
				context.fillStyle='blue';
				context.fillRect(this.snakeArray[iter].x*cellWidth, this.snakeArray[iter].y*cellHeight, cellWidth, cellHeight);
				context.strokeStyle = 'yellow';
				context.strokeRect(cellWidth*this.snakeArray[iter].x, this.snakeArray[iter].y*cellHeight, cellWidth, cellHeight)
			}
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
} 


function makeWalls(){
	for(var iter = 0; iter < wallArray.length; iter++) {
		var wallid = "w"+iter;
		var wall = new Wall()
		var ThisWallSprite;

		for (var jter = 0; jter < wallArray[iter].xcellWidth; jter++) {
			for (var kter = 0; kter < wallArray[iter].ycellLength; kter++) {
				if(singlePlayerMode){
					if (checkdistance(wallArray[iter].xWall+jter, wallArray[iter].yWall+kter, snake1.posX, snake1.posY, 0)) { 	
						snake1.deadState = 'dead';
					}
				}
				
				if(multiPlayerMode){
					if (checkdistance(wallArray[iter].xWall+jter, wallArray[iter].yWall+kter, snake1.posX, snake1.posY, 0)) { 	
						snake1.deadState = 'dead';
					}
					if (checkdistance(wallArray[iter].xWall+jter, wallArray[iter].yWall+kter, snake2.posX, snake2.posY, 0)) { 	
						snake2.deadState = 'dead';
					}
				}
				
				for(var lter = 0; lter < foodArray.length; lter++) {
					if (checkdistance(wallArray[iter].xWall+jter, wallArray[iter].yWall+kter, foodArray[lter].xfood, foodArray[lter].yfood, 0)) { 	
						foodArray[lter].reset();
					}
				}
				
			}
		}

	}
}
//Wall Objects






function drawStats(){
	
		var textfont ="verdana";
		var textfillstyle = "#FFFFFF";
		var textsize = 10;
	
		var score_text = "Player1 Score: " + score ;
			//context.fillStyle="#FFFFFF";
			//context.fillText(score_text, 5, canvas.height-5);
		addText(textsize,textfont,score_text,5, canvas.height-5,textfillstyle);
	
		var highscore_text = "Player1 Highscore: " + highscore ;
			//context.fillStyle="#FFFFFF";
			//context.fillText(highscore_text, 5, canvas.height-20);
		addText(textsize,textfont,highscore_text,5, canvas.height-20,textfillstyle);

		if(multiPlayerMode){
			var score_text = "Player2 Score: " + score2 ;
			//context.fillStyle="#FFFFFF";
			//context.fillText(score_text, 5, canvas.height-5);
		addText(textsize,textfont,score_text,150, canvas.height-5,textfillstyle);
	
		var highscore_text = "Player2 Highscore: " + highscore2 ;
			//context.fillStyle="#FFFFFF";
			//context.fillText(highscore_text, 5, canvas.height-20);
		addText(textsize,textfont,highscore_text,150, canvas.height-20,textfillstyle);
		}
	
	
		var highscore_text2 = "Alltime Highscore: " + localhighscore;
			//context.fillStyle="#FFFFFF";
			//context.fillText(highscore_text2, 5, canvas.height-45);
		addText(textsize,textfont,highscore_text2,5, canvas.height-45,textfillstyle);
		
	
	}

function setDifficulty(difficulty){
	//difficulty = document.getElementById('difficulty').innerHTML;
	//console.log(difficulty);
	switch(difficulty){
		case 1:
			setGameLoopInterval(110);
			resetFood();
			snake1.deadState = "dead";
			snake2.deadState = "dead";
			break;
		case 2:
			setGameLoopInterval(80);
			resetFood();
			snake1.deadState = "dead";
			snake2.deadState = "dead";
			break;
		case 3:
			setGameLoopInterval(50);
			resetFood();
			snake1.deadState = "dead";
			snake2.deadState = "dead";
			break;
	}
}

function changeDifficulty() {
	var x = document.getElementById("difficulty").options.selectedIndex;
	setDifficulty(x);
}



/////////////////////////////////////////////////////////UPDATE + Draw

///menu stuff
var onMenu = true;
var title = 'Snake';
context.font = '48px monospace';
var titleMeasurement = context.measureText(title);
var titleXPos = (context.canvas.width - titleMeasurement.width) / 2;
var titleYPos = context.canvas.height / 2 - 30;

var text1 = 'Single Player';
context.font = '24px monospace';
var text1Measurement = context.measureText(text1);
var text1XPos = (context.canvas.width - text1Measurement.width) / 2;
var text1YPos = context.canvas.height / 2 + 30;
var highlightText1 = false;

var text2 = 'Multiplayer';
context.font = '24px monospace';
var text2Measurement = context.measureText(text2);
var text2XPos = (context.canvas.width - text2Measurement.width) / 2;
var text2YPos = context.canvas.height / 2 + 60;
var highlightText2 = false;

var singlePlayerMode = false;
var multiPlayerMode = false;


function leftmouseupSinglePlayer(e) {
	singlePlayerMode = true;
	player1XPos = Math.floor(xcellCount/2)*1-1;
	player1YPos = Math.floor(ycellCount/2)-1;

	//resets game;
	snake1.deadState = "dead";
	multiPlayerMode = false;
	menu++;
}

function leftmouseupMultiplayer(e) {
	peerID2=getOtherPlayer()
	connectToPeer2(peerID2);
	multiplayerSnakeSetup();
}

function multiplayerSnakeSetup(){
	

	multiPlayerMode = true;
	player1XPos = Math.floor(xcellCount/4)*1-1;
	player1YPos = Math.floor(ycellCount/2)-1;
	player2XPos = Math.floor(xcellCount/4)*3-1;
	player2YPos = Math.floor(ycellCount/2)-1;

	//resets game;
	snake1.deadState = "dead";
	snake2.deadState = "dead";
	singlePlayerMode = false;
	menu++;
}


function update() {
	
	if(menu == 0) {
		onMenu = true;
	} else {
		onMenu = false;
	}
	
	if(onMenu) {
		if(mouseisdown == 'yes'){
			if(checkdistance(text1XPos + text1Measurement.width / 2, 0, xcoord, 0, text1Measurement.width / 2) &&
			checkdistance(0, text1YPos - 12, 0, ycoord, 12)) {
				highlightText1 = true;
				canvas.addEventListener("mouseup",leftmouseupSinglePlayer);
			}

		}
		
		if(mouseisdown == 'yes'){
			if(checkdistance(text2XPos + text2Measurement.width / 2, 0, xcoord, 0, text2Measurement.width / 2) &&
			checkdistance(0, text2YPos - 12, 0, ycoord, 12)) {
				highlightText2 = true;
				canvas.addEventListener("mouseup",leftmouseupMultiplayer);
			}

		}
		
	}
	
	if(!onMenu){
		if(singlePlayerMode){
			canvas.removeEventListener("mouseup",leftmouseupSinglePlayer);
			snake1.update();
		}
		if(multiPlayerMode){
			canvas.removeEventListener("mouseup",leftmouseupMultiplayer);
			snake1.update();
			snake2.update();
			//snake3.update();

			

		}
		makeWalls();
		for(var iter = 0; iter < foodArray.length; iter++){
			foodArray[iter].update();
			//foodArray[iter].draw();
			
		}

		if(!connected2){
			
			if(connected1){
				
				for(var i=0; i<drawnSprites.length; i++){
					var dsArray= ["ds",drawnSprites[i].X, drawnSprites[i].Y,drawnSprites[i].image.width, drawnSprites[i].image.height, drawnSprites[i].image.src, drawnSprites[i].ID]
					conn.send(dsArray);
				}

				var sn1Array=["sn",snake1.numLinks,snake1.posX,snake1.posY,snake1.snakeID,snake1.deadState,snake1.snakeArray];
				var sn2Array=["sn",snake2.numLinks,snake2.posX,snake2.posY,snake2.snakeID,snake2.deadState,snake2.snakeArray];
					conn.send(sn1Array);
					conn.send(sn2Array);	

			}
		}

		if(connected2){
			foodArray.length=0;



		}

		//////////////////////////

		if (highscore < score) {
			highscore = score;
		}
		if(highscore2 < score2){
			highscore2= score2;
		}

		
	}
	
	checkHighscore(score);
	checkHighscore(score2);



	if(connected1|connected2){
		testSend();
	}

}


function draw() {
	canvas.width = canvas.width;
	context.fillStyle="black";
	context.fillRect(0,0,canvas.width,canvas.height);

	//testDrawnSprites();
	//testSprites();

	if(singlePlayerMode){
		snake1.draw();
	}
	if(multiPlayerMode){
		snake1.draw();
		snake2.draw();
		//snake3.draw();
	}
	
	drawSprites();

	drawStats();
	
	if(onMenu){
		context.fillStyle = 'white';
		context.font = '48px monospace';
		context.fillText(title, titleXPos, titleYPos);

		context.fillStyle = 'red';
		context.strokeStyle = 'red';
		if(highlightText1 == true) {
			context.fillStyle = '#ff9999';
			context.strokeStyle = '#ff9999';
			highlightText1 = false;
		}
		context.font = '24px monospace';
		context.fillText(text1, text1XPos, text1YPos);
		context.strokeRect(text1XPos, text1YPos, text1Measurement.width, -24);
		
		context.fillStyle = 'green';
		context.strokeStyle = 'green';
		if(highlightText2 == true) {
			context.fillStyle = '#00ff00';
			context.strokeStyle = '#00ff00';
			highlightText2 = false;
		}
		context.font = '24px monospace';
		context.fillText(text2, text2XPos, text2YPos);
		context.strokeRect(text2XPos, text2YPos, text2Measurement.width, -24);
	} 
}
