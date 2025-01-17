#!/usr/bin/env bash

source ./.env

docker build --no-cache -t krinkin/$PROJECT.$SERVICE_NAME:$BRANCH .