import json
from aiokafka import AIOKafkaProducer
import asyncio
from kafka import KafkaProducer
from confluent_kafka import Producer
import logging

def kafka_send(topic, data, bootstrap_servers='kafka:29092'):
    try:
        producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers, 
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
        producer.send(topic, data)
        producer.flush()
        return True
    except Exception as e:
        print('Error while sending message:',e)
        return False