#!/usr/bin/env node

const api = require('./list-builds')

const argv = require('yargs')
    .command('list-builds', 'Request available versions', (argv) => {
        api.fetchVersions();
    })
    .command('download <release>', 'Download specific release', (argv) => {
        argv.positional('release', {
            describe: 'The release version',
            type: 'string'
        })
    }, handler = (argv) => {
        api.downloadJar(argv.release)
    })
    .help()
    .demandCommand(1)
    .parse()
