const log4js = require('log4js');
const logger = log4js.getLogger('[node-jobs/watcher]');
const fs = require('fs');

// return meta-info about the path, private
const getStatus = path => {
    return fs.statSync(path);
};

const watch = (path, options) => {
    return new Promise((resolve, reject) => {
        try {
            const status = getStatus(path);
            const result = {
                path,
                options,
                status,
            };
            resolve(result);
        } catch (error) {
            logger.error('watcher failed', error);
            reject(error);
        }
    });
};

module.exports = watch;