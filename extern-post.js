var wrappedGawk;

if (!wrappedGawk) {
    wrappedGawk = true;

    let origGawk = gawk;

    gawk = async () => {
        const module = await origGawk();

        let stableMemoryView;

        return function(input, progText) {
            if (!stableMemoryView) {
                stableMemoryView = new Uint8Array(
                    module.asm.memory.buffer.slice(),
                );
            }

            const got = module.run(input, progText);

            const postMemoryView = new Uint8Array(module.asm.memory.buffer);
            postMemoryView.set(stableMemoryView);

            return got;
        };
    };

    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = gawk;
    else if (typeof exports === 'object')
        exports["gawk"] = gawk;
}
