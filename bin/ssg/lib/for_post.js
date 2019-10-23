let fs = require('fs'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
marked = require('marked');

let isMarkdown = (item) => {

    // is the item a markdown file?
    if (item.stat.isFile && item.fileName.match(/.md$/)) {

        return Promise.resolve()

    } else {

        return Promise.reject(new Error('item in posts folder is not a markdown file'));

    }

}

module.exports = (item, next) => {

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
