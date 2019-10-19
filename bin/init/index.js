#!/usr/bin/env node
let fs = require('fs'),
promisify = require('util').promisify,

stat = promisify(fs.stat),
readdir = promisify(fs.readdir);

// check if target is an empty dir
let checkTarget = (target) => {

    stat(target)

    .then((stat) => {

        if (stat.isDirectory()) {

            console.log(stat)

        } else {

            return Promise.reject(new Error('target is not a directory.'))

        }

    })

    .catch((e) => {

        console.log(e.message);

    })

    /*
    return new Promise((resolve, reject) => {
    fs.stat(target, (e, stat) => {
    if (e) {
    reject(e);
    } else {
    if (stat.isDirectory()) {
    fs.readdir(target, (e, files) => {
    if (e) {
    reject(e)
    } else {
    if (files.length === 0) {
    resolve()
    } else {
    reject(new Error('the target dir is not empty'));
    }
    }
    });
    } else {
    reject(new Error('target is not a directory'));
    }
    }
    });
    });

     */

};

checkTarget(process.argv[2] || process.cwd())

//console.log('this is nc-init for now');
