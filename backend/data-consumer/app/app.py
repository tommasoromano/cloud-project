from fastapi import FastAPI
import time
from app.lib.brokers.producer import kafka_send
from app.lib.brokers.consumer import kafka_consume
from random import randint
import asyncio


app = FastAPI()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(kafka_consume('messages'))