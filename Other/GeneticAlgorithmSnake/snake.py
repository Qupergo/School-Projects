from food import Food
from neural_net import NeuralNetwork, NeuralLayer
from math import sqrt
import numpy as np
import math

import world

class Snake():
    def __init__(self, board_size, brain=None):
        if brain == None:
            self.brain = NeuralNetwork([NeuralLayer(16, 24), NeuralLayer(4, 16)])
        else:
            self.brain = brain
        self.direction = "up"



        # TODO: Grow the snake by this value each time it picks up food
        self.growcountDefault = 3
        self.growcount = self.growcountDefault

        self.death_cause = "None"

        self.board_size = board_size
        self.pos_x = self.board_size//2
        self.pos_y = self.board_size//2

        self.alive = True

        self.length = 5
        self.food = Food(self.board_size)

        self.lifetime = 0
        self.fitness = 0

        self.tail = [
            [self.pos_x, self.pos_y - 4],
            [self.pos_x, self.pos_y - 3],
            [self.pos_x, self.pos_y - 2],
            [self.pos_x, self.pos_y - 1]
            ]

        self.vector = []

        self.left_to_live_start = 200
        self.left_to_live = self.left_to_live_start

        #Make moves equal tail and then append current head position to it
        self.parts = [
            [self.pos_x, self.pos_y - 4],
            [self.pos_x, self.pos_y - 3],
            [self.pos_x, self.pos_y - 2],
            [self.pos_x, self.pos_y - 1],
            [self.pos_x, self.pos_y]
            ]

        # Add food positions and lengths for each move
        self.move_history = {"fitness":self.fitness, "moves":self.parts, "food_position":[[self.food.pos_x, self.food.pos_y] for i in range(len(self.parts))], "length":[self.length for i in range(len(self.parts))] }

    
    def think(self):
        outputs = self.brain.think(self.look()).flatten().tolist()
        self.direction = ["up", "down", "left", "right"][outputs.index(max(outputs))]

    def move(self):
        #vector = [delta_x, delta_y]
        self.lifetime += 1
        
        self.left_to_live -= 1

        if self.left_to_live <= 0:
            self.alive = False
            self.death_cause = "timeout"
            world.timeout += 1

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
            while([self.food.pos_x, self.food.pos_y] in self.tail):
                self.food.respawn()

        if [self.pos_x, self.pos_y] in self.tail:
            self.alive = False
            self.death_cause = "ranIntoSelf"
            world.ranIntoSelf += 1

        if self.pos_x >= self.board_size or self.pos_y >= self.board_size or self.pos_x < 0 or self.pos_y < 0:
            self.alive = False
            self.death_cause = "wallCrash"
            world.wallCrash += 1

        if self.alive:
            #Add new part
            self.tail.insert(0, [self.pos_x, self.pos_y])

            #Remove last tail part
            self.tail.pop()

            # Add fitness when moving toward food and remove when moving away
            # if abs(self.pos_x + self.vector[0] - self.food.pos_x) < abs(self.pos_x - self.food.pos_x) or abs(self.pos_y + self.vector[1] - self.food.pos_y) < abs(self.pos_y - self.food.pos_y):
            #     self.fitness += 1
            # else:
            #     self.fitness -= 1.5



            self.pos_x += self.vector[0]
            self.pos_y += self.vector[1]

            self.move_history["moves"].append([self.pos_x, self.pos_y])
            self.move_history["food_position"].append([self.food.pos_x, self.food.pos_y])
            self.move_history["length"].append(self.length)



    def eat(self):
        self.length += 1
        #Append tail so this part is removed instead of actual tail
        self.tail.append([-1,-1])

        self.left_to_live = self.left_to_live_start

        self.food.respawn()
    
    def calc_fitness(self):
        self.fitness = math.floor(self.lifetime * self.lifetime * 3**math.floor(self.length))
        self.move_history["fitness"] = self.fitness
        
        return self.fitness

        
    def look(self):
        base_value = 99999

        distances = [
            [base_value, base_value, base_value, base_value, base_value, base_value, base_value, base_value],
            [base_value, base_value, base_value, base_value, base_value, base_value, base_value, base_value],
            [base_value, base_value, base_value, base_value, base_value, base_value, base_value, base_value]
        ]


        ###### DEPRECATED ######### Wall and Tail combined into one
        # Check distance to the walls
        # These are the first 8 distances

        # UP
        # Top wall position is 0, so the y postion should be the distance
        #distances[0][0] = self.pos_y

        # DOWN
        # Bottom wall position is the board size, so the distance should be board size - current position
        #distances[0][1] = self.board_size - self.pos_y

        # LEFT
        # Left wall is 0, so the x postion should be the distance
        #distances[0][2] = self.pos_x

        # RIGHT
        # Right wall is board size, so the distance should be board size - current position
        #distances[0][3] = self.board_size - self.pos_x
        ###### DEPRECATED #########

        # DOWN-LEFT
        #TEST, SHOW DIRECTION OF FOOD

        # self.x < food_x = food is to the right
        # self.x > food_x = food is left
        # self.y < food_y = food is below
        # self.y > food_y = food is above
        if self.pos_x < self.food.pos_x and self.pos_y < self.food.pos_y:
            distances[0] = [2 for i in range(len(distances[0]))]

        if self.pos_x > self.food.pos_x and self.pos_y < self.food.pos_y:
            distances[0] = [4 for i in range(len(distances[0]))]

        if self.pos_x < self.food.pos_x and self.pos_y > self.food.pos_y:
            distances[0] = [8 for i in range(len(distances[0]))]

        if self.pos_x > self.food.pos_x and self.pos_y > self.food.pos_y:
            distances[0] = [10 for i in range(len(distances[0]))]
        # DOWN-RIGHT

        # UP-LEFT

        # UP-RIGHT


        # Check distance to an obstacle (Wall and Tail)
        # These are the second 8 distances

        # UP
        # Find the closest distance of the parts that is above the current y position and is on the same x pos
        distances[1][0] = min([self.pos_y - part[1] for part in self.tail if self.pos_y > part[1] and self.pos_x == part[0]] + [base_value])

        # Wall
        distances[1][0] = min(self.pos_y, distances[1][0])

        # DOWN
        # Find the closest part that is below the current y position and is on the same x pos

        distances[1][1] = min([part[1] - self.pos_y for part in self.tail if self.pos_y < part[1] and self.pos_x == part[0]] + [base_value])
         # Wall
        distances[1][1] = min(self.board_size - self.pos_y, distances[1][1])


        # LEFT
        # Find the closest part that is to the left of the current x pos and on the same y pos

        distances[1][2] = min([self.pos_x - part[0] for part in self.tail if self.pos_x > part[0] and self.pos_y == part[1]] + [base_value])
        # Wall
        distances[1][2] = min(self.pos_x, distances[1][2])

        # RIGHT
        # Find the closest part that is to the right of the current x pos and on the same y pos

        distances[1][3] = min([part[0] - self.pos_x for part in self.tail if self.pos_x < part[0] and self.pos_y == part[1]] + [base_value])
        # Wall
        distances[1][3] = min(self.board_size - self.pos_x, distances[1][3])



        # Diagonals
        if (any([abs(part[0] - self.pos_x) == abs(part[1] - self.pos_y) for part in self.tail])):
            # DOWN-LEFT
            distances[1][4] = min([(abs(part[0] - self.pos_x) + abs(part[1] - self.pos_y)) if part[0] > self.pos_x and part[1] < self.pos_y else base_value for part in self.tail])

            # DOWN-RIGHT
            distances[1][5] = min([(abs(part[0] - self.pos_x) + abs(part[1] - self.pos_y)) if part[0] > self.pos_x and part[1] > self.pos_y else base_value for part in self.tail])

            # UP-LEFT
            distances[1][6] = min([(abs(part[0] - self.pos_x) + abs(part[1] - self.pos_y)) if part[0] < self.pos_x and part[1] < self.pos_y else base_value for part in self.tail])

            # UP-RIGHT
            distances[1][7] = min([(abs(part[0] - self.pos_x) + abs(part[1] - self.pos_y)) if part[0] < self.pos_x and part[1] > self.pos_y else base_value for part in self.tail])


        # Check distances to food
        # These are the third 8 distances

        # UP
        # Check if the food is at the same x then if it is upwards then assign the distance otherwise assign the base value
        distances[2][0] = (self.pos_y - self.food.pos_y) if self.food.pos_x == self.pos_x and self.pos_y > self.food.pos_y else base_value 

        # DOWN
        # Check if the food is at the same x then if it is downards the assign the distance otherwise assign the base value
        distances[2][1] = (self.food.pos_y - self.pos_y) if self.food.pos_x == self.pos_x and self.pos_y < self.food.pos_y else base_value

        # LEFT
        # Check if the food is at the same y then if it is to the left assign the distance otherwise assign the base value
        distances[2][2] = (self.pos_x - self.food.pos_x) if self.food.pos_y == self.pos_y and self.pos_x > self.food.pos_x else base_value

        # RIGHT
        # Check if the food is at the same y then if it is to the right assign the distance otherwise assign the base value
        distances[2][3] = ( self.food.pos_x - self.pos_x) if self.food.pos_y == self.pos_y and self.pos_x < self.food.pos_x else base_value
        
        if abs(self.food.pos_x - self.pos_x) == abs(self.food.pos_y - self.pos_y):
        
            # DOWN-LEFT
            if (self.food.pos_x > self.pos_x and self.food.pos_y < self.pos_y):
                distances[2][4] = abs(self.food.pos_x - self.pos_x) + abs(self.food.pos_y - self.pos_y)

            # DOWN-RIGHT
            if (self.food.pos_x > self.pos_x and self.food.pos_y > self.pos_y):
                distances[2][5] = abs(self.food.pos_x - self.pos_x) + abs(self.food.pos_y - self.pos_y)

            # UP-LEFT
            if (self.food.pos_x < self.pos_x and self.food.pos_y < self.pos_y):
                distances[2][6] = abs(self.food.pos_x - self.pos_x) + abs(self.food.pos_y - self.pos_y)

            # UP-RIGHT
            if (self.food.pos_x < self.pos_x and self.food.pos_y > self.pos_y):
                distances[2][7] = abs(self.food.pos_x - self.pos_x) + abs(self.food.pos_y - self.pos_y)


        # Distances is 3x8 dimensional matrix
        # Make it into a column vector instead
        distances = np.array(distances).reshape(1, -1) 

        assert(distances.shape == (1, 24))

        return distances

    def mutate(self):
        self.brain.mutate()
    
    def crossover(self, other_parent):

        # Create 2 children
        children_brains = self.brain.crossover(other_parent.brain)
        children = []
        
        for child_brain in children_brains:
            children.append(Snake(self.board_size, child_brain))
        
        return children
