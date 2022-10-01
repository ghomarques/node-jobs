// load .env file into process.env
require("dotenv-safe").load({
  allowEmptyValues: true,
});

// setup logger
require("./logger")(process.env.LOG_LEVEL); // load log4js config

// environment flags
const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

// path of jobs dir
const jobsPath = JSON.parse(process.env.JOBS_PATH);

// persed cli options
const cliOptions = require("./cli");

module.exports = {
  isDev,
  isProd,
  jobsPath,
  cliOptions
};
