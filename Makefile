PWD=$(shell pwd)

all: gawk.js

clean:
	rm -f gawk/gawk gawk.*

gawk/Makefile:
	cd gawk && emconfigure ./configure

gawk/gawk: ./Makefile gawk/Makefile pre.js post.js extern-post.js
	rm -f gawk/gawk
	cd gawk/support && CCFLAGS=-O2 emmake make LDFLAGS=-all-static CCFLAGS=-O2 -j4
	cd gawk && env CCFLAGS=-O2 emmake make gawk LDFLAGS="-all-static -s EXPORTED_RUNTIME_METHODS='[\"callMain\"]' -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_NAME=gawk -sSINGLE_FILE=1 -s WASM=1 --pre-js $(PWD)/pre.js --post-js $(PWD)/post.js --extern-post-js $(PWD)/extern-post.js" CCFLAGS=-O2 -j4

gawk.js: gawk/gawk
	cp -f gawk/gawk ./gawk.js

.PHONY: node-modules
node-modules:
	npm install

.PHONY: test
test: all node-modules
	node test.js
