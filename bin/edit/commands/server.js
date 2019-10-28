// nc-edit default command sever
let express = require('express'),
path = require('path');


module.exports = (conf) => {
    
    let app = express();
    
    conf = conf || {};
    conf.port = conf.port || 8080;
    conf.target = conf.target || process.cwd();
    conf.dir_public = conf.dir_public || path.join(__dirname, 'public');
    conf.dir_shared_public = conf.dir_shared_public || path.join(__dirname, '../../../shared/public');
    conf.app = app;

    app.use('/', express.static( conf.dir_public ));
    app.use('/shared', express.static( path.join(conf.dir_shared_public) ));
    
    app.use('/file-list', require(path.join(__dirname, 'middleware/file-list.js'))(conf) );
    
    app.listen(conf.port, () => {
        
        console.log('nc-edit server running on port ' + conf.port);
        
    });
    
    
};
