from dataclasses import dataclass
from typing import Iterator, Dict, Any

@dataclass
class Frame:
    """Represents a single frame from camera feed"""
    frame_id: str
    timestamp: float
    data: bytes
    metadata: Dict[str, Any]

class CameraFeed:
    """Handles individual camera feed input"""
    def __init__(self, camera_id: str, config: Dict[str, Any]):
        self.camera_id = camera_id
        self.config = config

    def get_frames(self) -> Iterator[Frame]:
        """Yields frames from the camera"""
        pass  # Implementation placeholder
