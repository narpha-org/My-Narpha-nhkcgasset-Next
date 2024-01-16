#!/bin/zsh

GIT_COMMIT_ID=$(git log --format="%H" -n 1)
docker build -t nhkcgasset-next:"${GIT_COMMIT_ID}" -f Dockerfile.prod .
