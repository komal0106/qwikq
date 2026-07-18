from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models

# Creates the table in the database if it doesn't exist yet
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