let fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,

readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile),
mkdirp = promisify(require('mkdirp')),
header = require('../../../shared/lib/header/index.js'),
copyDir = require('../../../shared/lib/copy-dir/index.js');

// create a starting _posts folder for the project
let createPostsFolder = (target)=> {
    console.log('creating _posts folder.');
    // make posts folder
    return mkdirp(path.join(target, '_posts'))
    // read demo post
    .then(() => {
        return readFile(path.join(__dirname, 'demo-post.md'));
    })
    // write demo post in new _posts folder
    .then((data) => {
        // copying demo post'
        let head = header.get(data),
        now = new Date(),
        path_post = path.join(target, '_posts', 'first-post.md'),
        text = '';
        head.date = now;
        head.updated = now;
        text = header.updatePost(data, head);
        return writeFile(path_post, text)
        .then(()=>{
            console.log('\u001b[36m copy: ' + path_post + '\u001b[39m');
        });
    });
    
};

// create core theme
createThemesFolder = (target)=> {
    console.log('creating _themes folder with starting core theme.');
    let dir_target = path.join(target, '_themes/core');
    mkdirp(dir_target)
    .then(()=>{
        let opt = {
            onCopy: function(target){
                console.log('\u001b[36m copy: ' + target + '\u001b[39m');
            }
        };
        copyDir(path.join(__dirname, './core'), dir_target, opt);
    });
};

// create a new project at target
module.exports = (target) => {
    
    // create the _posts folder
    createPostsFolder(target)
    .then(()=>{
        createThemesFolder(target);
    })
    // we are good
    .then(()=>{
        console.log('looks like we have a new project folder setup!');
    })
    // error
    .catch((e)=>{
        console.warn(e.message);
    });
};
