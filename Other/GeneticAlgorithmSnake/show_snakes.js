let canvas = document.createElement("canvas");

grid_size = 10

canvas.width = 20*grid_size;
canvas.height = 20*grid_size;
let ctx = canvas.getContext("2d");

document.body.appendChild(canvas)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function draw(move_history) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < move_history.generation1.moves.length; index++) {
        
        food_pos = move_history.generation1.food_position[index];
        //Food
        ctx.beginPath();
        ctx.rect(food_pos[0]*grid_size, food_pos[1]*grid_size, grid_size, grid_size);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();

        snake_pos = move_history.generation1.moves.slice(index, index + move_history.generation1.length[index]);
        for (let index = 0; index < snake_pos.length; index++) {
            const current_pos = snake_pos[index];
            //Snake
            ctx.beginPath();
            ctx.rect(current_pos[0]*grid_size, current_pos[1]*grid_size, grid_size, grid_size);
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.closePath();
        }
        
    }
}

let websocket = new WebSocket("ws://127.0.0.1:1235/");

websocket.onopen = function(event) {
    websocket.send("Ready to recieve")
}

websocket.onmessage = function(event) {
    data = JSON.parse(event.data);
    setInterval(draw(data), 50);
}
