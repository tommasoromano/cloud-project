from fastapi import FastAPI
from kafka import KafkaProducer
import time

app = FastAPI()

consumer = KafkaConsumer("messages", bootstrap_servers=['kafka:9092'], group_id="my_group")

@app.on_event("startup")
async def startup_event():
    while True:
        # Produce data every 10 seconds (adjust the sleep time as needed)
        data = {"message": "Hello from producer!"}
        producer.send("my-topic", value=data)
        time.sleep(5)