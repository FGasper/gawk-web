if (typeof gawk === "function") {
    let origGawk = gawk;

    gawk = {
        async run(input, progText) {
            const instance = await origGawk();

            return instance.run(input, progText);
        },
    };

    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = gawk;
    else if (typeof exports === 'object')
        exports["gawk"] = gawk;
}
