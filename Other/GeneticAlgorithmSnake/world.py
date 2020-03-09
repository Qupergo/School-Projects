from population import Population
import numpy as np
import time

timeout = 0
ranIntoSelf = 0
wallCrash = 0
snakesOverLength7 = 0

class World():
    def __init__(self, board_size, population_amount, pop_size):
        self.board_size = board_size
        self.pop_size = pop_size
        self.population_amount = population_amount
        self.generation = 0

        self.current_generation_best_move_history = {}

        self.species = [Population(pop_size, board_size) for i in range(population_amount)]

    def unit_test(self):
        # Pick a test snake
        test_snake = self.species[0].get_random_snake()

        # First test if snake.look() works
        while True:
            test_snake.think()

            print("Snake is going to move " + test_snake.direction)
            test_snake.direction = input("Direction: ").lower()
            
            test_snake.move()

            

            look_output = test_snake.look()

            print("When the snake looked, it returned")
            print(look_output.reshape(3, 8))

            print(test_snake.food.pos_x)
            print(test_snake.food.pos_y)

            # Add head to tail for printing purposes
            print(test_snake.tail)
            print(f"Head position is {test_snake.pos_x}, {test_snake.pos_y}")


            self.display_board(test_snake.tail, [test_snake.pos_x, test_snake.pos_y], [test_snake.food.pos_x, test_snake.food.pos_y])
        
        # Make sure mutation works
        old = np.copy(test_snake.brain.layers[0].synaptic_weights)
        test_snake.brain.mutate()
        new = np.copy(test_snake.brain.layers[0].synaptic_weights)

        difference = np.sum(old - new)
        if abs(difference) > 0:
            print("Mutation works!")
        



    def display_board(self, snake_tail, snake_head, food_pos):
        print(snake_head)
        print(snake_tail)
        for y in range(self.board_size):
            for x in range(self.board_size):
                if snake_head[0] == x and snake_head[1] == y:
                    print("[H]",end="")

                elif [x, y] in snake_tail:
                    print("[o]",end="")

                elif food_pos[0] == x and food_pos[1] == y:
                    print("[x]",end="")
                
                else:
                    print("[ ]",end="")

            print()

    def make_moves(self):
        global ranIntoSelf
        global wallCrash
        global timeout
        for population in self.species:
            if population.is_alive():
                population.update_snakes()

        if not self.is_alive():

            self.generation += 1

            self.current_generation_best_move_history = {f"generation{self.generation}":  [{"Snake #" + str(count+1):snake.move_history} for count, snake in enumerate(self.best_snakes())]}

            print("Ran into self: " + str(ranIntoSelf))
            print("Wall Crashes: " + str(wallCrash))
            print("Timeout: " + str(timeout))

            ranIntoSelf = 0
            wallCrash = 0
            timeout = 0

            print(f"\n\nCurrent generation is: {self.generation}")

            self.calc_fitness()
            
            print("The average fitness is: " + str(self.average_fitness()))

            
            best_snake = self.select_best_snake()
            print()
            print("The best fitness is: " + str(best_snake.fitness))
            print()
            print("The best snake survived " + str(best_snake.lifetime) + " cycles")
            print("And collected " + str(best_snake.length - 5) + " food")
            print("Death Cause: " + best_snake.death_cause)

            self.genetic_algorithm()

            # Display the best snake
            show_snake = True
            if show_snake and self.generation % 10 == 0:
                moves = best_snake.move_history["moves"]
                food_positions = best_snake.move_history["food_position"]
                length = best_snake.move_history["length"]
                print(len(moves))
                print(len(food_positions))
                print(len(length))
                # Start with displaying the snake at start position
                current_snake = []
                for i in range(length[0]):
                    current_snake.append(moves[i])
                
                current_position = length[0] - 1

                self.display_board(current_snake[:-1], current_snake[-1], food_positions[current_position])

                old_length = length[current_position]

                for move in moves[length[0]:]:
                    print(move)
                    current_snake.append(move)

                    # If the snake has not grown
                    if length[current_position] == old_length:
                        # Remove end of tail
                        current_snake.pop(0)


                    old_length = length[current_position]
                    self.display_board(current_snake, current_snake[-1], food_positions[current_position])
                    current_position += 1

                    time.sleep(0.1)
            return False
        return True

    
    def genetic_algorithm(self):
        self.calc_fitness()

        for population in self.species:
            population.natural_selection()
    

    def average_fitness(self):
        total = 0
        for pop in self.species:
            total += pop.average_fitness()

        average = total / len(self.species)
        return average

    def is_alive(self):
        for population in self.species:
            if population.is_alive():
                return True
        return False
    
    def best_snakes(self):
        best_snakes = []
        for population in self.species:
            best_snakes.append(population.select_best_snake())
        return best_snakes
    
    def select_best_snake(self):
        best_snakes = self.best_snakes()

        # Choose one at random
        best_snake = best_snakes[0]

        # Determine winner
        for snake in best_snakes:
            if snake.fitness > best_snake.fitness:
                best_snake = snake
        return best_snake

    
    def calc_fitness(self):
        for population in self.species:
            population.calc_fitness()

    def all_snakes(self, sort=True):

        snakes = []
        for pop in self.species:
            snakes += pop.population
            
        if sort:
            snakes.sort(key=lambda x:x.fitness, reverse=True)
        return snakes