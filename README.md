# gawk-web: [GNU AWK](https://www.gnu.org/software/gawk/) for the Web

This package builds GNU AWK to WebAssembly and JavaScript via [Emscripten](https://emscripten.org/).

Usage:
```
require('./gawk.js').then(
    gawk => {
        console.log( gawk.run(
            "foo bar baz\n1 2 3\n",   // i.e., the text to process
            "{print $2 $3}",          // your AWK code
        ) );
    },
);
```

## Notes

- This build optimizes for ease of use by packing the WebAssembly into the
JavaScript file. You can shrink the output significantly by removing
the `SINGLE_FILE` flag from the build (see the Makefile). You’ll need to
grab `gawk.wasm` from the `gawk` directory and ensure that it’s available
wherever your `gawk.js` runs.

- This copies a number of usage patterns from
[jq-web](https://github.com/fiatjaf/jq-web).

- GNU AWK’s build seems to give the LDFLAGS twice when building. For us that
causes `pre.js` and friends to be included twice. To work around that, those
files eschew root-level `let` and `const` in favor of `var`.
