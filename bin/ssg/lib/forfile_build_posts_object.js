let fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
marked = require('marked'),
header = require('../../../shared/lib/header/index.js');

// is markdown helper
let isMarkdown = (item) => {
    // is the item a markdown file?
    if (item.stat.isFile && item.fileName.match(/.md$/)) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error('item in posts folder is not a markdown file'));
    }
};

// The exported forFile method
module.exports = (api, item, next) => {
    
    api.posts = api.posts || [];
    
    // is the item markdown?
    isMarkdown(item)
    // read the markdown file
    .then(() => {
        return readFile(item.path);
    })
    // push data for the post into the posts array
    .then((data) => {
        let md = data.toString();
        api.posts.push({
            head: header.get(md),
            fileName: item.fileName,
            html: marked(md)
        });
    })
    // next post
    .then(()=>{
        console.log('pushed post: ' + item.fileName);
        next();
    })
    // if and error happens
    .catch((e) => {
        console.log(e);
        next();
    })
};
