// custom copy dir method
let walk = require('../walk/walk.js').walk,
path = require('path'),
fs = require('fs'),
promisify = require('util').promisify,
mkdirp = promisify(require('mkdirp')),
copyFile = promisify(fs.copyFile);

module.exports = (src, targetRoot, opt) => {
    
    if(!src){
        return new Error('must give a source folder');
    }
    if(!targetRoot){
        return new Error('must give a target root folder');
    }
    
    opt = opt || {
        onDone: function(){}
    };
    
    walk({
        dirMode: false,
        recursive: true,
        dir: src,
        api: {
            dir_target: targetRoot
        },
        forFile: (api, item, next)=>{
            
            let rel_path = '.' + item.path.split(path.dirname(src)).join(''),
            rel_dir = path.dirname(rel_path),
            // absolute target path to create if it is not there
            dir_current_target = path.join(api.dir_target, rel_dir),
            path_current_target = path.join(dir_current_target, item.fileName);
            
            //console.log( dir_current_target );
            console.log(rel_path);
            console.log(rel_dir);
            console.log(dir_current_target);
            console.log(path_current_target);
            console.log(item.path);
            console.log('');
            
            mkdirp(dir_current_target)
            
            .then(()=>{
                
                return copyFile(item.path, path_current_target);
                
            })
            
            .then(()=>{
                
                next();
                
            })
            
            .catch((e)=>{
                
                console.warn(e.message);
                
            });
            
            
            //if(item.stat.isDirectory()){
                
                //mkdirp(item.path)
                //next()
                
            //}else{
            
                //next();
                
            //}
            
        },
        onDone: opt.onDone,

    });
    
};
