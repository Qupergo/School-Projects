from snake import Snake
from numpy import random
generator = random.default_rng()

class Population:
    def __init__(self, size, board_size, population=[]):
        self.board_size = board_size
        self.size = size
        self.count = 0

        self.population = [Snake(self.board_size) for i in range(size)]
        self.pop_fitness = 0
    
    def update_snakes(self):
        for snake in self.population:
            if snake.alive:
                snake.think()
                snake.move()

    def natural_selection(self):
        new_snakes = []
        
        # First child of new array is the best snake of previous generation without mutation
        best_snake = self.select_best_snake()

        # Create new snake with previous snakes brain to remove move history and such
        new_best_snake = Snake(self.board_size, best_snake.brain)

        new_snakes.append(new_best_snake)

        crossing_snakes = True

        amount_of_snakes = len(self.population)

        while crossing_snakes:
            parent1 = self.select_snake()
            parent2 = self.select_snake()

            children = parent1.crossover(parent2)
            for child in children:
                if len(new_snakes) < amount_of_snakes:
                    child.mutate()
                    new_snakes.append(child)
                else:
                    crossing_snakes = False
                    break

        self.population = new_snakes

    def calc_fitness(self):
        self.pop_fitness = 0
        for snake in self.population:
            snake.calc_fitness()
            self.pop_fitness += snake.fitness 
        
    def is_alive(self):
        for snake in self.population:
            if snake.alive:
                return True
        return False

    def select_snake(self):
        # Select a random snake from the amount of fitness from each snake
        # Since fitness is exponential it will pick the ones with higher fitness more often than not
        # Creates genetic diversity

        rand = random.randint(0, self.pop_fitness)

        running_sum = 0

        for snake in self.population:
            running_sum += snake.fitness
            if rand <= running_sum:
                return snake

    def get_random_snake(self):
        return self.population[random.randint(0, len(self.population))]

    def select_best_snake(self):
        best_snake = self.population[0]
        for snake in self.population:
            if snake.fitness > best_snake.fitness:
                best_snake = snake
        return best_snake

    def average_fitness(self):
        total = 0
        for snake in self.population:
            total += snake.fitness

        total /= len(self.population)
        return total
