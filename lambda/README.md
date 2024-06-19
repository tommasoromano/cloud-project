```
docker build --platform linux/amd64 -t get-transactions-image:test .

docker run --platform linux/amd64 -p 9000:8080 get-transactions-image:test

curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!","queryStringParameters":{"userId":"abcd"}}'

aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 986423401370.dkr.ecr.eu-central-1.amazonaws.com

aws ecr create-repository --repository-name cloud-project --region eu-central-1 --image-scanning-configuration scanOnPush=true --image-tag-mutability MUTABLE

docker tag get-transactions-image:test 986423401370.dkr.ecr.eu-central-1.amazonaws.com/cloud-project:latest

docker push 986423401370.dkr.ecr.eu-central-1.amazonaws.com/cloud-project:latest
```

```
docker build --platform linux/amd64 -t get-transactions-image:test .

docker tag get-transactions-image:test 986423401370.dkr.ecr.eu-central-1.amazonaws.com/cloud-project:get-transactions-latest

docker push 986423401370.dkr.ecr.eu-central-1.amazonaws.com/cloud-project:get-transactions-latest
```
