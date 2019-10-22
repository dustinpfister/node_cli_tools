
exports.command = '*';
exports.describe = 'default command';
exports.handler = function (argv) {
    console.log('nc-ssg:');
    console.log('use gen sub-command to generate a public folder when in the root working path of a project folder.');
    console.log('$ nc-ssg gen');
};
