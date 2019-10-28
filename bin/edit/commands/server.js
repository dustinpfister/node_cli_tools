// nc-edit default command sever


let forMethod = {
    
    GET : (conf, req, res) => {
        
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        
        var status = 'url: ' + req.url + '<br>' +
        'jsPath: ' + !!req.url.match(/\/js^/) + '<br>' +
        'method: ' + req.method;
        
        res.write(status, 'utf-8');
        res.end();
        
    }
    
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


module.exports = (target, port) => {
    
    let http = require('http'),
    
    server = http.createServer();
    
    //server.on('request', (req, res)=> {
    //    
    //    res.writeHead(200, {
    //        'Content-Type': 'text/html'
    //    });
    //    res.write('url: ' + req.url + '<br>' + 'method: ' + req.method, 'utf-8');
    //    res.end();
    //    
    //});
    server.on('request', (req, res)=>{
        
        requestHandler({
            target: target,
            port: port
        }, req, res);
        
    });
    
    
    server.listen(port, () => {
        
        console.log('nc-edit server running on port ' + port);
        
    });
    
    
};
