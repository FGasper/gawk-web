/** @format */

const tape = require('tape');

const gawkPromise = require('./gawk.js');

tape('basics', async function(t) {
    const gawk = await gawkPromise;

    t.equals(
        gawk.run(
            "foo bar baz\n1 2 3\n",
            "{print $2 $3}",
        ),
        "barbaz\n23\n",
    );
});
