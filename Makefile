build:
	./node_modules/.bin/babel --plugins transform-object-rest-spread src --out-dir lib

default: build
