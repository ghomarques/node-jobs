const log4js = require("log4js");
const logger = log4js.getLogger("[node-jobs/manager]");
// const slack = require('./slack');
const shell = require("./shell");
const Job = require("./model");
const { CronJob } = require("cron");

// slack handler, false if no set on .env
let slackHandler = false;

// namespace for job instances
const instances = {};

// creates a job instance, private
const createJob = (options) => {
  return new Promise((resolve, reject) => {
    try {
      // get default props from model
      const job = new Job(options);

      // get routine function
      const routine = job.func(
        log4js.getLogger(`[job ${job.name}]`),
        shell,
        slackHandler
      );

      // calls routine 1 time, independent of current running status
      job.exec = (payload) => {
        return new Promise((resolve, reject) => {
          routine(job, instances, payload)
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              reject(error);
            });
        });
      };

      // create .exec promises series based on array of payloads
      job.series = (payloads, results = []) => {
        return new Promise((resolve, reject) => {
          try {
            if (payloads.length > 0) {
              const payload = payloads.shift();
              job
                .exec(payload)
                .then((result) => {
                  resolve(job.series(payloads, results.concat(result)));
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              resolve(results);
            }
          } catch (error) {
            reject(error);
          }
        });
      };

      // create node-cron CronJob instance, private
      const cronJob = new CronJob(
        job.cron,
        () => {
          job.exec().catch((error) => {
            logger.error(`job ${job.name} error`, error);
          });
        },
        null,
        false
      );

      // get job status
      job.isRunning = () => {
        return cronJob.running || false;
      };

      // start cronJob
      job.start = () => {
        if (!job.isRunning()) {
          cronJob.start();
        }
        logger.debug(`job '${job.name}' started`);
        return job;
      };

      // stop cronJob
      job.stop = () => {
        if (job.isRunning()) {
          cronJob.stop();
        }
        logger.debug(`job '${job.name}' stopped`);
        return job;
      };

      // restart cronJob
      job.restart = () => {
        job.stop();
        job.start();
        return job;
      };

      // toggle the execution of cronJob
      job.toggle = () => {
        if (job.isRunning()) {
          job.stop();
        } else {
          job.start();
        }
        return job;
      };

      // stops and removes the job from instances
      job.remove = () => {
        const instance = instances[job.name];
        instance.stop();
        delete instances[job.name];
        return instance;
      };

      // start job if autoStart
      if (job.autoStart) {
        job.start();
      }

      instances[job.name] = job;
      resolve(job);
    } catch (error) {
      reject(error);
    }
  });
};

// create a Job instance for each job options
const createJobs = (jobs /*, slackToken*/) => {
  return new Promise((resolve, reject) => {
    try {
      // if (slackToken) {
      //     slackHandler = slack(slackToken);
      // }
      const promises = jobs.map((options) => {
        return createJob(options);
      });
      Promise.all(promises)
        .then((instances) => {
          resolve(instances);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// start all cronjobs
const startAll = () => {
  try {
    for (let job in instances) {
      instances[job].start();
    }
    return instances;
  } catch (error) {
    return error;
  }
};

// stop all cronjobs
const stopAll = () => {
  try {
    for (let job in instances) {
      instances[job].stop();
    }
    return instances;
  } catch (error) {
    return error;
  }
};

// remove all jobs
const clearAll = () => {
  try {
    for (let job in instances) {
      instances[job].remove();
    }
    return instances;
  } catch (error) {
    return error;
  }
};

module.exports = {
  createJobs,
  startAll,
  stopAll,
  clearAll,
};
