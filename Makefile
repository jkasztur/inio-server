.PHONY: install up build clean start
SHELL := /bin/bash
PATH := node_modules/.bin:$(PATH)

default:

install:
	rm -rf node_modules
	npm install

build:
	tsc 

clean:
	find src/ -type f -iname '*.js' -delete

start:
	node ./bin/server.js

up:
	TS_NODE_DEV=1 ts-node-dev --prefer-ts --respawn --files ./bin/server.js
