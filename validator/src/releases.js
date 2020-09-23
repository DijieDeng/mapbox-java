const fetch = require("node-fetch");
const fs = require('fs')

function downloadReleaseService(release, service) {
    const path = `mapbox/mapbox/com/mapbox/mapboxsdk/${service}`
    const query = `${release}/${service}-${release}.jar`
    const url = `https://dl.bintray.com/${path}/${query}`
    const util = require('util')

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
            await streamPipeline(response.body, fs.createWriteStream(relativePath))
            console.log(`Downloaded ${relativePath}`)
        } else {
            console.log(`Download already exists ${relativePath}`)
        }
    };

    async function download () {
        const response = await fetch(url)
            .then( response => {
                if (!response.ok) throw new Error(`Release was not found ${response.statusText}`)
                write(response);
             })
            .catch( error => console.error(`Unable to download ${release}`, error) );
    };

    download()
}

module.exports = {
    listReleases: function(callback) {
        const versionUrl = "https://api.bintray.com/search/packages/maven?g=com.mapbox.mapboxsdk&a=mapbox-sdk-services"

        fetch(versionUrl, { method: 'GET' })
            .then( response => response.json() )
            .then( json => callback(json[0].versions) )
            .catch( error => console.error('Unable to list release versions:', error) );
    },
    downloadRelease: function(release) {
        downloadReleaseService(release, "mapbox-sdk-services")
        downloadReleaseService(release, "mapbox-sdk-geojson")
    },
    releaseInfo: function(relativePath, release) {
        const stats = fs.statSync(relativePath);
        const fileSizeInMegabytes = stats.size / 1000000.0;
        const info = `Release downloaded 
            version: ${release}
            sizeMB: ${fileSizeInMegabytes}
            downloaded ${stats.birthtime}`;
        return ('' + info).replace(/(\n)\s+/g, '$1');
    }
};
