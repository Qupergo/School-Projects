import asyncio
import json
import logging
import websockets
from numpy import random, exp, dot, where, concatenate, reshape
from math import sqrt
from random import randint

logging.basicConfig()

mutation_chance = 0.5

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

#Change fitness so it promotes staying alive in the first few seconds but later makes it more important to collect fruit
#This will make it learn to survive quicker


    
async def position_to_distance(snake_parts, fruit, screen_size):
    
    walls = [[screen_size, screen_size], [screen_size, 0], [0, screen_size], [0, 0]]
    snake_head = snake_parts[0]
    distances_to_snake_parts = await distance(snake_head, snake_parts, False)
    distances_to_fruit = await distance(snake_head, [fruit], False)
    distances_to_walls = await distance(snake_head, walls, True)

    return distances_to_snake_parts + distances_to_fruit + distances_to_walls


async def distance(starting_position, other_positions, wall):
    #Up, down, left, right, diagonal_right_down, diagonal_right_up, diagonal_left_up, diagonal_right_down
    distances = 8 * [0]
    for other_position in other_positions:
        distance = starting_position[0] - other_position[0], starting_position[1] - other_position[1]
        if distance[0] == 0 and distance[1] > 0 or wall:
            #Up
            distances[0] = distance[1]
        if distance[0] == 0 and distance[1] < 0 or wall:
            #Down
            distances[1] = distance[1]
        if distance[0] > 0 and distance[1] == 0 or wall:
            #Left
            distances[2] = distance[0]
        if distance[0] < 0 and distance[1] == 0 or wall:
            #Right
            distances[3] = distance[0]
        if abs(distance[0]) == abs(distance[1]) or wall:
            if distance[0] > 0 and distance[1] > 0 or wall:
                #Diagonal_right_down
                distances[4] = sqrt(distance[0]*distance[0] + distance[1]*distance[1])
            if distance[0] > 0 and distance[1] < 0 or wall:
                #Diagonal_right_up
                distances[5] = sqrt(distance[0]*distance[0] + distance[1]*distance[1])
            if distance[0] < 0 and distance[1] < 0 or wall:
                #Diagonal_left_up
                distances[6] = sqrt(distance[0]*distance[0] + distance[1]*distance[1])
            if distance[0] < 0 and distance[1] > 0 or wall:
                #Diagonal_left_down
                distances[7] = sqrt(distance[0]*distance[0] + distance[1]*distance[1])
        return distances

async def crossover(snakes_index, all_neural_networks):
    #Assuming top 2 snakes are in snakes_index or they are sorted according to fitness
    parents = []
    new_neural_networks = []
    for index in snakes_index:
        parents.append(all_neural_networks[index])

    for _ in range(len(snakes_index)):
        new_neural_network = NeuralNetwork([])

        for first_parent_layer, second_parent_layer in zip(parents[0].layers, parents[1].layers):
            first_flattened_weights = concatenate(first_parent_layer.synaptic_weights).tolist()
            
            second_flattened_weights = concatenate(second_parent_layer.synaptic_weights).tolist()

            cutoff_point = randint(1, len(first_flattened_weights))

            layer = first_flattened_weights[0:cutoff_point:] + second_flattened_weights[cutoff_point::]
            for gene in layer:
                if random.random() < mutation_chance:
                    gene = 2 * random.random() - 1

            new_neural_network.layers.append(NeuralLayer(first_parent_layer.number_of_nodes, first_parent_layer.number_of_inputs_per_node, layer))


        for layer in new_neural_network.layers:
            layer.synaptic_weights = reshape(layer.synaptic_weights, (layer.number_of_inputs_per_node, layer.number_of_nodes))
        
        new_neural_networks.append(new_neural_network)
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
                first_layer = NeuralLayer(50, 24)
                output_layer = NeuralLayer(4, 50)
                neural_networks.append(NeuralNetwork([first_layer, output_layer]))

        elif action == 'find_direction':
            inputs = await position_to_distance(data['snake_positions'], data['fruit_positions'], data['canvas_size'])
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