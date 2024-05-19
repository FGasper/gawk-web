/** @format */

const tape = require('tape');

const gawk = require('./gawk.js');

tape('basics', async function(t) {
    const got = (await gawk())(
        "foo bar baz\n1 2 3\n",
        "{print $2 $3}",
    );

    t.equals(
        got,
        "barbaz\n23\n",
    );
});

tape('repeat usage', async function(t) {
    const iterations = 1000;

    const myGawk = await gawk();

    for (let i=0; i<iterations; i++) {
        const got = myGawk(
            `foo bar ${i}\n1 2 3\n`,
            "{print $2 $3}",
        );

        t.equals(
            got,
            `bar${i}\n23\n`,
        );
    }
});

tape('failure', async function(t) {
    const myGawk = await gawk();

    t.throws(
        () => myGawk("123", "{ foo"),
        err => {
            t.match(
                err.stderr,
                /unexpected newline or end of string/,
                'stderr looks as we expect',
            );

            t.ok(err.exitCode);
            t.notEqual(err.exitCode, 0);

            return true;
        },
    );
});


