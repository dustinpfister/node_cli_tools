// default command for nc-hexer
let path = require('path'),
fs = require('fs'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile),
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
    },
    // mode
    m: {
        default: 'toraw'
    },
    // return char
    r: {
        default: '\n'
    }
    
};
exports.handler = function (argv) {
    console.log('nc-hexer default command:');
    
    if(!argv.t){
        
        console.log('a target file must be given:');
        console.log('$ nc-hexer -t foo.txt');
        
    }else{
        
        readFile(argv.t, 'utf8')
        
        .then((data)=>{
            
            switch(argv.m){
                
                case 'toraw':
                    return writeFile(argv.o, hexer.toRawStyle(data, argv.r));
                break;
                
                case 'fromraw':
                    return writeFile(argv.o, hexer.fromRawStyle(data, argv.r));
                break;
            }
            
            return Promise.reject(new Error('unknown mode'));
            
        })
        
        .catch((e)=>{
            
            console.warn(e.message);
            
        });
        
        
    }
    
    //let raw = hexer.toRawStyle('foo\r\nbar\nfeeb');
    
    //console.log(hexer.fromRawStyle(raw));
    
};
