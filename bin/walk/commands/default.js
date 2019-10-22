
exports.command = '*';
exports.aliases = ['w'];
exports.describe = 'walk command';

exports.builder = {
    // target folder to walk
    // default to current working dir
    t: {
    default:
        process.cwd()
    },
    // recursive
    r: {
    default:
        false
    },
    // path to a script that contains
    // a for file method to fire for
    // each file
    s: {
    default:
        false
    }
};
exports.handler = function (argv) {
    require('../lib/walk.js')({
        dir: argv.t,
        recursive: argv.r,
        scriptPath: argv.s
    });
};
