let fs = require('fs'),
path = require('path');

// walk method
let walk = (opt) => {
    
    // options
    opt = opt || {};
    opt.dir = opt.dir || process.cwd();
    opt.forFile = opt.forFile || function (api, item, next) {
        console.log('');
        console.log('fileName: ' + item.fileName);
        console.log('path: ' + item.path);
        console.log('size: ' + item.stat.size);
        console.log('');
        next();
    };
    opt.api = opt.api || {};
    opt.recursive = opt.recursive || false;
    opt.dirMode = opt.dirMode || false;
    opt.onDone = opt.onDone || function () {};

    // readNext
    let i = 0;
    let readNext = (files) => {
        let fileName = files[i];
        if (i < files.length) {

            let item = {
                fileName: fileName,
                path: path.join(opt.dir, fileName)
            };
            fs.stat(item.path, (e, stat) => {
                i += 1;
                item.stat = stat;
                if (stat.isDirectory()) {
                    if (opt.recursive) {
                        walk(Object.assign({}, opt, {
                                dir: item.path
                            }));
                    }
                    if(opt.dirMode){
                        opt.forFile(opt.api, item, function () {
                            readNext(files);
                        });
                    }else{
                        readNext(files);
                    }
                } else {
                    //item.stat = stat;
                    opt.forFile(opt.api, item, function () {
                        readNext(files);
                    });
                }
            });
        }
    };
    // read dir
    fs.readdir(opt.dir, (e, files) => {
        if (files) {
            readNext(files);
        }
    });
};

// load a forFile Script
let loadScript = (filePath) => {
    // a filePath must be given
    if (!filePath) {
        console.warn('no vaild file path given for a forFile method script. Running built in ForFile method.');
        return Promise.reject(new Error('no vaild script path'));
    }
    return new Promise((resolve, reject) => {
        try {
            let forFile = require(path.resolve(filePath));
            // Must be a function or an object with a forFile method
            if (typeof forFile != 'function') {
                if (!forFile.forFile) {
                    reject(new Error('If not a function must be an object with at least a forFile method'));
                }
            }
            resolve(forFile);
        } catch (e) {
            reject(e);
        }
    });
};

// The public API starting with the main methods used by nc-walk
let api =  (opt) => {

    opt = opt || {};
    opt.beforeWalk = opt.beforeWalk || function (next, opt) {
        next();
    };
    opt.api = opt.api || {};

    // load forFile
    loadScript(opt.scriptPath)
    // deal with forFile script
    .then((forFile) => {
        // assume just an object and merge
        opt = Object.assign(opt, forFile);
        // if just a function with no forFile prop
        if (typeof forFile === 'function' && !forFile.forFile) {
            opt.forFile = forFile;
        }
        // if given bolth use bolth
        if (typeof forFile === 'function' && forFile.forFile) {
            opt.forFile = function (item, next) {
                forFile(opt.api, item, next);
                forFile.forFile(opt.api, item, next);
            };
        }
        // dir option in for file scripts is relative to the forFile script
        if (forFile.dir) {
            let dir_forFile = path.dirname(path.resolve(opt.scriptPath));
            opt.dir = path.join(dir_forFile, opt.dir);
        }

        return Promise.resolve(opt);
    })
    .catch(() => {
        // resolve anyway use defaults
        return Promise.resolve(opt);
    })
    // walk
    .then((opt) => {

        // call onDone once on process exit
        process.on('exit', function () {
            opt.onDone();
        });

        opt.beforeWalk(function () {
            walk(opt);
        }, opt);

    });
};

//export walk and loadScript

api.walk = walk;
api.loadScript = loadScript;


// export the api
module.exports = api;
