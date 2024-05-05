from fastapi import FastAPI
from kafka import KafkaProducer
import time

app = FastAPI()

producer = KafkaProducer(bootstrap_servers=['kafka:9092'])

@app.on_event("startup")
async def startup_event():
    while True:
        # Produce data every 10 seconds (adjust the sleep time as needed)
        data = {"message": "Hello from producer!"}
        producer.send("messages", value=data)
        time.sleep(5)