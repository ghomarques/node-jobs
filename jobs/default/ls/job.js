module.exports = {
    autoStart: false,
    cron: '* */1 * * *',
    func: (logger, shell) => (job, jobs, payload = {}) => {
        return new Promise((resolve, reject) => {
            try {
                shell(`${job.currentPath}/script.sh`, payload.options || ['-lh'])
                    .then(response => {
                        logger.debug('ls job result', response.results);
                        resolve(response);
                    })
                    .catch(response => {
                        logger.error('ls job error', response);
                        reject(response);
                    });
            } catch (error) {
                logger.error('ls job error', error);
                reject(error);
            }
        });
    },
};
