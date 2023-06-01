#!/bin/sh

set -o allexport
source $1
set +o allexport

node app.js
