module.exports = {
  autoStart: false,
  cron: "* */1 * * *",
  func: (logger, shell) => (job, jobs, payload = {}) => {
    return new Promise((resolve, reject) => {
      try {
        shell(`${job.currentPath}/script.sh`, payload.options || [])
          .then((response) => {
            logger.debug("whoami job result", response);
            resolve(response);
          })
          .catch((response) => {
            logger.error("whoami job error", response);
            reject(response);
          });
      } catch (error) {
        logger.error("whoami job error", error);
        reject(error);
      }
    });
  },
};
