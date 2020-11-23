const { spawn } = require("child_process");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf8");

// parse child process stdout, private
const parse = (data) => {
  let parsed = decoder.write(data);
  parsed = parsed.split(/\n\t*/);
  return parsed.filter((part) => {
    if (part !== "") return true; // remove blank lines
    return false;
  });
};

// spawn child process and run command on it
const run = (command, options) => {
  return new Promise((resolve, reject) => {
    try {
      let results = []; // holds stdout outputs from child process
      let errors = []; // holds stderr outputs from child process
      const runtime = spawn(command, options || []); // creates child process

      // on data event
      runtime.stdout.on("data", (data) => {
        results = results.concat(parse(data));
      });

      // on error data event
      runtime.stderr.on("data", (errorData) => {
        errors = errors.concat(parse(errorData));
      });

      // rejects with error
      runtime.on("error", (error) => {
        reject({
          error,
          errors,
        });
      });

      // resolves with code 0
      runtime.on("close", (code) => {
        if (errors.length > 0) {
          reject({
            error: new Error("childProcess error"),
            errors,
          });
        } else {
          resolve({
            code,
            results,
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = run;
