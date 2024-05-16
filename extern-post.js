if (typeof gawk === "function") {
    gawk = gawk().then( module => {
        return { run: module.run };
    } );

    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = gawk;
    else if (typeof exports === 'object')
        exports["gawk"] = gawk;
}
