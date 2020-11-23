#!/bin/sh

pm2 stop pm2.json;
pm2 delete pm2.json;
pm2 start pm2.json;
pm2 show node-jobs;
