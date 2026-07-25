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

class PaymentCreate(BaseModel):
    amount: float
    payment_method: str

class PaymentResponse(BaseModel):
    id: int
    order_id: str
    amount: float
    payment_method: str
    status: str
    transaction_id: str | None = None

    class Config:
        from_attributes = True


class OrderItemCreate(BaseModel):
    menu_item_id: int
    item_name: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    total_amount: float
    items: list[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: int
    item_name: str
    quantity: int
    price: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_id: str
    total_amount: float
    status: str
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str