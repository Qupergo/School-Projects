from world import World
import json
import cProfile

unit_testing = False

def main():

    if unit_testing:
        world = World(30, 1, 1)
        world.unit_test()
    else:
        with open("species.json", "w") as speciesFile:
            speciesFile.write("{}")
        world = World(50, 1, 1000)
        while True:
            if world.make_moves():
                continue
            else:
                generations = {}
                with open("species.json", "r") as speciesFile:
                    generations = json.load(speciesFile)
                    generations[f"generation{world.generation}"] = world.current_generation_best_move_history[f"generation{world.generation}"]

                with open("species.json", "w") as speciesFile:
                    json.dump(generations, speciesFile, indent=4)









#main()

cProfile.run("main()", sort="cumtime")

