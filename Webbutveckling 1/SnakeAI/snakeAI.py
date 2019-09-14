import asyncio
import json
import logging
import websockets
from numpy import random, exp, dot, where

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



first_layer = NeuralLayer(5, 4)
second_layer = NeuralLayer(5, 5)
output_layer = NeuralLayer(4, 5)
neural_network = NeuralNetwork([first_layer, second_layer, output_layer])

decisions = ['up', 'down', 'left', 'right']

#Don't forget to add new neural_network for each snake connected to their ID (which is also their index if it matters don't think it will)
#All snakes have to have their own neural network for decisions
#Also change input data to distance away from in some way, maybe same method as code bullet maybe just the exact distance away in all cardinal directions I really have no clue
async def decision(websocket, path):
    async for message in websocket:
        data = json.loads(message)
        raw_output = await neural_network.think(data['positions'])
        raw_output = raw_output[-1].tolist()
        output = decisions[raw_output.index(max(raw_output))]

        snake_id = data['snake_id']
        await websocket.send(json.dumps({"direction": output, "snake_id": snake_id}))

start_server = websockets.serve(decision, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
print("Ready to go!")
asyncio.get_event_loop().run_forever()