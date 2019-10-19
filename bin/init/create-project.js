
let fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,

mkdir = promisify(fs.mkdir),
readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile);

// create a new project at target
module.exports = (target) => {

    // make posts folder
    return mkdir(path.join(target, '_posts'))

    // read demo post
    .then(() => {
        return readFile(path.join(__dirname, 'demo-post.md'));
    })

    // write demo post in new _posts folder
    .then((data) => {
        return writeFile(path.join(target, '_posts', 'first-post.md'), data);
    })

};