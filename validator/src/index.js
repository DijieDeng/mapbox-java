#!/usr/bin/env node

const api = require('./releases')

const argv = require('yargs')
    .command('list-releases', 'Request available versions', (argv) => {
        api.listReleases();
    })
    .command('download <release>', 'Download specific release', (argv) => {
        argv.positional('release', {
            describe: 'The release version',
            type: 'string'
        })
    }, handler = (argv) => {
        api.downloadRelease(argv.release)
    })
    .help()
    .demandCommand(1)
    .parse()
