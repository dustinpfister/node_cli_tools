let path = require('path'),
gen = require('../lib/gen.js');

exports.command = 'gen';
exports.aliases = ['g'];
exports.describe = 'generate command';

exports.builder = {
    // root project path
    r: {
    default:
        process.cwd()
    },
    // path to create the public folder in
    p: {
    default:
        path.join(process.cwd(), '_public')
    }
};
exports.handler = function (argv) {

    gen({
        dir_root: argv.r,
        dir_public: argv.p
    });

};
