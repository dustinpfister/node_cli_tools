let ejs = require('ejs'),
fs = require('fs'),
promisify = require('util').promisify,
mkdirp = promisify(require('mkdirp')),
renderFile = promisify(ejs.renderFile),
writeFile = promisify(fs.writeFile),
path = require('path'),
walk = require('../../../shared/lib/walk/walk.js');

// lodash _.chunk alterative parked here for now
// becuase I am not sure if I want to make lodash part of the stack
// just yet. Also I am not sure if I will need to use chunk elseware.
let chunk = (arr, chunkSize) => {
    let i = 0,newArr = [];
    while(i < arr.length){
        newArr.push( arr.slice(i, i + chunkSize) );
        i += chunkSize;
    }
    return newArr;
};


// create a render method that will be used to generate all html files
// the root dir of the theme, and locals object will be closed over
// and a render method will be retruned where only a custom tailer object
// is passed as the one argument that chainges things like layout,
// the current post to render and so forth.
let createRenderMethod = (conf, posts) => {
    // main index.ejs template file location
    let path_template_index = path.join(conf.dir_theme, 'index.ejs'),
    // ejs options
    ejs_options = {
        root: conf.dir_theme
    },
    // the locals object
    ejs_locals = {
        conf: conf,
        posts: posts,
        path: '/',
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
        //return renderFile( path_template_index, locals, ejs_options )
        // we now have html that can be saved
        .then((html)=>{
            // write the html file to the public folder
            let dir_target = path.join(conf.dir_public, pageInfo.path || '/'),
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
/*
let genPosts = (opt, render) => {
    let path_script = path.resolve(__dirname, '../lib/for_post.js'),
    path_target = path.resolve(opt.dir_root, '_posts');
    console.log('generating blog posts...');
    // walk _posts
    return walk.walk({
        dir: path_target,
        forFile: require(path_script),
        api: {
            dir_posts: path_target,
            dir_public: opt.dir_public,
            render: render
        }
    });
};
*/

// generate root /index.html
let genIndex = (opt, render) => {
    console.log('building main index file using theme at: ' + opt.dir_theme);
    let path_template_index = path.join(opt.dir_theme, 'index.ejs'),
    ejs_locals = {
        conf: opt,
        title: 'site_foo main index'
    },
    ejs_options = {root: opt.dir_theme};
    //renderFile( path_template_index, ejs_locals, ejs_options )
    return render()
    .catch((e)=>{
        console.log('error building /index.html');
        console.log(e.message);
    });
};

// exported method for gen.js
module.exports = (conf) => {
    let render = function(){},
    posts = [];
    // make sure public folder is there
    mkdirp(conf.dir_public)
    // create posts object
    .then(()=>{
        console.log('creating posts object');
        return walk.walk({
            dir: path.join( conf.dir_root, '_posts'),
            forFile: require('./forfile_build_posts_object.js'),
            api: {
                posts: posts
            }
        }).then((api)=>{
            // sort posts from oldest to newest
            api.posts.sort(function(a, b){
                let d1 = new Date(a.head.date),
                    d2 = new Date(b.head.date);
                if(d1.getTime() > d2.getTime()){
                    return -1;
                }
                if(d1.getTime() < d2.getTime()){
                    return 1;
                }
                return 0;
            });
        })
    })
    // create the render method
    .then(()=>{
        console.log('ready to render...');
        return createRenderMethod(conf, posts);
    })
    // gen the main index
    .then((newRenderMethod)=>{
        render = newRenderMethod;
        return genIndex(conf, render);
    })
    // gen blog posts '/blog/[yyyy]/[mm]/[dd]/[postName]/index.html'
    .then(() => {
        console.log('rendering blog post files...');
        return Promise.all(posts.map((post)=>{
            return render({
                //posts: posts,
                layout: 'post',
                path: '/blog' + post.dir_post,
                content: post.html
            });
        }));
    })
    // gen blog post pages
    .then(()=>{
        
        let pages = chunk(posts.map((post)=>{
            
            return {
                title: post.head.title,
                dir_post: post.dir_post
            };
            
        }),3);
        
        return Promise.all( pages.map((page, i)=>{
            
            //console.log(page);
            //console.log('*****');
            
            let pageNum = i + 1;
            
            return render({
                layout: 'blog_page',
                path: '/blog/page/' + pageNum,
                pageNum: pageNum,
                page: page,
                content: ''
            })
            
        }) );
    

        
    })
    .then(()=>{
        console.log('build done.');
    })
    // if error
    .catch((e) => {
        console.log(e);
    });
};
