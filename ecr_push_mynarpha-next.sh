#!/bin/zsh

GIT_COMMIT_ID=$(git log --format="%H" -n 1)
aws ecr get-login-password --region ap-northeast-1 --profile AWS_Narpha_Terraform | docker login --username AWS --password-stdin 735641424488.dkr.ecr.ap-northeast-1.amazonaws.com
docker build -t mynarpha-next:"${GIT_COMMIT_ID}" -f Dockerfile.prod .
docker tag mynarpha-next:"${GIT_COMMIT_ID}" 735641424488.dkr.ecr.ap-northeast-1.amazonaws.com/mynarpha-next:"${GIT_COMMIT_ID}"
docker push 735641424488.dkr.ecr.ap-northeast-1.amazonaws.com/mynarpha-next:"${GIT_COMMIT_ID}"
