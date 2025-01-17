from abc import ABC, abstractmethod
from typing import Any, Dict, List

class BaseStorage(ABC):
    """Base class for all storage implementations"""
    @abstractmethod
    def store(self, data: Any) -> bool:
        pass

    @abstractmethod
    def retrieve(self, identifier: str) -> Any:
        pass
