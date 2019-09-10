let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");



grid_size = 8

canvas.width = 50*grid_size
canvas.height = 50*grid_size

let dx = grid_size;
let dy = 0;

let snake = [
    [0,0],
    [0,grid_size],
    [0,grid_size*2],
    [0,grid_size*3],
    [0,grid_size*4],
    [0,grid_size*5]
]

let fruit_taken = false;
let fruit_x = getRndInteger((canvas.width-grid_size)/grid_size, 0)*grid_size;
let fruit_y = getRndInteger(0, (canvas.height-grid_size)/grid_size)*grid_size;

document.addEventListener("keypress", function onEvent(event) {
    if (event.key === "a") {
        dx = -grid_size
        dy = 0
    }
    else if (event.key === "d") {
        dx = grid_size
        dy = 0
    }
    else if (event.key === "w") {
        dy = -grid_size
        dx = 0
    }
    else if (event.key === "s") {
        dy = grid_size
        dx = 0
    }
});

function drawSnake() {
    ctx.beginPath();

    for (let index = snake.length-1; index >= 0; index--) {
        let snakePart = snake[index];
        
        if (index === 0) {
            snakePart[0] += dx;
            snakePart[1] += dy;
            ctx.rect(snakePart[0], snakePart[1], grid_size, grid_size);

            if (snakePart[0] === fruit_x && snakePart[1] === fruit_y)
            {
                fruit_taken = true
                snake.push([-grid_size, -grid_size])
            }

            for (let j = 1; j < snake.length; j++) {
                if (snakePart[0] === snake[j][0] && snakePart[1] === snake[j][1]) {
                    document.location.reload();
                }
            }

            if (snakePart[0] === canvas.width) {
                snakePart[0] = 0;
            }
            else if(snakePart[0] === 0-grid_size) {
                snakePart[0] = canvas.width;
            }
            else if(snakePart[1] === canvas.height) {
                snakePart[1] = 0;
            }
            else if(snakePart[1] === 0-grid_size) {
                snakePart[1] = canvas.height;
            }

            break;
        }
        snakePart[0] = snake[index - 1][0];
        snakePart[1] = snake[index - 1][1];
        
        ctx.rect(snakePart[0], snakePart[1], grid_size, grid_size);
    }
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawFruit() {
    ctx.beginPath();

    ctx.rect(fruit_x, fruit_y, grid_size, grid_size)
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFruit();
    console.log(fruit_taken)
    if (fruit_taken) {
        fruit_x = getRndInteger((canvas.width-grid_size)/grid_size, 0)*grid_size;
        fruit_y = getRndInteger(0, (canvas.height-grid_size)/grid_size)*grid_size;
        fruit_taken = false;
    }
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

setInterval(draw, 50);