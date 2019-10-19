#!/usr/bin/env node

let checkTarget = require('./check-target.js'),
createProject = require('./create-project.js'),

target = process.argv[2] || process.cwd();

checkTarget(target)

.then(() => {
    return createProject(target);
})

.catch((e) => {

    console.log(e.message);

})
