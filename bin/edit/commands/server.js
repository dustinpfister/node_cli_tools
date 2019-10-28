// nc-edit default command sever
let fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile);

let isJSURL = (url) => {
    
    return (!!url.match(/^\/js/) && url.length == 3) || !!url.match(/^\/js\//);
    
};

let getIndex = (conf, req, res) => {
    
    if(req.url === '/'){
        
        return readFile(path.join(conf.dir_public, 'index.html'), 'utf8')
        
        .then((html)=>{
            
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.write(html, 'utf8');
            res.end();
                
        })
        
    }
    
    return Promise.reject( new Error('Not the URL for the index') );
    
};

// get a client side javaScript resource
let getJS = (conf, req, res) => {
    
    if(isJSURL(req.url)){
            
        return readFile(path.join(conf.dir_public, req.url), 'utf8')
            
        .then((js)=>{
            
            res.writeHead(200, {
                'Content-Type': 'text/js'
            });
            res.write(js, 'utf8');
            res.end();
                
        })
        
    }
    
    return Promise.reject(new Error('Not a JS PATH'));
};

let forMethod = {
    
    GET : (conf, req, res) => {
        

        getIndex(conf, req, res)
        
        .catch((e)=>{
            
            return getJS(conf, req, res);
            
        })
        
        .catch((e)=>{
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write(e.message, 'utf8');
            res.end();
        });
        
        //res.writeHead(200, {
        //    'Content-Type': 'text/html'
        //});
        
        //var status = 'url: ' + req.url + '<br>' +
        //'method: ' + req.method;
        
        //res.write(status, 'utf-8');
        //res.end();
        
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
