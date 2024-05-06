import json
import asyncio
from aiokafka import AIOKafkaConsumer

async def kafka_consume(topic, callback=None, group_id="group0", bootstrap_servers='kafka:29092'):
    while True:
        try:
            consumer = AIOKafkaConsumer(
                topic,
                bootstrap_servers=bootstrap_servers,
                group_id=group_id)
            await consumer.start()
            async for msg in consumer:
                print("consumed: ", msg.topic, msg.partition, msg.offset,
                      msg.key, msg.value, msg.timestamp)
                if callback:
                    callback(msg)
        except Exception as e:
            print('Error while consuming message:', e)
        finally:
            await consumer.stop()