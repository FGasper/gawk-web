/** @format */

var NEWLINE = 0xa;

var utf8Decoder = new TextDecoder();

function fromByteArray(data) {
  return utf8Decoder.decode(new Uint8Array(data));
}

// takes a string as input and returns a string
// like `echo <jsonstring> | jq <filter>`, returning the value of STDOUT
function runGawk(inputstring, programText, flags) {
  stdin = inputstring
  inBuffer = null;
  outBuffer = [];
  errBuffer = [];

  let mainErr, stdout, stderr, exitCode;

  // Emscripten 3.1.31 neglects to free its argv, so we’ll do it here.
  // This should be safe to do even if Emscripten fixes that.
  const stackBefore = stackSave();

  // Emscripten, as of 3.1.31, mucks with process.exitCode, which
  // makes no sense.
  let preExitCode;
  if (typeof process !== "undefined") {
    preExitCode = process.exitCode;
  }

  try {
    exitCode = Module.callMain(["--", programText, '/dev/stdin']); // induce c main open it
    //exitCode = Module.callMain(["--pretty-print=/dev/stdout", "--", programText, '/dev/stdin']); // induce c main open it
  } catch (e) {
    mainErr = e;
  }

  if (preExitCode !== undefined) {
    process.exitCode = preExitCode;
  }

  stackRestore(stackBefore);

  // make sure closed & clean up fd
  if(FS.streams[0]) FS.close(FS.streams[0])
  if(FS.streams[1]) FS.close(FS.streams[1])
  if(FS.streams[2]) FS.close(FS.streams[2])
  if(FS.streams[3]) FS.close(FS.streams[3])
  if(FS.streams.length>3) FS.streams.pop()

  // calling main closes stdout, so we reopen it here:
  FS.streams[0] = FS.open('/dev/stdin', "r")
  FS.streams[1] = FS.open('/dev/stdout', 577, 0)
  FS.streams[2] = FS.open('/dev/stderr', 577, 0)

  if (errBuffer.length) {
    stderr = fromByteArray(errBuffer);
    console.warn('%cstderr%c: %c%s', 'background:red;color:black', '', 'color:red', stderr);
  }

  if (outBuffer.length) {
    stdout = fromByteArray(outBuffer);
  }

  try {
    if (mainErr) {
      throw mainErr;
    } else if (exitCode !== 0) {
      const err = new Error(`Non-zero exit code: ${exitCode}`);
      if (stderr) err.stderr = stderr;
      err.exitCode = exitCode;
      throw err;
    }
  } catch (e) {
    if (stderr) e.stderr = stderr;
    throw e;
  }

  return stdout;
}

Object.assign(
    Module,
    { run: runGawk },
);
