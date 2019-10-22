#!/usr/bin/env node
console.log('hello');
require('yargs')
.command(require('./commands/default.js'))
.argv;

