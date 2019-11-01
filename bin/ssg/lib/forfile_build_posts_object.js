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

// genearte a post path in /yyyy/mm/dd/[fileName] format if there is a date in the header
let genPostPath = (item, md) => {
    let head = header.get(md),
    str_date = '',
    str_fn = '/' + path.basename(item.fileName, '.md');
    if(head.date){
        let d = new Date(head.date);
        str_date = '/' + d.getFullYear() + 
        '/' + ('00' + (d.getMonth() + 1)).slice(-2) + 
        '/' + ('00' + d.getDate()).slice(-2);
    }
    return str_date + str_fn;
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
            dir_post: genPostPath(item, md),
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
