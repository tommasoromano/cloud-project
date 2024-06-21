
echo ">>>>>>>> Logging in to ECR"

aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 986423401370.dkr.ecr.eu-central-1.amazonaws.com

folders=$(ls -d */)

for folder in $folders
do
    cd $folder

    folder=${folder%/}
    folder=$(echo $folder | sed 's/\([A-Z]\)/-\1/g')
    folder=${folder:1}
    folder=$(echo $folder | tr '[:upper:]' '[:lower:]')

    echo ">>>>>>>> Building $folder"

    docker build --platform linux/amd64 -t $folder-image:test .

    # if error, exit
    if [ $? -ne 0 ]; then
        echo "Error building $folder"
        exit 1
    fi

    echo ">>>>>>>>> Tagging $folder"

    docker tag $folder-image:test 986423401370.dkr.ecr.eu-central-1.amazonaws.com/cloud-project:$folder-latest

    # if error, exit
    if [ $? -ne 0 ]; then
        echo "Error tagging $folder"
        exit 1
    fi

    echo ">>>>>>>> Pushing $folder"

    docker push 986423401370.dkr.ecr.eu-central-1.amazonaws.com/cloud-project:$folder-latest

    # if error, exit
    if [ $? -ne 0 ]; then
        echo "Error pushing $folder"
        exit 1
    fi

    cd ..
done