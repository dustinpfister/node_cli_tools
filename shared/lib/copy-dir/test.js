let copyDir = require('./index.js'),
path = require('path');

copyDir(path.resolve('./test'), path.resolve('./foo/bar'));
