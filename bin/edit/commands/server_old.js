// nc-edit default command sever

// for method handler
let forMethod = {
    
    GET : require('./server_get.js')
    
}

let requestHandler = (conf, req, res) => {
    
    handler = forMethod[req.method];
    
    if(handler){
        
        handler(conf, req, res);
        
    }else{
        
        res.writeHead(500);
        res.write('unsupported http method')
        res.end();
        
    }
    
};


module.exports = (conf) => {
    
    let http = require('http'),
    
    server = http.createServer();
    
    server.on('request', (req, res)=>{
        
        requestHandler(conf, req, res);
        
    });
    
    
    server.listen(conf.port, () => {
        
        console.log('nc-edit server running on port ' + conf.port);
        
    });
    
    
};
