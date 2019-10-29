// default command for nc-hexer
let path = require('path'),
hexer = require('../hexer.js');

exports.command = '*';
exports.aliases = ['d'];
exports.describe = 'default command';

exports.builder = {
    // target file
    t: {
        default: false
    },
    // output file
    o: {
        default: path.join(process.cwd(), 'hex_'+ new Date().getTime() +'.txt')
    }
};
exports.handler = function (argv) {
    console.log('nc-hexer default command:');
    
    console.log(hexer.toRawStyle('foo\r\nbar\nfeeb'));
    
};
