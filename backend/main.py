from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uuid

from database import engine, Base, get_db
import models
import schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="QwikQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "QwikQ backend is running!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/menu", response_model=schemas.MenuItemResponse)
def create_menu_item(item: schemas.MenuItemCreate, db: Session = Depends(get_db)):
    db_item = models.MenuItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/menu", response_model=List[schemas.MenuItemResponse])
def get_menu_items(db: Session = Depends(get_db)):
    return db.query(models.MenuItem).all()

@app.post("/payment/create", response_model=schemas.PaymentResponse)
def create_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    db_payment = models.Payment(
        order_id=order_id,
        amount=payment.amount,
        payment_method=payment.payment_method,
        status="pending"
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@app.post("/payment/confirm/{order_id}", response_model=schemas.PaymentResponse)
def confirm_payment(order_id: str, db: Session = Depends(get_db)):
    db_payment = db.query(models.Payment).filter(models.Payment.order_id == order_id).first()
    if not db_payment:
        return {"error": "Payment not found"}

    db_payment.status = "success"
    db_payment.transaction_id = f"txn_{uuid.uuid4().hex[:16]}"
    db.commit()
    db.refresh(db_payment)
    return db_payment


@app.post("/orders/create", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    order_id = f"ord_{uuid.uuid4().hex[:12]}"
    db_order = models.Order(
        order_id=order_id,
        total_amount=order.total_amount,
        status="placed"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            menu_item_id=item.menu_item_id,
            item_name=item.item_name,
            quantity=item.quantity,
            price=item.price,
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders", response_model=List[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()