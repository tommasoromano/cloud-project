FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt /app/
RUN apt-get update && \
 pip install --no-cache-dir -r requirements.txt
COPY ./app /app/
WORKDIR /
EXPOSE 8000

CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "8000","--reload"]