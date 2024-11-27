from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from .manager import ConnectionManager

app = FastAPI()
manager = ConnectionManager()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast_text(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
