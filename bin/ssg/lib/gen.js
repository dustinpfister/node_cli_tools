let ejs = require('ejs'),
fs = require('fs'),
promisify = require('util').promisify,
mkdirp = promisify(require('mkdirp')),
renderFile = promisify(ejs.renderFile),
writeFile = promisify(fs.writeFile),
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
        // update currentPage info default values
        // will result in a main index.html build
        pageInfo = pageInfo || {};
        ejs_locals.currentPage = Object.assign({},{
            layout: 'home',
            path: '/',
            content: '',
            fileName: 'index.html'
        }, pageInfo);
        // use ejs renderFile promisifyed to create html
        return renderFile( path_template_index, ejs_locals, ejs_options )
        // we now have html that can be saved
        .then((html)=>{
            // write the html file to the public folder
            let dir_target = path.join(ejs_locals.conf.dir_public, ejs_locals.currentPage.path),
              path_target = path.join(dir_target, ejs_locals.currentPage.fileName);
            // ensure dir for file
            return mkdirp(dir_target)
            // write the file
            .then(()=>{
                return writeFile(path_target, html, 'utf8');
            })
            .then(()=>{
               
                console.log('\u001b[36m > render: ' + path_target + '\u001b[39m');
                
            });
        });
    });
};

// generate posts
let genPosts = (opt, render) => {
    let path_script = path.resolve(__dirname, '../lib/for_post.js'),
    path_target = path.resolve(opt.dir_root, '_posts');
    console.log('generating blog posts...');
    // walk _posts
    walk.walk({
        dir: path_target,
        forFile: require(path_script),
        api: {
            dir_posts: path_target,
            dir_public: opt.dir_public,
            render: render
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
        genPosts(opt, render);
    })
    // if error
    .catch((e) => {
        console.log(e);
    });
};
