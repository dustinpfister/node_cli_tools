//let exec = require('child_process').exec,
let ejs = require('ejs'),
promisify = require('util').promisify,
mkdirp = promisify(require('mkdirp')),
renderFile = promisify(ejs.renderFile),
path = require('path'),
walk = require('../../../shared/lib/walk/walk.js');

// create a render method that will be used to generate all html files
// the root dir of the theme, and locals object will be closed over
// and a render method will be retruned where only a custom tailer object
// is passed as the one argument that chainges things like layout,
// the current post to render and so forth.
let createRenderMethod = (conf) => {
    
    // main index.ejs template file location
    let path_template_index = path.join(conf.dir_theme, 'index.ejs'),
    // ejs options
    ejs_options = {
        root: conf.dir_theme
    },
    // the locals object
    ejs_locals = {
        conf: conf,
        title: 'site_foo main index',
        currentPage:{}
    };
    
    // return a resolved Promise with the render method
    return Promise.resolve(function(pageInfo){
        
        pageInfo = pageInfo || {};
        
        ejs_locals.currentPage = Object.assign({},{
            layout: 'home',
            path: '/'
        }, pageInfo);
        
        // use ejs renderFile promisifyed
        return renderFile( path_template_index, ejs_locals, ejs_options );
        
    });
    
};

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

let genIndex = (opt, render) => {
    
    console.log('building main index file uisng theme at:');
    console.log(opt.dir_theme);
    
    let path_template_index = path.join(opt.dir_theme, 'index.ejs'),
    ejs_locals = {
        conf: opt,
        title: 'site_foo main index'
    },
    ejs_options = {root: opt.dir_theme};
    
    //renderFile( path_template_index, ejs_locals, ejs_options )
    render()
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
    
    let render = function(){};
    
    // make sure public folder is there
    mkdirp(opt.dir_public)
    .then(()=>{
        
        return createRenderMethod(opt);
        
    })
    .then((newRenderMethod)=>{
        render = newRenderMethod;
        genIndex(opt, render);
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
