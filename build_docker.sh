#!/bin/bash

VER=$(cat VERSION | head -n 1)
IMAGEID="crustio/crust-api:$VER"
docker build -t $IMAGEID .
