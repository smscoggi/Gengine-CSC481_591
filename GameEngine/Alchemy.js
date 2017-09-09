setInterval(game_loop, 30);

canvas.addEventListener("mousedown",mousedown);

addSprite("https://i.imgur.com/KKigDQ5.jpg", 1);
addSprite("https://i.imgur.com/sPl17tf.jpg", 2);
addSprite("https://i.imgur.com/tSfVTJ1.jpg", 3);
addSprite("http://i.imgur.com/CuQvdVG.png", 4);
addDrawnSprite(sprites[0])
addDrawnSprite(sprites[1])


function mousedown(e){
    selectedImage = e.clientX + " " + e.clientY;

    for (var iter = 0; iter < sprites.length; iter++) {
        if (checkSprite(sprites[iter], e.clientX, e.clientY)) {
            selectedImage = iter;
           // dragging = true;
            canvas.addEventListener("mousemove",mousemove);
            canvas.addEventListener("mouseup",mouseup);
            break;
        } else {
            selectedImage = -1;
        }
    }
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function mousemove(e){
		dragging = true;
    var pos = getMousePos(canvas, e);
    dragX = pos.x;
    dragY = pos.y ;
}

function mouseup(e){
		var collisonArray = new Array();
    collisonArray = checkCollide();
    if (collided) {
    	mix(collisonArray);
    }
    dragging = false;
    canvas.removeEventListener("mousemove",mousemove);
    canvas.removeEventListener("mouseup",mouseup);
}
