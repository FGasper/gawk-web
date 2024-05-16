# gawk-web: [GNU AWK](https://www.gnu.org/software/gawk/) for the Web

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
