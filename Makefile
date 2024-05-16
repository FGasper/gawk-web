PWD=$(shell pwd)

all: gawk.js gawk.wasm

clean:
	rm -f gawk/gawk gawk/gawk.wasm gawk.*

gawk/Makefile:
	cd gawk && emconfigure ./configure

gawk/gawk: ./Makefile pre.js post.js extern-post.js
	rm -f gawk/gawk
	cd gawk && env CCFLAGS=-O2 emmake make gawk LDFLAGS="-all-static -s EXPORTED_RUNTIME_METHODS='[\"callMain\"]' -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_NAME=gawk -s WASM=1 --pre-js $(PWD)/pre.js --post-js $(PWD)/post.js --extern-post-js $(PWD)/extern-post.js" CCFLAGS=-O2 -j4

gawk.js: gawk/gawk gawk.wasm
	cp -f gawk/gawk ./gawk.js

gawk/gawk.wasm: gawk/gawk

gawk.wasm: gawk/gawk gawk/gawk.wasm
	cp -f gawk/gawk.wasm .

.PHONY: node-modules
	npm install

.PHONY: test
test: all node-modules
	node test.js
