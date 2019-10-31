//let exec = require('child_process').exec,
let ejs = require('ejs'),
promisify = require('util').promisify,
mkdirp = promisify(require('mkdirp')),
renderFile = promisify(ejs.renderFile),
path = require('path'),
walk = require('../../../shared/lib/walk/walk.js');

// generate posts
let genPosts = (opt) => {
    let path_script = path.resolve(__dirname, '../lib/for_post.js'),
    path_target = path.resolve(opt.dir_root, '_posts');
    console.log('generating blog posts...');
    // walk _posts
    walk.walk({
        dir: path_target,
        forFile: require(path_script),
        api: {
            dir_posts: path_target,
            dir_public: opt.dir_public
        }
    });
};

let genIndex = (opt) => {
    
    console.log('building main index file uisng theme at:');
    console.log(opt.dir_theme);
    
    let path_template_index = path.join(opt.dir_theme, 'index.ejs'),
    ejs_locals = {
        conf: opt,
        title: 'site_foo main index'
    },
    ejs_options = {root: opt.dir_theme};
    
    renderFile( path_template_index, ejs_locals, ejs_options )
    .then((html)=>{
        
        console.log(html);
        
    })
    .catch((e)=>{
        console.log('error building /index.html');
        console.log(e.message);
    });
    
};

// exported method for gen.js
module.exports = (opt) => {
    // make sure public folder is there
    mkdirp(opt.dir_public)
    .then(()=>{
        genIndex(opt);
    })
    // gen posts
    .then(() => {
        genPosts(opt);
    })
    // if error
    .catch((e) => {
        console.log(e);
    });
};
