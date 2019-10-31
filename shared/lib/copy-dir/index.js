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
    
    opt = opt || {};
    opt.onDone = opt.onDone || function(){
            console.log('done copying dir');
        
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

            mkdirp(dir_current_target)
            .then(()=>{
                return copyFile(item.path, path_current_target);
            })
            .then(()=>{
                next();
            })
            .catch((e)=>{
                console.warn(e.message);
                next();
            });
        },
        onDone: opt.onDone,

    });
    
};
