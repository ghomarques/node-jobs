// load .env file into process.env
require('dotenv-safe').load({
  allowEmptyValues: true,
});

// setup logger
require('./logger')(process.env.LOG_LEVEL); // load log4js config

// environment flags
const isLocal = process.env.NODE_ENV === 'local';
const isDev = process.env.NODE_ENV === 'development';
const isQa = process.env.NODE_ENV === 'qa';
const isProd = process.env.NODE_ENV === 'production';

// path of jobs dir
const jobsPath = JSON.parse(process.env.JOBS_PATH);

// persed cli options
const cliOptions = require('./cli');

// slack webhook token
const slackConfig = require('./slack');

module.exports = {
  isLocal,
  isDev,
  isQa,
  isProd,
  jobsPath,
  cliOptions,
  slackConfig,
};
