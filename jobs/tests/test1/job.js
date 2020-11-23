/*
    sample usage chaining job.exec method calls
*/

module.exports = {
    autoStart: false,
    cron: '* */1 * * *',
    func: (logger, shell, slack) => (job, jobs, payload = {}) => {
        return new Promise((resolve, reject) => {
            try {
                logger.debug('slack handler', slack);
                shell('uptime', [])
                    .then(result => {
                        logger.debug('test1 -> uptime result', result);
                        // return slack.send('node-jobs job "tests-test1"', 'CHANNEL_ID');
                    })
                    .then(jobs['default-ls'].exec)
                    .then(jobs['default-whoami'].exec)
                    .then(() => {
                        logger.debug('test1 -> completed', payload);
                        resolve(true);
                    })
                    .catch(error => {
                        logger.error('test1 -> error', error);
                        reject(error);
                    });
            } catch (error) {
                logger.error('test1 job error', error);
                reject(error);
            }
        });
    },
};
