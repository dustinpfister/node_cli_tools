#!/usr/bin/env node
let fs = require('fs'),
promisify = require('util').promisify,

stat = promisify(fs.stat),
readdir = promisify(fs.readdir);

// check if target is an empty dir
let checkTarget = (target) => {
    // get stats
    return stat(target)
    // if not dir fail, else readdir
    .then((stat) => {
        if (stat.isDirectory()) {
            return readdir(target);
        }
        return Promise.reject(new Error('target is not a directory.'));
    })

    .then((files) => {

        if (files.length === 0) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('The directory is not empty'));
    })

};

checkTarget(process.argv[2] || process.cwd())

.then(() => {

    console.log('the folder is good');

})

.catch((e) => {

    console.log(e.message);

})

//console.log('this is nc-init for now');
