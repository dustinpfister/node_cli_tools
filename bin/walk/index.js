#!/usr/bin/env node

require('yargs')
.command(require('./commands/default.js'))
.argv;

