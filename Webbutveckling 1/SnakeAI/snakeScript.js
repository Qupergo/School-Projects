


class Snake_Colony {
    constructor (snake_amount) {
        this.snake_amount = snake_amount;
        this.snakes = [];
    }
    reset_scores() {
        for (let index = 0; index < this.snakes.length; index++) {
            this.snakes[index].score = 0;
        }      
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

    revive() {
        for (let i = 0; i < this.snakes.length; i++) {
            if (this.snakes[i].alive == false) {
                this.snakes[i].alive = true;
                this.snakes[i].snake_color = getRandomColor();
                this.snakes[i].fruit_color = getRandomColor();
                this.snakes[i].time_out = 0;
                document.body.appendChild(this.snakes.canvas)
            }
        }
    }

    create() {
        this.snakes = []
        for (let index = 0; index < this.snake_amount; index++) {

            //let current_canvas = document.createElement('canvas');
            //current_canvas.width = canvas_width;
            //current_canvas.height = canvas_height;

            //document.body.appendChild(current_canvas);
            let snake = new Snake();
            snake.canvas = canvas;
            snake.ctx = ctx;
            snake.parts = [
                [starting_pos, starting_pos],
                [starting_pos, starting_pos + grid_size],
                [starting_pos, starting_pos + grid_size*2],
                [starting_pos, starting_pos + grid_size*3],
                [starting_pos, starting_pos + grid_size*4],
                [starting_pos, starting_pos + grid_size*5]
                ];
            snake.fruit_x = getRndInteger((canvas_width-grid_size)/grid_size, 0)*grid_size;
            snake.fruit_y = getRndInteger(0, (canvas_height-grid_size)/grid_size)*grid_size;
            snake.fruit_taken = false;
            snake.dx = 0;
            snake.dy = -grid_size;
            let color = getRandomColor()
            snake.snake_color = color;
            snake.fruit_color = color;
            snake.direction = direction;
            snake.score = 0;
            snake.snake_id = index;
            snake.time_out = 0;
            snake.alive = true;
            snake.living_time = 0;
            snake.fitness = 0;
            this.snakes.push(snake)
        }
    }

}

class Snake {
    constructor(canvas, ctx, parts, fruit_x, fruit_y, fruit_taken, dx, dy, snake_color, fruit_color, direction, score, snake_id, time_out=0, alive=true, living_time=0, fitness=0) {
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
        this.living_time = living_time;
        this.fitness = fitness
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

                    if (snakePart[0] >= canvas_width) {
                        this.alive = false;
                        //document.body.removeChild(current_snake.canvas);
                        current_snake.canvas = false;
                    }
                    else if(snakePart[0] <= 0-grid_size) {
                        this.alive = false;
                        //document.body.removeChild(current_snake.canvas);
                        current_snake.canvas = false;
                    }
                    else if(snakePart[1] >= canvas_height) {
                        this.alive = false;
                        //document.body.removeChild(current_snake.canvas);
                        current_snake.canvas = false;
                    }
                    else if(snakePart[1] <= 0-grid_size) {
                        this.alive = false;
                        //document.body.removeChild(current_snake.canvas);
                        current_snake.canvas = false;
                    }

                    if (snakePart[0] === this.fruit_x && snakePart[1] === this.fruit_y)
                    {
                        this.fruit_taken = true
                        this.parts.push([-grid_size, -grid_size])
                    }
        
                    for (let j = 1; j < this.parts.length; j++) {
                        if (snakePart[0] === this.parts[j][0] && snakePart[1] === this.parts[j][1]) {
                            this.alive = false;
                            //document.body.removeChild(current_snake.canvas);
                            current_snake.canvas = false;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < snake_amount; index++) {

        current_snake = snake_colony.snakes[index];
        if (current_snake.alive) {

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

            current_snake.draw();

            if (current_snake.fruit_taken) {
                current_snake.fruit_x = getRndInteger((current_snake.canvas.width-grid_size)/grid_size, 0)*grid_size;
                current_snake.fruit_y = getRndInteger(0, (current_snake.canvas.height-grid_size)/grid_size)*grid_size;
                current_snake.fruit_taken = false;
                current_snake.score += 1;
                current_snake.time_out = 0;
            }

            current_snake.time_out += 1;
            current_snake.living_time += 1;
            if (current_snake.time_out >= 225 && current_snake.canvas !== false) {
                current_snake.alive = false;
                //document.body.removeChild(current_snake.canvas)
                current_snake.canvas = false;
            }
            current_snake.ctx.font = "15px Arial";
            current_snake.ctx.fillText("Score: " + current_snake.score, 10, 20);

            websocket.send(JSON.stringify({action: 'find_direction', snake_positions: current_snake.parts, fruit_positions: [current_snake.fruit_x, current_snake.fruit_y], snake_id: current_snake.snake_id, canvas_size: canvas_height, direction: current_snake.direction}))

            if (snake_colony.are_alive() == false && document.getElementById("auto_crossover").checked == true) {
                do_crossover();
            }

        }

        else if (current_snake.canvas !== false) {
            //document.body.removeChild(current_snake.canvas);
            current_snake.canvas = false;
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
}

websocket.onopen = function(event) {
    websocket.send(JSON.stringify({action: 'start', amount_of_snakes: snake_amount}))
}

function recreate_networks() {
    websocket.send(JSON.stringify({action: 'recreate_networks', amount_of_snakes: snake_amount}))
    snake_colony.create();
}


function compare_fitness(snake1, snake2) {
    snake1.fitness = Math.floor(snake1.living_time + snake1.living_time * Math.pow(2, (Math.floor(snake1.score))));
    snake2.fitness =  Math.floor(snake2.living_time + snake2.living_time * Math.pow(2, (Math.floor(snake2.score))));
    return snake2.fitness - snake1.fitness;
}

function do_crossover() {
    snake_colony.snakes.sort(compare_fitness)
    let snake_ids = [];
    console.log(snake_colony.snakes[0].fitness)

    let not_useless = false;
    for (let index = 0; index < snake_colony.snakes.length; index++) {
        snake_ids.push(snake_colony.snakes[index].snake_id);
        if (snake_colony.snakes[index].fitness > 0.3 && snake_colony.snakes[index].fitness !== 1) {
            not_useless = true;
        }
    }
    if (not_useless) {
        websocket.send(JSON.stringify({action: 'do_crossover', snakes_sorted: snake_colony.snakes}))
        snake_colony.create();
    }
    else {
        recreate_networks();
    }
}

snake_amount = 40;
grid_size = 10;
size = 60;
direction = "up";
canvas_width = size*grid_size;
canvas_height = size*grid_size;

let dx = grid_size;
let dy = 0;

let canvas = document.createElement('canvas');
canvas.width = canvas_width;
canvas.height = canvas_height;
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

let starting_pos = Math.floor(size/2) * grid_size;
snake_colony = new Snake_Colony(snake_amount);
snake_colony.create();

setInterval(draw, 50);