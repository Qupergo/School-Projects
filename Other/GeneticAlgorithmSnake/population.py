from snake import Snake
from numpy import random


class Population:
    def __init__(self, size, population=[]):
        self.size = size
        self.count = 0

        self.population = [Snake() for i in range(size)]
    
    def update_snakes(self):
        for snake in self.population:
            if snake.alive:
                snake.think()
                snake.move()

    def natural_selection(self):
        new_snakes = []
        
        #First child of new array is the best snake of previous generation without mutation
        new_snakes.append(self.select_best_snake())

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
        for snake in self.population:
            snake.calc_fitness()
        
    def is_alive(self):
        for snake in self.population:
            if snake.alive:
                return True
        return False

    def select_snake(self):
        #Select a random snake from the amount of fitness from each snake
        #Since fitness is exponential it will pick the ones with higher fitness more often than not
        #Creates genetic diversity
        fitness_sum = sum([snake.fitness for snake in self.population])
        rand = random.randint(fitness_sum)

        running_sum = 0

        for snake in self.population:
            running_sum += snake.fitness
            if rand <= running_sum:
                return snake

    def select_best_snake(self):
        best_snake = self.population[0]
        for snake in self.population:
            if snake.fitness > best_snake.fitness:
                best_snake = snake
        print(best_snake.move_history)
        return best_snake

