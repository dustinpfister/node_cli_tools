// open a file
let express = require('express'),
fs = require('fs'),
path = require('path');


module.exports = (conf) => {

    let router = express.Router();

    router.use( require('body-parser').json() );
    
    router.post('/', (req, res)=>{
        
        fs.readFile( path.join(conf.target, req.body.fileName), 'utf8', (e, data) => {
            
            
            res.json({
            
                mess: 'so far so good',
                data: data,
                fileName: req.body.fileName
            
            });
            
            
        });
        
        
    });

    return router;
    
};
