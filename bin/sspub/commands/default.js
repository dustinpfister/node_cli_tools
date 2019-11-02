let path = require('path'),
express = require('express');

exports.command = '*';
exports.aliases = ['w'];
exports.describe = 'walk command';

exports.builder = {
    // target folder to serve as a public html folder
    t: {
        default: path.join( process.cwd(), '_public')
    },
    // port
    p: {
        default: 8080
    }
};
exports.handler = function (argv) {
    
    // using express
    let app = express();
    
    // use serve static
    app.use('/', express.static(argv.t));
    
    // listen
    app.listen(argv.p, () => {
        console.log('nc-sspub: ');
        console.log('> serving public folder : ' + argv.t);
        console.log('> serving on port: ' + argv.p);
    });
    
};
