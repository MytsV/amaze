#!/bin/sh

source ../.env

PORT=$CLIENT_PORT REACT_APP_SERVER_PATH=http://localhost:$SERVER_PORT npx react-scripts start
