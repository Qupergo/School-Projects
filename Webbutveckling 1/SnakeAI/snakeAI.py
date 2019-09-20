import asyncio
import json
import logging
import websockets
from numpy import random, exp, dot, where, concatenate, reshape
from math import sqrt
from random import randint

logging.basicConfig()

mutation_chance = 0.4

class NeuralLayer():
    def __init__(self, number_of_nodes, number_of_inputs_per_node, synaptic_weights=[]):
        self.number_of_nodes = number_of_nodes
        self.number_of_inputs_per_node = number_of_inputs_per_node
        if synaptic_weights:
            self.synaptic_weights = synaptic_weights
        else:
            self.synaptic_weights = 2 * random.random((number_of_inputs_per_node, number_of_nodes)) - 1
    

class NeuralNetwork():
    def __init__(self, layers):
        self.layers = layers
    
    async def __sigmoid(self, x):
        return 1 / (1 + exp(-x))
    
    async def think(self, inputs):
        outputs = []
        for count, layer in enumerate(self.layers):
            if count == 0:
                outputs.append(await self.__sigmoid(dot(inputs, layer.synaptic_weights)))
                continue
            outputs.append(await self.__sigmoid(dot(outputs[-1], layer.synaptic_weights)))
        return outputs
    
    async def mutate(self):
        for layer in self.layers:
            for row in layer:
                for gene in row:
                    if random.random() < mutation_chance:
                        gene = random.random() * 2 - 1

 
async def position_to_distance(snake_parts, fruit, screen_size, direction):
    
    snake_head = snake_parts[0]
    distances_to_snake_parts = await distance(snake_head, snake_parts, screen_size, direction, False)
    distances_to_fruit = await distance(snake_head, [fruit], screen_size, direction, False)
    distances_to_walls = await distance(snake_head, "Lorem ipsum dolor sit amet", screen_size, direction, True)

    return distances_to_snake_parts + distances_to_fruit + distances_to_walls


async def distance(starting_position, other_positions, screen_size, direction, wall):
    #Forward, down, left, right, diagonal_right_down, diagonal_right_up, diagonal_left_up, diagonal_right_down
    #Other positions: [[x, y], [x, y], [x, y], [x, y]] 
    #Starting position    
    #This is the default state, when snake is travelling up
    directions = ["up", "down", "left", "right", "right_down", "right_up", "left_down", "left_up"]
    temp_directions = {direction: [] for direction in directions}

    if direction == "right":
        directions = ["right", "left", "up", "down", "left_down", "right_down", "left_up", "right_up"]
    
    elif direction == "left":
        directions = ["left", "right", "up", "down", "right_up", "left_up", "right_down", "left_down"]
    
    elif direction == "down":
        directions = ["down", "up", "left", "right", "left_up", "left_down", "right_up", "right_down"]
    
    if wall:
        directions[directions.index("up")] = starting_position[1]
    
        directions[directions.index("down")] = screen_size - starting_position[1]
    
        directions[directions.index("left")] = starting_position[0]
    
        directions[directions.index("right")] = screen_size - starting_position[0]

        temp = min((screen_size - starting_position[0]), (screen_size - starting_position[1]))
        directions[directions.index("right_down")] = sqrt((temp*temp)*2)

        temp = min((screen_size - starting_position[0]), (starting_position[1]))
        directions[directions.index("right_up")] = sqrt((temp*temp)*2)

        temp = min((starting_position[0]), (screen_size - starting_position[1]))
        directions[directions.index("left_down")] = sqrt((temp*temp)*2)

        temp = min((starting_position[0]), (starting_position[1]))    
        directions[directions.index("left_up")] = sqrt((temp*temp)*2)
        
        return directions

    for other_position in other_positions:
        temp_directions["up"].append(await distance_to_object(other_position, [starting_position, [starting_position[0], 0]]))
    
        temp_directions["down"].append(await distance_to_object(other_position, [starting_position, [starting_position[0], screen_size]]))
    
        temp_directions["left"].append(await distance_to_object(other_position, [starting_position, [0, starting_position[1]]]))
    
        temp_directions["right"].append(await distance_to_object(other_position, [starting_position, [screen_size, starting_position[1]]]))
    
        temp_directions["right_down"].append(await distance_to_object(other_position, [starting_position, [screen_size, screen_size]]))
    
        temp_directions["right_up"].append(await distance_to_object(other_position, [starting_position, [screen_size, 0]]))

        temp_directions["left_down"].append(await distance_to_object(other_position, [starting_position, [0, screen_size]]))
    
        temp_directions["left_up"].append(await distance_to_object(other_position, [starting_position, [0, 0]]))

    directions[directions.index("up")] = min(temp_directions["up"])
    directions[directions.index("down")] = min(temp_directions["down"])
    directions[directions.index("left")] = min(temp_directions["left"])
    directions[directions.index("right")] = min(temp_directions["right"])
    directions[directions.index("right_down")] = min(temp_directions["right_down"])
    directions[directions.index("right_up")] = min(temp_directions["right_up"])
    directions[directions.index("left_down")] = min(temp_directions["left_down"])
    directions[directions.index("left_up")] = min(temp_directions["left_up"])
    return directions

