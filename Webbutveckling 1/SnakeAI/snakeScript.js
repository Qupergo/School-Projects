let canvas = document.createElement("canvas");
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");

class Snake {
    constructor(canvas, ctx, parts, fruit_x, fruit_y, fruit_taken, dx, dy, snake_color, fruit_color, direction, score, time_out=0, alive=true) {
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
size = 25
canvas.width = size*grid_size
canvas.height = size*grid_size

let dx = grid_size;
let dy = 0;
let direction = "up";

let starting_pos = Math.floor(size/2) * grid_size;
snake_amount = 16;

snake_starting_positions = [[starting_pos, starting_pos],
                            [starting_pos, starting_pos + grid_size],
                            [starting_pos, starting_pos + grid_size*2],
                            [starting_pos, starting_pos + grid_size*3],
                            [starting_pos, starting_pos + grid_size*4],
                            [starting_pos, starting_pos + grid_size*5]]

snakes = [new Snake(canvas, ctx, snake_starting_positions, getRndInteger((canvas.width-grid_size)/grid_size, 0)*grid_size, getRndInteger(0, (canvas.height-grid_size)/grid_size)*grid_size, false,
    0,
    -grid_size,
    "#0095DD",
    "crimson",
    direction,
    0
)];
for (let index = 0; index < snake_amount-1; index++) {
    let current_canvas = document.createElement('canvas');
    current_canvas.width = size*grid_size;
    current_canvas.height = size*grid_size;
    snakes.push(new Snake(current_canvas, current_canvas.getContext('2d'), [
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
        0
    ));
    document.body.appendChild(current_canvas);
}

document.addEventListener("keypress", function onEvent(event) {
    if (event.key === "a") {
        direction = "left";
    }
    else if (event.key === "d") {
        direction = "right";
    }
    else if (event.key === "w") {
        direction = "up";
    }
    else if (event.key === "s") {
        direction = "down";
    }
});

function draw() {
    for (let index = 0; index < snakes.length; index++) {
        individuals = population.individuals;

        current_snake = snakes[index];

        current_snake.direction = individuals[index].determine_direction()

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
            current_snake.alive = false;
        }
        current_snake.ctx.font = "15px Arial";
        current_snake.ctx.fillText("Score: " + current_snake.score, 10, 20);
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

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function sigmoid(x) {
	return 1 / (1 + Math.exp(-x));
}

function dot_product(vector_x, vector_y) {
    let weighted_sum = 0;
    for (let index = 0; index < vector_x.length; index++) {
        weighted_sum += vector_x[index] * vector_y[index];
    }
    return weighted_sum;
}

//Genetic algorithm

let mutation_chance = 0.015

//Create initial random population

class population {
    constructor(individuals) {
        this.individuals = individuals;
    }
}

class individual {
    constructor (genes, snake, fitness) {
        this.genes = genes;
        this.snake = snake;
        this.fitness = {return: this.snake.score};
    }
    
    determine_direction() {

        //Input layer
        let head = this.snake.parts[0];
        let head_x = head[0]/grid_size;
        let head_y = head[1]/grid_size;
        let fruit_x = this.snake.fruit_x/grid_size;
        let fruit_y = this.snake.fruit_y/grid_size;
        let inputs = [head_x, head_y, fruit_x, fruit_y];

        //Calculation
        let output_nodes = [0, 0, 0, 0]
        let weighted_sums = []

        for (let i = 0; i < 4*4; i++) {
            if (i < 4) {
                weighted_sums.push(head_x*this.genes[i]);
            }
            else if (i < 8) {
                weighted_sums.push(head_y*this.genes[i]);
            }
            else if (i < 12) {
                weighted_sums.push(fruit_x*this.genes[i]);
            }
            else if (i < 16) {
                weighted_sums.push(fruit_y*this.genes[i]);
            }
        }

        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                //Add weighted sum to output node
                output_nodes[j] += weighted_sums[k*(j+1)]
            }
        }

        for (let m = 0; m < output_nodes.length; m++) {
            output_nodes[m] = sigmoid(output_nodes[m]);
        }

        //Output
        let outputs = ["up", "down", "left", "right"]
        let output = outputs[indexOfMax(output_nodes)];
        return output;
    }
}

population = new population([])

for (let index = 0; index < snakes.length; index++) {
    const snake = snakes[index];
    let genes = []
    //Outputs * Inputs
    for (let i = 0; i < 4*4; i++) {
        genes.push(Math.random());
    }
    population.individuals.push(new individual(genes, snake))
}

//Evaluate fitness for each population

for (let index = 0; index < population.individuals.length; index++) {
    const current_snake = population.individuals[index];
}

//Store best individual

//Creating mating pool

//Create next generation by applying crossover

//Reproduce and ignore few populations

//Perform mutation


setInterval(draw, 50);