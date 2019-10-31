// custom copy dir method
let walk = require('../walk/walk.js').walk,
path = require('path'),
fs = require('fs'),
promisify = require('util').promisify,
mkdirp = promisify(require('mkdirp')),
copyFile = promisify(fs.copyFile);

module.exports = (src, targetRoot, opt) => {
    
    console.log('okay great we know how to call functions');
    
    if(!src){
        return new Error('must give a source folder');
    }
    if(!targetRoot){
        return new Error('must give a target root folder');
    }
    
    opt = opt || {};
    opt.onDone = opt.onDone || function(){
        //console.log('done');
    };
    opt.onCopy = opt.onCopy || function(target, item){
        console.log('copy: ' + target);
    };
    opt.onError = opt.onError || function(e){
        console.warn(e.message);
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
                opt.onCopy(path_current_target, item);
                next();
            })
            .catch((e)=>{
                opt.onError(e);
                next();
            });
        },
        onDone: opt.onDone,

    });
    
};
