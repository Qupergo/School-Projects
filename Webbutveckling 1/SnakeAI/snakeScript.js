let canvas = document.createElement("canvas");
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");

class Snake_Colony {
    constructor (snakes) {
        this.snakes = snakes;
    }

    are_alive() {
        let amount_of_snakes = this.snakes.length;
        let dead_snakes = 0;
        for (let index = 0; index < amount_of_snakes; index++) {
            if (this.snakes[index].alive == false) {
                dead_snakes++;
            }
            if (dead_snakes === amount_of_snakes) {
                return false;
            }
        }
        return true;
    }

}

class Snake {
    constructor(canvas, ctx, parts, fruit_x, fruit_y, fruit_taken, dx, dy, snake_color, fruit_color, direction, score, snake_id, time_out=0, alive=true) {
        this.canvas = canvas
        this.ctx = ctx
        this.parts = parts;
        this.fruit_x = fruit_x;
        this.fruit_y = fruit_y;
        this.fruit_taken = fruit_taken;
        this.dx = dx;
        this.dy = dy;
        this.snake_color = snake_color;
        this.fruit_color = fruit_color;
        this.direction = direction;
        this.score = score;
        this.snake_id = snake_id;
        this.time_out = time_out;
        this.alive = alive;
    }

    draw() {
        if (this.alive == true)
        {
            this.ctx.beginPath();
            for (let index = this.parts.length-1; index >= 0; index--) {
                let snakePart = this.parts[index];
                if (index === 0) {
                    snakePart[0] += this.dx;
                    snakePart[1] += this.dy;
                    this.ctx.rect(snakePart[0], snakePart[1], grid_size, grid_size);

                    if (snakePart[0] >= canvas.width) {
                        snakePart[0] = 0;
                    }
                    else if(snakePart[0] <= 0-grid_size) {
                        snakePart[0] = canvas.width;
                    }
                    else if(snakePart[1] >= canvas.height) {
                        snakePart[1] = 0;
                    }
                    else if(snakePart[1] <= 0-grid_size) {
                        snakePart[1] = canvas.height;
                    }

                    if (snakePart[0] === this.fruit_x && snakePart[1] === this.fruit_y)
                    {
                        this.fruit_taken = true
                        this.parts.push([-grid_size, -grid_size])
                    }
        
                    for (let j = 1; j < this.parts.length; j++) {
                        if (snakePart[0] === this.parts[j][0] && snakePart[1] === this.parts[j][1]) {
                            this.alive = false;
                        }
                    }

                    break;
                }
                snakePart[0] = this.parts[index - 1][0];
                snakePart[1] = this.parts[index - 1][1];
                
                this.ctx.rect(snakePart[0], snakePart[1], grid_size, grid_size);
            }
            this.ctx.fillStyle = this.snake_color;
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.beginPath();
            this.ctx.rect(this.fruit_x, this.fruit_y, grid_size, grid_size);
            this.ctx.fillStyle = this.fruit_color;
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
}

grid_size = 15
size = 30
canvas.width = size*grid_size
canvas.height = size*grid_size

let dx = grid_size;
let dy = 0;
let direction = "up";

let starting_pos = Math.floor(size/2) * grid_size;
snake_amount = 16;

snake_starting_positions = [
                            [starting_pos, starting_pos],
                            [starting_pos, starting_pos + grid_size],
                            [starting_pos, starting_pos + grid_size*2],
                            [starting_pos, starting_pos + grid_size*3],
                            [starting_pos, starting_pos + grid_size*4],
                            [starting_pos, starting_pos + grid_size*5]
                            ]

snake_colony = new Snake_Colony([])

snake_colony.snakes = [new Snake(canvas, ctx, snake_starting_positions, getRndInteger((canvas.width-grid_size)/grid_size, 0)*grid_size, getRndInteger(0, (canvas.height-grid_size)/grid_size)*grid_size, false,
    0,
    -grid_size,
    "#0095DD",
    "crimson",
    direction,
    0,
    0
)];

for (let index = 1; index < snake_amount; index++) {
    let current_canvas = document.createElement('canvas');
    current_canvas.width = size*grid_size;
    current_canvas.height = size*grid_size;
    snake_colony.snakes.push(new Snake(current_canvas, current_canvas.getContext('2d'), [
        [starting_pos, starting_pos],
        [starting_pos, starting_pos + grid_size],
        [starting_pos, starting_pos + grid_size*2],
        [starting_pos, starting_pos + grid_size*3],
        [starting_pos, starting_pos + grid_size*4],
        [starting_pos, starting_pos + grid_size*5]
        ],
        getRndInteger((canvas.width-grid_size)/grid_size, 0)*grid_size, 
        getRndInteger(0, (canvas.height-grid_size)/grid_size)*grid_size,
        false,
        0,
        -grid_size,
        getRandomColor(),
        getRandomColor(),
        direction,
        0,
        index
    ));
    document.body.appendChild(current_canvas);
}

document.addEventListener("keypress", function onEvent(event) {
    if (event.key === "a") {
        snake_colony.snakes[0].direction = "left";
    }
    else if (event.key === "d") {
        snake_colony.snakes[0].direction = "right";
    }
    else if (event.key === "w") {
        snake_colony.snakes[0].direction = "up";
    }
    else if (event.key === "s") {
        snake_colony.snakes[0].direction = "down";
    }
});

function draw() {
    
    for (let index = 0; index < snake_amount; index++) {

        current_snake = snake_colony.snakes[index];
        if (index != 0) {
            
            websocket.send(JSON.stringify({action: 'find_direction', snake_positions: current_snake.parts, fruit_positions: [current_snake.fruit_x, current_snake.fruit_y], snake_id: current_snake.snake_id}))
        }
        if (current_snake.dx !== grid_size && current_snake.direction == "left") {
            current_snake.dx = -grid_size
            current_snake.dy = 0
        }
        
        if (current_snake.dx !== -grid_size && current_snake.direction == "right") {
            current_snake.dx = grid_size
            current_snake.dy = 0
        }
    
        if (current_snake.dy !== grid_size && current_snake.direction == "up") {
            current_snake.dy = -grid_size
            current_snake.dx = 0
        }
    
        if (current_snake.dy !== -grid_size && current_snake.direction == "down") {
            current_snake.dy = grid_size
            current_snake.dx = 0
        }

        current_snake.ctx.clearRect(0, 0, canvas.width, canvas.height);

        current_snake.draw();

        if (current_snake.fruit_taken) {
            current_snake.fruit_x = getRndInteger((canvas.width-grid_size)/grid_size, 0)*grid_size;
            current_snake.fruit_y = getRndInteger(0, (canvas.height-grid_size)/grid_size)*grid_size;
            current_snake.fruit_taken = false;
            current_snake.score += 1;
            current_snake.time_out = 0;
        }

        current_snake.time_out += 1;
        if (current_snake.time_out >= 200) {
            //current_snake.alive = false;
        }
        current_snake.ctx.font = "15px Arial";
        current_snake.ctx.fillText("Score: " + current_snake.score, 10, 20);

        if (snake_colony.are_alive()) {
            //Snakes are alive
        }
    }
}





function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}




let websocket = new WebSocket("ws://127.0.0.1:6789/");
websocket.onmessage = function(event) {
    data = JSON.parse(event.data)
    //data[0] is the snake id, data[1] is the direction
    snake_colony.snakes[data.snake_id].direction = data.direction;
    console.log(data)
}

websocket.onopen = function(event) {
    websocket.send(JSON.stringify({action: 'start', amount_of_snakes: snake_amount}))
}

function recreate_networks() {
    websocket.send(JSON.stringify({action: 'recreate_networks', amount_of_snakes: snake_amount}))
}

function compare_fitness(snake1, snake2) {
    fitness1 = snake1.score;
    fitness2 = snake2.score;
    return fitness2 - fitness1;
}

function do_crossover() {
    snake_colony.snakes.sort(compare_fitness)
    websocket.send(JSON.stringify({action: 'do_crossover', snakes_sorted: snake_colony.snakes}))
}
setInterval(draw, 50);