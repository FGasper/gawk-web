/** @format */

const tape = require('tape');

const gawk = require('./gawk.js');

tape('basics', async function(t) {
    const gawkResultP = gawk.run(
            "foo bar baz\n1 2 3\n",
            "{print $2 $3}",
        );

    t.equals(
        (await gawkResultP),
        "barbaz\n23\n",
    );
});
