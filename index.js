const { jobsPath, cliOptions, slackConfig } = require("./config");
const watcher = require("./watcher");
const loader = require("./loader");
const { createJobs, clearAll } = require("./manager");
const log4js = require("log4js");
const logger = log4js.getLogger("[node-jobs]");

// start node-jobs
(({
  job = false, // array of job names passed via CLI, will load other jobs, will not start jobs (sets their autoStart to false before creation)
  once = false, // will trigger the execution of the job function once now and exit, will load other jobs, will not start jobs (sets their autoStart to false before creation)
  watch = false, // will watch dir, on change stops, removes and recreates all jobs
}) => {
  try {
    logger.debug("node-jobs config", {
      jobsPath,
      job,
      once,
      watch,
    });

    // checks if 'job' is an array of job names
    const hasSpecificJob = Array.isArray(job) && job.length > 0 ? true : false;

    // load jobs options
    const jobs = loader(jobsPath);

    // prevent job start via 'autoStart' prop by setting it to false, only if this node-jobs execution received a specific job name through CLI
    if (hasSpecificJob) {
      jobs.forEach((job) => {
        job.autoStart = false;
      });
    }

    // create an Job instance for each 'jobs' instance configuration
    const create = () => {
      createJobs(jobs, slackConfig)
        .then((instances) => {
          logger.debug(
            "created jobs",
            instances.map((instance) => instance.name)
          );
          // run specific job
          if (hasSpecificJob) {
            instances.forEach((instance) => {
              job.forEach((specificJob) => {
                if (instance.name === specificJob) {
                  if (once) {
                    // if once, execute now independent of job autoStart, will not start cronJob
                    instance
                      .exec()
                      .then((result) => {
                        logger.debug(
                          "success on job execution",
                          specificJob,
                          result
                        );
                      })
                      .catch((error) => {
                        logger.error(
                          "error on job execution",
                          specificJob,
                          error
                        );
                      });
                  } else {
                    // if !once, start cronJob, independent of job autoStart, will start cronJob
                    instance.start();
                  }
                }
              });
            });
          }
        })
        .catch((error) => {
          logger.error("failed to create jobs", error);
        });
    };

    // setup watcher
    if (watch && !hasSpecificJob) {
      const onChange = () => {
        clearAll();
        create();
      };
      logger.debug("setup watcher", onChange, watcher);
    }

    create();
  } catch (error) {
    logger.error("failed to create jobs", error);
  }
})(cliOptions);
