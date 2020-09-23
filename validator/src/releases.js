const fetch = require("node-fetch");
const fs = require('fs')

function releaseInfo(relativePath, release) {
    const stats = fs.statSync(relativePath);
    const fileSizeInMegabytes = stats.size / 1000000.0;
    const info = `Release downloaded 
        version: ${release}
        sizeMB: ${fileSizeInMegabytes}
        downloaded ${stats.birthtime}`;
    return ('' + info).replace(/(\n)\s+/g, '$1');
}

function downloadReleaseService(release, service) {
    const path = `mapbox/mapbox/com/mapbox/mapboxsdk/${service}`
    const query = `${release}/${service}-${release}.jar`
    const url = `https://dl.bintray.com/${path}/${query}`
    const util = require('util')
    console.log(url)

    async function write(response) {
        const streamPipeline = util.promisify(require('stream').pipeline)
        const outputDirectory = "releases"
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory);
        }
        const releaseDirectory = `${outputDirectory}/${release}`
        if (!fs.existsSync(releaseDirectory)) {
            fs.mkdirSync(releaseDirectory);
        }
        const relativePath = `./${releaseDirectory}/${service}.jar`
        if (!fs.existsSync(relativePath)) {
            console.log(`Downloading ${relativePath}`)
            await streamPipeline(response.body, fs.createWriteStream(relativePath))
        } else {
            console.log(`Download already exists ${relativePath}`)
        }

        console.log(releaseInfo(relativePath, release))
    };

    async function download () {
        const response = await fetch(url)
            .then( response => {
                if (!response.ok) throw new Error(`Release was not found ${response.statusText}`)
                write(response);
             })
            .catch( error => console.error('Unable to download release:', error) );
    };

    download()
}

module.exports = {
    listReleases: function() {
        const versionUrl = "https://api.bintray.com/search/packages/maven?g=com.mapbox.mapboxsdk&a=mapbox-sdk-services"

        fetch(versionUrl, { method: 'GET' })
            .then( response => response.json() )
            .then( json => console.log(json[0].versions) )
            .catch( error => console.error('Unable to list release versions:', error) );
    },
    downloadRelease: function(release) {
        downloadReleaseService(release, "mapbox-sdk-services")
        downloadReleaseService(release, "mapbox-sdk-geojson")
    },
};
