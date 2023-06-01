#!/bin/sh

source $1

PORT=$CLIENT_PORT REACT_APP_SERVER_PATH=$SERVER_URL npx react-scripts start
