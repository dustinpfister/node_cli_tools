
let path = require('path'),
fs = require('fs');

// walk method
module.exports = (opt) => {

    opt = opt || {};
    opt.root = path.resolve(opt.root || process.cwd());

};
