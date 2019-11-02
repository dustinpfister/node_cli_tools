#!/usr/bin/env node

// index.js for nc-sspub
require('yargs')
.command(require('./commands/default.js'))
.argv;
