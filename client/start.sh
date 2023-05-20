#!/bin/sh

source ../.env.$NODE_ENV

PORT=$CLIENT_PORT REACT_APP_SERVER_PATH=$SERVER_URL npx react-scripts start
