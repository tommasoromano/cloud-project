from fastapi import FastAPI
import time
from app.lib.brokers.producer import kafka_send
from random import randint


app = FastAPI()

@app.on_event("startup")
async def startup_event():
    print("Starting up...")
    hello_world = {'message': 'Hello World!'}
    sent = kafka_send('messages', hello_world)
    while not sent:
        sent = kafka_send('messages', hello_world)
        time.sleep(1)
    print("System is ready")

    while True:
        data = {'value': randint(0, 100)}
        sent = kafka_send('messages', data)
        time.sleep(1)