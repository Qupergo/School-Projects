from world import World
import json
import cProfile

unit_testing = False

def main():

    if unit_testing:
        world = World(30, 1, 1)
        world.unit_test()
    else:
        world = World(50, 1, 500)
        while True:
            if world.make_moves():
                continue
            else:
                current_generation = {f"generation{world.generation}": [best_snake.move_history for best_snake in world.best_snakes()]}
                with open("species.json", "w") as speciesFile:
                    json.dump(current_generation, speciesFile, indent=4)









main()

#cProfile.run("main()", sort="cumtime")

