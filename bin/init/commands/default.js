let checkTarget = require('../lib/check-target.js'),
createProject = require('../lib/create-project.js');

exports.command = '*';
exports.aliases = ['w'];
exports.describe = 'walk command';

exports.builder = {
    // target folder to create into a site project folder
    t: {
    default:
        process.cwd()
    },
    // force if not empty
    f: {
        boolean: true,
        default:false
    }
};
exports.handler = function (argv) {

    (argv.f ? Promise.resolve() : checkTarget(argv.t))

    .then(() => {
        
        return createProject(argv.t);
    })

    .catch((e) => {

        console.log(e.message);

    });
    
};
