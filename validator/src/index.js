#!/usr/bin/env node

const api = require('./releases')
const runner = require('./runner')

const argv = require('yargs')
    .command('list-releases', 'Request available versions', (argv) => {
        api.listReleases();
    })
    .command('download <release>', 'Download specific release', (argv) => {
        argv.positional('release', {
            describe: 'The release version',
            type: 'string'
        });
    }, handler = (argv) => {
        api.downloadRelease(argv.release);
    })
    .command('json <release> <file>', 'Validate the contents of a json file', (argv) => {
        argv.positional('release', {
            describe: 'The release version',
            type: 'string'
        });
        argv.positional('file', {
            describe: 'Path to a json file',
            type: 'string'
        });
    }, handler = (argv) => {
        runner.validateJson(argv.release, argv.file);
    })
    .help()
    .demandCommand(1)
    .parse()
