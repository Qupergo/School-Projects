import websockets
import asyncio
import json

async def draw(websocket, path):
    async for message in websocket:
        data = json.loads(message)

start_server = websockets.serve(draw, "localhost", 6789)

asyncio.get_event_loop().run_until_complete(start_server)
print("Ready to go!")
asyncio.get_event_loop().run_forever()