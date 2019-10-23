let exec = require('child_process').exec,
path = require('path');

module.exports = (opt) => {

    let path_script = path.resolve(__dirname, '../lib/for_post.js'),
    path_target = path.resolve(opt.dir_root, '_posts'),
    genFiles = exec('nc-walk -s ' + path_script + ' -t ' + path_target);

    console.log(path_script);
    console.log(path_target);

    genFiles.stdout.on('data', (data) => {
        console.log(data.toString());
    })

};
