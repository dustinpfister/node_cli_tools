#!/usr/bin/env node

// index.js for nc-init
require('yargs')
.command(require('./commands/default.js'))
.argv;
