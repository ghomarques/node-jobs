# node-jobs
Run crontab jobs via node, using node-cron as core.

## usage
Run via npm scripts:
- "npm run once JOB_NAME [-j JOB_NAME, -j JOB_NAME, ...]": "node . --once -job "; runs given jobs 1 time each now, executing its function, independent of job cron configuration;
- "npm run job JOB_NAME [-j JOB_NAME, -j JOB_NAME, ...]": "node . --job "; starts given jobs, independent of job cron configuration;
- "npm run jobs": "node ."; starts all jobs with 'autoStart' true, if no 'autoStart' true it will exit;
- "npm run jobs:watch": "node . --watch";  starts all jobs with 'autoStart' true, if no 'autoStart' true it will exit, watches for changes on dirs set on .env JOBS_PATH;
- "npm start": "pm2 stop pm2.json && pm2 delete pm2.json && pm2 start pm2.json"; starts via pm2, detached;

## job.js
Each job must have a subfolder on "./jobs".
The folder name will be the job name.
Inside of the folder you can have any arbitrary files, you must include only one file called job.js at the subfolders root.
The job.js file can run any arbitrary code, but it must return a object as it exports, containing:
- cron (REQUIRED): the cron schedule, must match cron schedule pattern;
- func (REQUIRED): a function (closure) that will receive (exec, logger, currentPath) at job creation, returning a function that will receive (job, jobs) on each cron tick;
- autoStart (OPTIONAL): if the job should start after creation, defaults to false;

## job.func
The closure will receive 2 params at job creation, supplied by the summoner, (logger, shell), in given order.
- logger: instance of log4js generated for this job;
- shell: shell script runner, spawn child_process

It must return a function that receives 3 params at cronJob onTick, (job, jobs, payload), in given order.
- job: current job instance handler;
- jobs: all jobs instance handlers;
- payload: arbitrary data;

### resources
- node-cron repo: https://github.com/kelektiv/node-cron
- testing crontab schedules: https://crontab.guru/

### todo
- setup node-watcher for each path passed on jobsPath;
- run detached for "npm run once", use "nohup &"?
- create facets for all cronJob methods?
- save job run statuses like run time, average, progress bar on CLI?
- use threads when avaiable / get node version in config;
- pass CLI params as payload to exec on "num run once", "num run job" and "npm run job:watch";
- create webhook / slack notifications for job events (start / stop / results / error);
- update readme / docs / comments;
- create system / utility jobs;
- create automated tests / more samples;
