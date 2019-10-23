let exec = require('child_process').exec,
promisify = require('util').promisify,
mkdirp = promisify(require('mkdirp')),
path = require('path');

// generate posts
let genPosts = (opt) => {
    let path_script = path.resolve(__dirname, '../lib/for_post.js'),
    path_target = path.resolve(opt.dir_root, '_posts'),
    genPosts = exec('nc-walk -s ' + path_script + ' -t ' + path_target);

    console.log('path_for_post_script: ' + path_script);
    console.log('path_posts_folder: ' + path_target);

    genPosts.stdout.on('data', (data) => {
        console.log(data.toString());
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