async def distance_to_object(object_position, path):
    #Object position [x, y]
    #path [[x_start, y_start], [x_end, y_end]]
    object_position_x = object_position[0]
    object_position_y = object_position[1]
    x_start = path[0][0]
    y_start = path[0][1]
    x_end = path[1][0]
    y_end = path[1][1]

    if object_position_y == y_start and min(x_start, x_end) <= object_position[0] <= max(x_start, x_end):
        return abs(x_start - object_position_x)
    
    if object_position_x == x_start and min(y_start, y_end) <= object_position[1] <= max(y_start, y_end):
        return abs(y_start - object_position_y)
    
    distance_x = x_start - object_position_x
    distance_y = y_start - object_position_y
    if abs(distance_x) == abs(distance_y) and min(y_start, y_end) <= object_position[1] <= max(y_start, y_end) and min(x_start, x_end) <= object_position[0] <= max(x_start, x_end):
        return sqrt(distance_x*distance_x + distance_y*distance_y)

    return 0

async def crossover(snakes_index, all_neural_networks):
    #Assuming top 2 snakes are in snakes_index or they are sorted according to fitness
    parents = []
    new_neural_networks = []
    for index in snakes_index:
        parents.append(all_neural_networks[index])

    for _ in range(len(snakes_index)//2):
        child1 = NeuralNetwork([])
        child2 = NeuralNetwork([])

        for first_parent_layer, second_parent_layer in zip(parents[0].layers, parents[1].layers):
            first_flattened_weights = concatenate(first_parent_layer.synaptic_weights).tolist()
    
            second_flattened_weights = concatenate(second_parent_layer.synaptic_weights).tolist()

            cutoff_point = randint(len(first_flattened_weights)//3, len(first_flattened_weights))

            #TODO: Create another network with opposite parent genes so no genes are lost
            child1_layer = first_flattened_weights[0:cutoff_point:] + second_flattened_weights[cutoff_point::]
            child2_layer = second_flattened_weights[0:cutoff_point:] + first_flattened_weights[cutoff_point::]

            child1.layers.append(NeuralLayer(first_parent_layer.number_of_nodes, first_parent_layer.number_of_inputs_per_node, child1_layer))
            child2.layers.append(NeuralLayer(first_parent_layer.number_of_nodes, first_parent_layer.number_of_inputs_per_node, child2_layer))


        for layer in child1.layers:
            layer.synaptic_weights = reshape(layer.synaptic_weights, (layer.number_of_inputs_per_node, layer.number_of_nodes))

        for layer in child2.layers:
            layer.synaptic_weights = reshape(layer.synaptic_weights, (layer.number_of_inputs_per_node, layer.number_of_nodes))
        
        
        child1.mutate()
        child2.mutate()

        new_neural_networks.append(child1)
        new_neural_networks.append(child2)

    return new_neural_networks
    



decisions = ['up', 'down', 'left', 'right']

neural_networks = []


async def decision(websocket, path):
    async for message in websocket:
        data = json.loads(message)
        action = data['action']

        if action == 'start' or action == 'recreate_networks':
            neural_networks = []
            for _ in range(data['amount_of_snakes']):
                first_layer = NeuralLayer(16, 24)
                output_layer = NeuralLayer(4, 16)
                neural_networks.append(NeuralNetwork([first_layer, output_layer]))

        elif action == 'find_direction':
            inputs = await position_to_distance(data['snake_positions'], data['fruit_positions'], data['canvas_size'], data['direction'])
            raw_output = await neural_networks[data['snake_id']].think(inputs)
            raw_output = raw_output[-1].tolist()
            output = decisions[raw_output.index(max(raw_output))]
            snake_id = data['snake_id']
            await websocket.send(json.dumps({"direction": output, "snake_id": snake_id}))

        elif action == 'do_crossover':
            snake_id_sorted = [i['snake_id'] for i in data['snakes_sorted']]
            neural_networks = await crossover(snake_id_sorted, neural_networks)

start_server = websockets.serve(decision, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
print("Ready to go!")
asyncio.get_event_loop().run_forever()