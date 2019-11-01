let fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile),
marked = require('marked'),
header = require('../../../shared/lib/header/index.js');

// is markdown helper
let isMarkdown = (item) => {
    // is the item a markdown file?
    if (item.stat.isFile && item.fileName.match(/.md$/)) {
        return Promise.resolve()
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

// main forFile method to be used with nc-walk
module.exports = (api, item, next) => {

    console.log('generating post files for public folder: ' + api.dir_public);
    // the dir for the new html file
    let dir_html = path.join( api.dir_public, path.basename(item.fileName, '.md') + '.html' );
    // is the item markdown?
    isMarkdown(item)
    // read the markdown file
    .then(() => {
        return readFile(item.path)
    })
    // use marked to convert post to html
    // and write the new html file in the public folder
    .then((data) => {
        let md = data.toString(),
        //head = header.get(md),
        //date,
        html = marked(md);
        
        //console.log( genPostPath(item, md) );
        
        // write the file
        //return writeFile(dir_html, html, 'utf8');
        return api.render({
            layout: 'post',
            path: '/blog' + genPostPath(item, md),
            content: html
        });
        next();
    })
    // then log gen file message
    .then(()=>{
        //console.log('gen: ');
        //console.log(api);
    })
    // if and error happens
    .catch((e) => {
        console.log(e);
        next();
    })
};
