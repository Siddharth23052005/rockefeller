import asyncio
from collections import defaultdict
from typing import Dict, Set

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self._connections: Dict[str, Set[WebSocket]] = defaultdict(set)
        self._lock = asyncio.Lock()

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._connections[user_id].add(websocket)

    async def disconnect(self, user_id: str, websocket: WebSocket) -> None:
        async with self._lock:
            sockets = self._connections.get(user_id)
            if not sockets:
                return
            sockets.discard(websocket)
            if not sockets:
                self._connections.pop(user_id, None)

    async def send_to_user(self, user_id: str, payload: dict) -> None:
        async with self._lock:
            sockets = list(self._connections.get(user_id, set()))

        for socket in sockets:
            try:
                await socket.send_json(payload)
            except Exception:
                await self.disconnect(user_id, socket)


ws_manager = ConnectionManager()
