var wrappedGawk;

if (!wrappedGawk) {
    wrappedGawk = true;

    let origGawk = gawk;

    gawk = async () => {
        const module = await origGawk();

        // GAWK’s main() doesn’t clean up after itself. To accommodate that,
        // we take a snapshot of WASM’s memory before the first invocation
        // then reset it before each subsequent invocation.
        let stableMemoryView;

        return function(input, progText) {
            const memoryView = new Uint8Array(module.asm.memory.buffer);

            if (stableMemoryView) {
                memoryView.set(stableMemoryView);
            } else {
                stableMemoryView = new Uint8Array(
                    module.asm.memory.buffer.slice(),
                );
            }

            return module.run(input, progText);
        };
    };

    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = gawk;
    else if (typeof exports === 'object')
        exports["gawk"] = gawk;
}
