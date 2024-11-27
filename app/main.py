from pathlib import Path
from typing import Annotated

from fastapi import Cookie, Depends, FastAPI, Request, WebSocket, WebSocketDisconnect, WebSocketException, status
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .manager import ConnectionManager

ROOT = Path(__file__).parent

app = FastAPI()

app.mount("/static", StaticFiles(directory=ROOT / "static"))

templates = Jinja2Templates(directory=ROOT / "templates")


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


manager = ConnectionManager()


def get_username(username: Annotated[str | None, Cookie()] = None):
    if not username:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
    return username


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, username: Annotated[str, Depends(get_username)]):
    await manager.connect(websocket)
    await manager.broadcast_text(f"User {username} joined the chat")
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast_text(f"User {username} sent: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast_text(f"User {username} left the chat")
