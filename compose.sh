#!/bin/sh

cp .env.production ./server/.env.production
cp .env.production ./client/.env.production

docker-compose build --no-cache
docker-compose up -d

rm ./server/.env.production
rm ./client/.env.production
