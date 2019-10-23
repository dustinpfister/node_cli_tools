let fs = require('fs'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
marked = require('marked');

// is markdown helper
let isMarkdown = (item) => {
    // is the item a markdown file?
    if (item.stat.isFile && item.fileName.match(/.md$/)) {
        return Promise.resolve()
    } else {
        return Promise.reject(new Error('item in posts folder is not a markdown file'));
    }
}

// main forFile method to be used with nc-walk
module.exports = (opt, item, next) => {

    console.log(opt);

    isMarkdown(item)

    .then(() => {

        return readFile(item.path)

    })

    .then((data) => {

        console.log(marked(data.toString()));

        next();

    })

    .catch((e) => {

        console.log(e);
        next();

    })

};
