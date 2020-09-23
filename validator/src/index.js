#!/usr/bin/env node

const api = require('./releases')
const runner = require('./runner')

const argv = require('yargs')
    .command('list-releases', 'Request available versions', (argv) => {
        api.listReleases(releases => {
            console.log(releases)
        });
    })
    .command('download <release>', 'Download specific release', (argv) => {
        argv.positional('release', {
            describe: 'The release version',
            type: 'string'
        });
    }, handler = (argv) => {
        api.downloadRelease(argv.release);
    })
    .command('download-all', 'Download all the releases', (argv) => {
        api.listReleases(releases => {
            releases.forEach(element => {
                api.downloadRelease(element)
            });
        });
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
    .command('json-all <file>', 'Validate the contents of a json file', (argv) => {
        argv.positional('file', {
            describe: 'Path to a json file',
            type: 'string'
        });
    }, handler = (argv) => {
        api.listReleases(releases => {
            releases.forEach(element => {
                runner.validateJson(element, argv.file);
            });
        });
    })
    .help()
    .demandCommand(1)
    .parse()
