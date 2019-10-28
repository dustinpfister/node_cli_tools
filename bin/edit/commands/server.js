// nc-edit default command sever
let express = require('express'),
path = require('path');


module.exports = (conf) => {
    
    let app = express();
    
    conf = conf || {};
    conf.port = conf.port || 8080;
    conf.target = conf.target || process.cwd();
    conf.dir_public = conf.dir_public || path.join(__dirname, 'public')
    conf.app = app;

    app.use('/', express.static( path.join(conf.dir_public) ));
    
    app.listen(conf.port, () => {
        
        console.log('nc-edit server running on port ' + conf.port);
        
    });
    
    
};
