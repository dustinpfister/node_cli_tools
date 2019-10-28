// list files of target folder middleware
let express = require('express'),
fs = require('fs'),
path = require('path');


module.exports = (conf) => {
    
    return (req, res) => {
        
        res.json({
            
            files: []
        })
        
    };
    
};
