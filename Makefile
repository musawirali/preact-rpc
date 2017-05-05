build:
	./node_modules/.bin/babel --plugins transform-object-rest-spread src --out-dir lib
	./node_modules/.bin/browserify lib/example/client_src.js -o lib/example/client.js

default: build
