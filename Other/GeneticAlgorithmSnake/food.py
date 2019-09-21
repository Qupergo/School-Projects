from numpy import random


class Food():
    def __init__(self):
        self.pos_x = random.randint(0, 50)
        self.pos_y = random.randint(0, 50)
    
    def respawn(self):
        self.pos_x = random.randint(0, 50)
        self.pos_y = random.randint(0, 50)