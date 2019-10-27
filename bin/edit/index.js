#!/usr/bin/env node

// main index.js for nc-edit
// using yargs for option parsing sub commands in a ./commands folder
require('yargs')
.command(require('./commands/default.js'))
.argv;

