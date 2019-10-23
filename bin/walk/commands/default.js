
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
    },
    // api (data passed via JSON if using command)
    a: {
    default:
        false
    }
};
exports.handler = function (argv) {

    let api = {};

    // try to load JSON data passed via a option
    try {
        api = JSON.parse(JSON.stringify(argv.a));
    } catch (e) {
        api = {};
    }

    require('../lib/walk.js')({
        dir: argv.t,
        recursive: argv.r,
        scriptPath: argv.s,
        api: api
    });
};
