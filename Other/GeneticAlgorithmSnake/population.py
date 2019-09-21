from snake import Snake
from numpy import random


class Population:
    def __init__(self, size, population=[]):
        self.size = size
        self.population = population

        self.snakes = [Snake() for i in range(size)]
    
    def natural_selection(self):
        new_snakes = []
        
        #First child of new array is the best snake of previous generation without mutation
        new_snakes[0] = self.select_best_snake()

        amount_of_snakes = len(self.snakes)
        while True:

            parent1 = self.select_snake()
            parent2 = self.select_snake()

            children = parent1.crossover(parent2)

            for child in children:
                if len(new_snakes) < amount_of_snakes:
                    child.mutate()
                    new_snakes.append(child)
                else:
                    break
        self.snakes = new_snakes


    def calc_fitness(self):
        for snake in self.snakes:
            snake.calc_fitness()
    


    def select_snake(self):
        #Select a random snake from the amount of fitness from each snake
        #Since fitness is exponential it will pick the ones with higher fitness more often than not
        #Creates genetic diversity
        fitness_sum = sum([snake.fitness for snake in self.snakes])

        rand = random.randint(fitness_sum)

        running_sum = 0

        for snake in self.snakes:
            running_sum += snake.fitness
            if rand <= running_sum:
                return snake
    
    def select_best_snake(self):
        return self.snakes.sort(lambda x: x.fitness)[0]
