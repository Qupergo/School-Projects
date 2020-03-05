import numpy as np
import time

cols = 0

globalMoveRate = 0.0000001
elasticity = 1

class Simulation():
    def __init__(self, objects, moveRate, elasticity):
        self.objects = objects
        self.velocities = np.array([i.vel for i in objects])
        self.positions = np.array([i.pos for i in objects])
        self.radie = np.array([i.radius for i in objects])
        self.moveRate = moveRate
        self.elasticity = elasticity

    def move(self):
        for obj in self.objects:
            obj.move(self.moveRate)

    def __len__(self):
        return len(self.objects)

    def __iter__(self):
        for obj in self.objects:
            yield obj

    

class Object():
    def __init__(self, mass, start_vel, start_pos, radius, wall=False):
        self.mass = mass
        self.start_vel = start_vel
        self.start_pos = start_pos

        self.vel = start_vel
        self.pos = start_pos
        self.radius = radius

        self.wall = wall

    def has_collided(self, other):
        return abs(self.pos - other.pos) < (self.radius + other.radius)

    def momentum(self):
        return self.vel * self.mass

    def move(self, globalMoveRate):
        self.pos += self.vel*globalMoveRate

    def collide(self, other, elasticity):
        global cols
        if other.wall:
            self.vel = -self.vel
            cols += 1
            return

        old_vel = self.vel
        
        self.vel = (self.mass*old_vel + other.mass*other.vel - other.mass*elasticity*(self.vel - other.vel) )/(self.mass + other.mass)
        
        other.vel = elasticity*(old_vel - other.vel) + self.vel

        cols += 1

def display(simulation):
    x_size = 50
    alphabet = "abcdefghijklmnopqrstuvxyz"
    for x in range(x_size):
        print("|", end="")

        for count, obj in enumerate(simulation.objects):
            if int(obj.pos//1) == x:
                print(alphabet[count], end="")
        else:
            print(" ", end="")

    print()
                

def model(globalMoveRate, elasticity):
    global cols
    left_wall = Object(1, 0, 0, 1, wall=True)
    
    a = Object(1, 0, 2, 1)
    b = Object(1_000_000_000_000, -1, 10, 1)
    c = Object(1, 1, 20, 1)
    
    right_wall = Object(1, 0, 50, 1, wall=True)

    sim = Simulation([a, b, left_wall], globalMoveRate, elasticity)
    ite = 0
    
    while True:
        sim.move()
        objects_left = sim.objects.copy()
        while len(objects_left) > 1:
            cur_obj = objects_left[0]

            for other in objects_left[1:]:

                if cur_obj.has_collided(other):
                    cur_obj.collide(other, elasticity)

            objects_left.pop(0)
        
        if ite % (int(1/globalMoveRate)) == 0:
            print("Has collided " + str(cols) + " Times")
            display(sim)
        ite += 1

if __name__ == '__main__':
    model(globalMoveRate, elasticity)
