#!/usr/bin/env node

let checkTarget = require('./check-target.js');

checkTarget(process.argv[2] || process.cwd())

.then(() => {

    console.log('the folder is good');

})

.catch((e) => {

    console.log(e.message);

})
