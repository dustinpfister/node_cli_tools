let exec = require('child_process').exec,
promisify = require('util').promisify,
mkdirp = promisify(require('mkdirp')),
path = require('path'),
walk = require('../../walk/lib/walk.js');

// generate posts
let genPosts = (opt) => {
    let path_script = path.resolve(__dirname, '../lib/for_post.js'),
    path_target = path.resolve(opt.dir_root, '_posts');

    console.log('generating...');
    
    // walk
    walk.walk({
        dir: path_target,
        forFile: require(path_script),
        api: {
            dir_posts: path_target,
            dir_public: opt.dir_public
        }
    });

}

// exported method for gen.js
module.exports = (opt) => {

    // make sure public folder is there
    mkdirp(opt.dir_public)

    // gen posts
    .then(() => {
        genPosts(opt);
    })

    // if error
    .catch((e) => {
        console.log(e);
    });

};
