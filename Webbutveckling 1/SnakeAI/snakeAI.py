import asyncio
import json
import logging
import websockets
from numpy import random, exp, dot, where
from math import sqrt

logging.basicConfig()

STATE = {"value": 0}

USERS = set()

class NeuralLayer():
    def __init__(self, number_of_nodes, number_of_inputs_per_node):
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


    
async def position_to_distance(snake_parts, fruit):        
    #Implement later
    #distances_to_walls = []
    
    snake_head = snake_parts[0]
    distances_to_snake_parts = await distance(snake_head, snake_parts)
    distances_to_fruit = await distance(snake_head, [fruit])

    return distances_to_snake_parts + distances_to_fruit


async def distance(starting_position, other_positions):
    #Up, down, left, right, diagonal_right_down, diagonal_right_up, diagonal_left_up, diagonal_right_down
    distances = 8 * [0]
    for other_position in other_positions:
        distance = starting_position[0] - other_position[0], starting_position[1] - other_position[1]
        if distance[0] == 0 and distance[1] > 0:
            #Up
            distances[0] = distance[1]
        if distance[0] == 0 and distance[1] < 0:
            #Down
            distances[1] = distance[1]
        if distance[0] > 0 and distance[1] == 0:
            #Left
            distances[2] = distance[0]
        if distance[0] < 0 and distance[1] == 0:
            #Right
            distances[3] = distance[0]
        if abs(distance[0]) == abs(distance[1]):
            if distance[0] > 0 and distance[1] > 0:
                #Diagonal_right_down
                distances[4] = sqrt(distance[0]*distance[0] + distance[1]*distance[1])
            if distance[0] > 0 and distance[1] < 0:
                #Diagonal_right_up
                distances[5] = sqrt(distance[0]*distance[0] + distance[1]*distance[1])
            if distance[0] < 0 and distance[1] < 0:
                #Diagonal_left_up
                distances[6] = sqrt(distance[0]*distance[0] + distance[1]*distance[1])
            if distance[0] < 0 and distance[1] > 0:
                #Diagonal_left_down
                distances[7] = sqrt(distance[0]*distance[0] + distance[1]*distance[1])
        return distances

async def crossover(snakes_index, genes):
    pass





decisions = ['up', 'down', 'left', 'right']

neural_networks = []

async def decision(websocket, path):
    async for message in websocket:
        data = json.loads(message)
        action = data['action']

        if action == 'start' or action == 'recreate_networks':
            neural_networks = []
            for _ in range(data['amount_of_snakes']):
                first_layer = NeuralLayer(50, 16)
                output_layer = NeuralLayer(4, 50)
                neural_networks.append(NeuralNetwork([first_layer, output_layer]))

        elif action == 'find_direction':
            inputs = await position_to_distance(data['snake_positions'], data['fruit_positions'])
            raw_output = await neural_networks[data['snake_id']].think(inputs)
            raw_output = raw_output[-1].tolist()
            output = decisions[raw_output.index(max(raw_output))]
            snake_id = data['snake_id']
            await websocket.send(json.dumps({"direction": output, "snake_id": snake_id}))

        elif action == 'do_crossover':
            crossover(data['id_of_fittest_snakes'], neural_networks)

#Script is 1 move behind in replying this may need a fix

#Genetic algorithm

#Store best individual

#Creating mating pool

#Create next generation by applying crossover

#Reproduce and ignore few populations

#Perform mutation

start_server = websockets.serve(decision, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
print("Ready to go!")
asyncio.get_event_loop().run_forever()