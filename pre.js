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
            throw "should never read stdin";
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
