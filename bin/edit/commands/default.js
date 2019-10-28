// default command for nc-edit
let server = require('./server.js'),
path = require('path');

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
    
    server({
        target: argv.t,
        port: argv.p,
        dir_public: path.join(__dirname, 'public')
    })
    
};
