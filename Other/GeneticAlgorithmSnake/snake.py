from food import Food
from neural_net import NeuralNetwork, NeuralLayer
from math import sqrt
from numpy import concatenate
import math


class Snake():
    def __init__(self, brain=NeuralNetwork([NeuralLayer(20, 24), NeuralLayer(4, 20)])):
        self.brain = brain
        self.direction = "up"

        self.screen_size = 20
        self.pos_x = self.screen_size//2
        self.pos_y = self.screen_size//2
        self.alive = True
        self.length = 5
        self.food = Food()
        self.lifetime = 0
        self.fitness = 0
        self.tail = [
            [self.pos_x, self.pos_y + 1],
            [self.pos_x, self.pos_y + 2],
            [self.pos_x, self.pos_y + 3],
            [self.pos_x, self.pos_y + 4]
            ]
        self.vector = []
        self.left_to_live = 100
        #Make moves equal tail and then append current head position to it
        self.move_history = {"moves":self.tail + [self.pos_x, self.pos_y], "food_position":[], "length":[]}

    
    def think(self):
        outputs = self.brain.think(self.look()).tolist()
        self.direction = ["up", "down", "left", "right"][outputs.index(max(outputs))]

    def move(self):
        #vector = [delta_x, delta_y]
        self.lifetime += 1
        self.left_to_live -= 1

        if self.left_to_live <= 0:
            self.alive = False

        if self.direction == "up":
            self.vector = [0, -1]

        elif self.direction == "down":
            self.vector = [0, 1]
        
        elif self.direction == "left":
            self.vector = [-1, 0]
        
        elif self.direction == "right":
            self.vector = [1, 0]

        if self.pos_x == self.food.pos_x and self.pos_y == self.food.pos_y:
            self.eat()

        if [self.pos_x, self.pos_y] in self.tail:
            self.alive = False
        
        if self.pos_x >= self.screen_size or self.pos_y >= self.screen_size or self.pos_x < 0 or self.pos_y < 0:
            self.alive = False
        
        #Add new neck
        self.tail.insert(0, [self.pos_x, self.pos_y])

        #Remove last tail part
        self.tail.pop()


        self.pos_x += self.vector[0]
        self.pos_y += self.vector[1]
        self.move_history["moves"].append([self.pos_x, self.pos_y])
        self.move_history["food_position"].append([self.food.pos_x, self.food.pos_y])
        self.move_history["length"].append(self.length)

    def eat(self):
        self.length += 1
        if self.length > 6:
            print(f"Length of a snake is {self.length}")
        
        #Append tail so this part is removed instead of actual tail
        self.tail.append([-1,-1])

        self.left_to_live = 100

        self.food.respawn()
    
    def calc_fitness(self):
        self.fitness = math.floor(self.lifetime * self.lifetime * math.floor(self.length)**2)
        
    def look(self):
        starting_position = [self.pos_x, self.pos_y]

        distances = []
        for i in range(3):
            directions = ["up", "down", "left", "right", "right_down", "right_up", "left_down", "left_up"]
            temp_directions = {direction: [] for direction in directions}

            if self.direction == "right":
                directions = ["right", "left", "up", "down", "left_down", "right_down", "left_up", "right_up"]
            
            elif self.direction == "left":
                directions = ["left", "right", "up", "down", "right_up", "left_up", "right_down", "left_down"]
            
            elif self.direction == "down":
                directions = ["down", "up", "left", "right", "left_up", "left_down", "right_up", "right_down"]

            if i == 0:
                directions[directions.index("up")] = starting_position[1]
            
                directions[directions.index("down")] = self.screen_size - starting_position[1]
            
                directions[directions.index("left")] = starting_position[0]
            
                directions[directions.index("right")] = self.screen_size - starting_position[0]

                temp = min((self.screen_size - starting_position[0]), (self.screen_size - starting_position[1]))
                directions[directions.index("right_down")] = sqrt((temp*temp)*2)

                temp = min((self.screen_size - starting_position[0]), (starting_position[1]))
                directions[directions.index("right_up")] = sqrt((temp*temp)*2)

                temp = min((starting_position[0]), (self.screen_size - starting_position[1]))
                directions[directions.index("left_down")] = sqrt((temp*temp)*2)

                temp = min((starting_position[0]), (starting_position[1]))    
                directions[directions.index("left_up")] = sqrt((temp*temp)*2)

                distances.append(directions)
                        
            if i == 1 or i == 2:
                if i == 1:
                    #Make a 2D list for the for loop
                    other_positions = [[self.food.pos_x, self.food.pos_y]]
            
                elif i == 2:
                    other_positions = self.tail

                for other_position in other_positions:
                    temp_directions["up"].append(distance_to_object(other_position, [starting_position, [starting_position[0], 0]]))
                
                    temp_directions["down"].append(distance_to_object(other_position, [starting_position, [starting_position[0], self.screen_size]]))
                
                    temp_directions["left"].append(distance_to_object(other_position, [starting_position, [0, starting_position[1]]]))
                
                    temp_directions["right"].append(distance_to_object(other_position, [starting_position, [self.screen_size, starting_position[1]]]))
                
                    temp_directions["right_down"].append(distance_to_object(other_position, [starting_position, [self.screen_size, self.screen_size]]))
                
                    temp_directions["right_up"].append(distance_to_object(other_position, [starting_position, [self.screen_size, 0]]))

                    temp_directions["left_down"].append(distance_to_object(other_position, [starting_position, [0, self.screen_size]]))
                
                    temp_directions["left_up"].append(distance_to_object(other_position, [starting_position, [0, 0]]))
                directions[directions.index("up")] = min(temp_directions["up"])
                directions[directions.index("down")] = min(temp_directions["down"])
                directions[directions.index("left")] = min(temp_directions["left"])
                directions[directions.index("right")] = min(temp_directions["right"])
                directions[directions.index("right_down")] = min(temp_directions["right_down"])
                directions[directions.index("right_up")] = min(temp_directions["right_up"])
                directions[directions.index("left_down")] = min(temp_directions["left_down"])
                directions[directions.index("left_up")] = min(temp_directions["left_up"])

                distances.append(directions)
        return concatenate(distances)

    def mutate(self):
        self.brain.mutate()
    
    def crossover(self, other_parent):
        children_brains = self.brain.crossover(other_parent.brain)
        children = []
        
        for child_brain in children_brains:
            children.append(Snake(child_brain))
        
        return children

def distance_to_object(object_position, path):
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

