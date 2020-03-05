from numpy import random


class Food():
    def __init__(self, board_size):
        self.board_size = board_size
        self.pos_x = random.randint(0, self.board_size)
        self.pos_y = random.randint(0, self.board_size)
    
    def respawn(self):
        self.pos_x = random.randint(0, self.board_size)
        self.pos_y = random.randint(0, self.board_size)