
exports.command = '*';
exports.aliases = ['d'];
exports.describe = 'default command';

exports.builder = {
};
exports.handler = function (argv) {
    console.log('nc-edit default command:');
};
