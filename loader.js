// const path = require('path');
const requireDir = require("require-dir");

// load target dir filepaths as Job options, private
const loadDir = (targetPath) => {
  // get jobs list
  const list = requireDir(targetPath, {
    extensions: [".js"],
    recurse: true,
  });

  // build array of job options
  const jobs = [];
  for (let name in list) {
    const { job } = list[name];
    jobs.push({
      currentPath: `${targetPath}/${name}`,
      name: `${targetPath.split("/").pop()}-${name}`,
      cron: job.cron,
      func: job.func,
      autoStart: job.autoStart,
    });
  }

  return jobs;
};

// get jobs option objects for each path
const load = (paths) => {
  let jobs = [];
  paths.forEach((targetPath) => {
    const dirJobs = loadDir(targetPath).filter((newJob) => {
      // filter jobs by name, filter out incoming duplicates
      let exists = false;
      jobs.forEach((loadedJob) => {
        if (!exists && newJob.name === loadedJob.name) {
          exists = true;
        }
      });
      return !exists;
    });
    jobs = jobs.concat(dirJobs);
  });
  return jobs;
};

module.exports = load;
