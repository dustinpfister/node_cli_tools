#!/usr/bin/env node

// main index.js for nc-hexer
require('yargs')
.command(require('./commands/default.js'))
.argv;

