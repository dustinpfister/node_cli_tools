// using the fs module, and the promisify method
// of the util module
let fs = require('fs'),
promisify = require('util').promisify,

// promisify fs.stat, and fs.readdir
stat = promisify(fs.stat),
readdir = promisify(fs.readdir);

// the check target method is the only thing exported
module.exports = (target) => {

    // get stats
    return stat(target)

    // if the target is a dir, read the contents
    .then((stat) => {
        if (stat.isDirectory()) {
            return readdir(target);
        }
        // if not a dir fail
        return Promise.reject(new Error('target is not a directory.'));
    })

    // just resolve if dir contents are empty
    .then((files) => {
        if (files.length === 0) {
            return Promise.resolve();
        }
        // fail if there are contents
        return Promise.reject(new Error('The directory is not empty, if you want you can use the force option $ nc-init -f'));
    });

};
