from world import World
import json

def main():
    world = World(20, 5, 2)
    while True:
        if world.make_moves():
            continue
        else:
            current_generation = {f"generation{world.generation}": [best_snake.move_history for best_snake in world.best_snakes()]}
            with open("species.json", "w") as speciesFile:
                json.dump(current_generation, speciesFile)
            break

main()