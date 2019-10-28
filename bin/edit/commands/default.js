// default command for nc-edit
let server = require('./server.js');

exports.command = '*';
exports.aliases = ['d'];
exports.describe = 'default command';

exports.builder = {
    // target project folder
    t: {
        default: process.cwd()
    },
    // port to host
    p: {
        default: 8080
    }
};
exports.handler = function (argv) {
    console.log('nc-edit default command:');
    
    server(argv.t, argv.p);
    
};
