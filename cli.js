#!/usr/bin/env node
const [
    _cmd,
    _file,
    subcmd,
    arg1,
    arg2
] = process.argv;

const SUBCOMMANDS = require('./lib/subcommands');

const commands = {
    // New subcommand names
    ...SUBCOMMANDS,

    // Rewrite under old names
    node: SUBCOMMANDS['create-node'],
    plugin: SUBCOMMANDS['create-plugin']
}

if (commands[subcmd]) 
    commands[subcmd](arg1, arg2);
else
    commands['help']();