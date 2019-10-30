let fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,

readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile),
mkdirp = promisify(require('mkdirp')),
header = require('../../../shared/lib/header/index.js');

// create a starting _posts folder for the project
let createPostsFolder = (target)=> {
    
    // make posts folder
    return mkdirp(path.join(target, '_posts'))
    // read demo post
    .then(() => {
        return readFile(path.join(__dirname, 'demo-post.md'));
    })
    // write demo post in new _posts folder
    .then((data) => {
        console.log('copying demo post');
        let head = header.get(data),
        now = new Date(),
        text = '';
        head.date = now;
        head.updated = now;
        text = header.updatePost(data, head);
        return writeFile(path.join(target, '_posts', 'first-post.md'), text);
    });
    
};

// create a new project at target
module.exports = (target) => {
    
    // create the _posts folder
    createPostsFolder(target)
    
    // we are good
    .then(()=>{
        console.log('looks like we have a new project folder.');
    })
    // error
    .catch((e)=>{
        console.warn(e.message);
    });
};
