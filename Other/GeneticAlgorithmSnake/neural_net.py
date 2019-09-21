from numpy import exp, random, dot, concatenate, reshape

globalMutationChance = 0.01

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
    
    def __sigmoid(self, x):
        return 1 / (1 + exp(-x))
    
    def think(self, inputs):
        outputs = []
        for count, layer in enumerate(self.layers):
            if count == 0:
                outputs.append(await self.__sigmoid(dot(inputs, layer.synaptic_weights)))
                continue
            outputs.append(await self.__sigmoid(dot(outputs[-1], layer.synaptic_weights)))
        return outputs[-1]        

    def mutate(self):
        for layer in self.layers:
            for row in layer:
                for gene in row:
                    if random.random < globalMutationChance:
                        gene = (random.random() * 1000 - 1)
    
    def crossover(self, other_network):
        children_networks = [NeuralNetwork([]), NeuralNetwork([])]
        for layer1, layer2 in zip(self.layers, other_network.layers):
            #Flatten netowrks
            flattened_weights1 = concatenate(layer1.synaptic_weights)
            flattened_weights2 = concatenate(layer2.synaptic_weights)

            #Pick a random point on the networks
            cutoff_point = random.randint(len(flattened_weights1))

            #Create 2 children so all genes are passed down
            new_weights1 = concatenate([flattened_weights1[0:cutoff_point:], flattened_weights2[cutoff_point::]])
            new_weights2 = concatenate([flattened_weights2[0:cutoff_point:], flattened_weights1[cutoff_point::]])

            new_layer1 = NeuralLayer(layer1.number_of_nodes, layer1.number_of_inputs_per_node, new_weights1)
            new_layer2 = NeuralLayer(layer1.number_of_nodes, layer1.number_of_inputs_per_node, new_weights2)


            children_networks[0].layers.append(new_layer1)
            children_networks[1].layers.append(new_layer2)
        
        for child_network in children_networks:
            for layer in child_network.layers:
                layer.synaptic_weights = reshape(layer, (layer.number_of_inputs_per_node, layer.number_of_nodes))
        
        return children_networks