// nc-edit default command sever
let fs = require('fs'),
path = require('path'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile);

// is the given url a javaScript path
let isJSURL = (url) => {
    
    return (!!url.match(/^\/js/) && url.length == 3) || !!url.match(/^\/js\//);
    
};

// get the ./public/index.html file
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

// get a ./public/js/* javaScript resource
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

module.exports = (conf, req, res) => {
        
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
        
}

