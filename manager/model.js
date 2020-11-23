const { typeCheck } = require('type-check');
const { isValidCron } = require('cron-validator');

// validate job, private
const validate = ({
	name, // Job instance name, unique
	currentPath, // absolute path of Job instance folder on host
	cron, // cronJob schedule
	func, // job content code, function executed on cronJob 'onTick'
	autoStart, // if true the cronJob will start running upon creation
}) => {
    if (
		isValidCron(cron) &&
		typeCheck('Function', func) &&
		typeCheck('String', name) &&
		typeCheck('Boolean', autoStart) &&
		typeCheck('String', currentPath)
	) {
        return true;
    }
    return false;
};

// Job Constructor
function Job (options) {
	if (!validate(options)) {
		throw new Error(`invalid job '${options.name}'`);
	}
	this.cron = options.cron;
	this.func = options.func;
	this.name = options.name;
	this.autoStart = options.autoStart || false;
	this.currentPath = options.currentPath;
}

module.exports = Job;
