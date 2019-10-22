
exports.command = 'gen';
exports.aliases = ['g'];
exports.describe = 'generate command';

exports.builder = {
    // root project path
    r: {
    default:
        process.cwd()
    }
};
exports.handler = function (argv) {
    
};
