// native node
let path = require('path'),
fs = require('fs'),
promisify = require('util').promisify,
marked = require('marked'),
writeFile = promisify(fs.writeFile),
// npm packs
ejs = require('ejs'),
renderFile = promisify(ejs.renderFile),
mkdirp = promisify(require('mkdirp')),
// my libs
dir_libs = '../../../shared/lib/',
walk = require(path.join(dir_libs, 'walk/walk.js')),
header = require(path.join(dir_libs, 'header/index.js')),
copyDir = require(path.join(dir_libs, 'copy-dir/index.js'));





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
    };
    // return a resolved Promise with the render method
    return Promise.resolve(function(pageInfo){
        // update currentPage info default values
        // will result in a main index.html build
        pageInfo = pageInfo || {};
        let locals = (Object.assign({}, {
            conf: conf,
            posts: posts,
            path: '/',
            title: 'site_foo',
            currentPage:{
                layout: 'home',
                fileName:'index.html'
            }
        }, pageInfo));
        // use ejs renderFile promisifyed to create html
        return renderFile( path_template_index, locals, ejs_options )
        //return renderFile( path_template_index, locals, ejs_options )
        // we now have html that can be saved
        .then((html)=>{
            // write the html file to the public folder
            let dir_target = path.join(conf.dir_public, locals.path || '/'),
              path_target = path.join(dir_target, 'index.html');
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
// generate root /index.html
let genIndex = (opt, render) => {
    console.log('rendering main index file using theme at: ' + opt.dir_theme);
    // render /index.html
    return render({
        
        // get the plain text form of the post content
        getPostText: function(postMD){
            var renderText = new marked.Renderer();
            renderText.paragraph = function (text) {
                return text;
            };
            renderText.heading = function (text, level) {
                return text;
            };
            renderText.code = function (text, level) {
                return '';
            };
            renderText.pre = function (text, level) {
                return '';
            };
            renderText.link = function (href, level, text) {
                return text;
            };
            return marked(header.remove(postMD),{renderer: renderText});
        }
        
    })
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
                title: post.head.title,
                path: '/blog' + post.dir_post,
                currentPage:{
                    layout: 'post',
                    head: post.head,
                    //post: post,
                    md: post.md
                    //content: post.html
                },
                // return a formated date for use in a theme
                getFormatedDate: function(date){
                    let d = new Date(date || this.currentPage.head.date);
                    return d.getFullYear()+ '-' + (d.getMonth() +1 ) + '-' + d.getDate();
                },
                // get the html of the post content using marked
                genPostHTML: function(){
                    return marked(header.remove(this.currentPage.md));
                },
                // get the plain text form of the post content
                genPostText: function(){
                    var render = new marked.Renderer();
                    render.paragraph = function (text) {
                        return text;
                    };
                    render.heading = function (text, level) {
                        return text;
                    };
                    return render(this.currentPage.md);
                },
                // return the first n words of text from a post
                clipContent: function(wordCount){
                    wordCount = wordCount || 100;
                    return '';
                }
            });
        }));
    })
    // gen blog post pages
    .then(()=>{
        console.log('rendering blog post page files...');
        // chunk the posts
        let pages = chunk(posts.map((post)=>{
            return {
                title: post.head.title,
                dir_post: post.dir_post
            };
        }),3);
        // gen pages
        return Promise.all( pages.map((page, i)=>{
            let pageNum = i + 1;
            return render({
                path: '/blog/page/' + pageNum,
                title: 'page ' + pageNum,
                currentPage:{
                    layout: 'blog_page',
                    pageNum: pageNum,
                    page: page,
                    totalPages: pages.length,
                    content: ''
                }
            })
        }));
    })
    // copy source from theme
    .then(()=>{
        let opt = {
            onCopy: function(target){
                console.log('\u001b[36m > copy: ' + target + '\u001b[39m');
            }
        };
        return copyDir(path.join(conf.dir_theme, 'source'), conf.dir_public, opt);
        
    })
    .then(()=>{
        console.log('build done.');
    })
    // if error
    .catch((e) => {
        console.log(e);
    });
};
