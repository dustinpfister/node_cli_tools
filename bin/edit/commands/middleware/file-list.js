// list files of target folder middleware
let express = require('express'),
fs = require('fs'),
path = require('path');


module.exports = (conf) => {
    
    return (req, res) => {
        
        fs.readdir(conf.target, (e, files)=>{
            
            if(e){
                
                res.json({
                    mess: e.message,
                    files: []
                });
                
            }else{
                
                res.json({
                    mess : '',
                    files: files
                    
                });
                
            }
            
        })
        
    };
    
};
