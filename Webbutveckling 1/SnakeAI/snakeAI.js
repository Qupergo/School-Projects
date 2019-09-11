//Genetic algorithm

let mutation_chance = 0.015

//Create initial random population

class population {
    constructor(individuals) {
        this.individuals = individuals;
    }
}

class individual {
    constructor (weights, snake) {
        this.weights = weights;
        this.snake = snake;
    }
}

//Evaluate fitness for each population

//Store best individual

//Creating mating pool

//Create next generation by applying crossover

//Reproduce and ignore few populations

//Perform mutation