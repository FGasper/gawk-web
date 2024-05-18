var stdin = '';
var inBuffer;
var outBuffer;
var errBuffer;

var utf8Encoder = new TextEncoder();

Object.assign(
  Module,
  {
    noInitialRun: true,
    noExitRuntime: false,

    onRuntimeInitialized() {

        // XXX This is brittle because it assumes the presence of a
        // “wasmMemory” internal variable in the generated JS.
        Module.wasmMemory = wasmMemory;
    },

    preRun() {
      FS.init(
        function input() {
          if (!inBuffer && stdin) {
            inBuffer = utf8Encoder.encode(stdin);
          }

          if (inBuffer && inBuffer.length) {
            const thisByte = inBuffer[0];
            inBuffer = new Uint8Array(inBuffer.buffer, inBuffer.byteOffset + 1);
            return thisByte;
          }

          return null;
        },

        function output(c) {
          if (c) outBuffer.push(c);
        },

        function error(c) {
          if (c) errBuffer.push(c);
        },
      );
    },
  },
);
