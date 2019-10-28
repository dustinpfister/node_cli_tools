// nc-edit default command sever

module.exports = (target, port) => {
    
    let http = require('http'),
    
    server = http.createServer();
    
    server.on('request', (req, res)=> {
        
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.write('hello world', 'utf-8');
        res.end();
        
    });
    
    
    server.listen(port, () => {
        
        console.log('nc-edit server running on port ' + port);
        
    });
    
    
};
