from sqlalchemy import Column, Integer, String, Float
from database import Base
from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    image = Column(String, nullable=True)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, unique=True, index=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(String, nullable=False)
    status = Column(String, default="pending")
    transaction_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)