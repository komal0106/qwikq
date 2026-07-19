from pydantic import BaseModel
from typing import Optional

class MenuItemCreate(BaseModel):
    name: str
    category: str
    price: float
    image: Optional[str] = None

class MenuItemResponse(BaseModel):
    id: int
    name: str
    category: str
    price: float
    image: Optional[str] = None

    class Config:
        from_attributes = True