from population import Population


class World():
    def __init__(self, board_size, amount_of_populations, pop_size):
        self.board_size = board_size
        self.pop_size = pop_size
        self.amount_of_populations = amount_of_populations
        self.generation = 0
        self.species = [Population(pop_size) for i in range(amount_of_populations)]
        
    def make_moves(self):
        for population in self.species:
            if population.is_alive():
                population.update_snakes()

        if not self.is_alive():
            self.generation += 1
            print(f"Current generation is: {self.generation}")
            self.genetic_algorithm()
            return False
        return True

    
    def genetic_algorithm(self):
        self.calc_fitness()

        for population in self.species:
            population.natural_selection()
    
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


    
    def calc_fitness(self):
        for population in self.species:
            population.calc_fitness()
