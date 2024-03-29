let yaml = require('js-yaml'),
patt_matchHeader = exports.patt_matchHeader = /---\n[\s|\S]*?---\n/;

// get the header from markdown text
exports.get = function (text) {
    text = text.toString();
    let head = text.match(patt_matchHeader);
    if (!head) {
        return {};
    }
    try {
        return yaml.safeLoad(head[0].replace(/---/g, ''));
    } catch (e) {
        console.log('ERROR loading yaml:');
        console.log(e.message);
        console.log('**********');
        console.log();
        console.log('**********');
        return {};
    }
};

// convert a header object to front mater that can be included
// in a markdown file
exports.toYAML = (obj, md) => {
    md = md || '';
    return '---\n' +
    yaml.safeDump(obj).replace(/: '/g, ': ').replace(/'\n/g, '\n') +
    '---\n' +
    md;
};

// quickly just update a post that has front matter with the given headerObj
exports.updatePost = (post, headerObj) => {
    return this.toYAML(headerObj, this.remove(post));
};

// remove a header from makdown text
exports.remove = function (text) {
    text = text.toString();
    return text.replace(patt_matchHeader, '');
};
