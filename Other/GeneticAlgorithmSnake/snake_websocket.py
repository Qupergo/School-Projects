import websockets
import logging
import asyncio
import json


logging.basicConfig()

async def draw(websocket, path):
    async for message in websocket:
        print("Script started")
        with open("species.json", "r") as speciesFile:
            await websocket.send(json.load(speciesFile))


start_server = websockets.serve(draw, "localhost", 1235)

asyncio.get_event_loop().run_until_complete(start_server)
print("Ready to go!")
asyncio.get_event_loop().run_forever()