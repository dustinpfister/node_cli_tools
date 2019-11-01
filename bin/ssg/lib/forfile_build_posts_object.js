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
            //fileName: item.fileName,
            html: marked(md),
            sourceFile: item
        });
    })
    // next post
    .then(()=>{
        console.log('\u001b[36m > pushed post: ' + item.fileName + '\u001b[39m');
        next();
    })
    // if and error happens
    .catch((e) => {
        console.log(e);
        next();
    })
};
