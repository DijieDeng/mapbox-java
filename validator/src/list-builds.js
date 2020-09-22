
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
    fetchVersions: function() {
        const versionUrl = "https://api.bintray.com/search/packages/maven?g=com.mapbox.mapboxsdk&a=mapbox-sdk-services"
        const request = new XMLHttpRequest();
        request.open('GET', versionUrl, true);
        const versionData = () => {
            return new Promise((resolve, reject) => {
                request.onload = function() {
                    if (this.status == 200) {
                        var data = JSON.parse(request.responseText);
                        resolve(data[0].versions)
                    } else {
                        reject()
                    }
                };
            })
        }
        
        request.send();

        versionData()
            .then(data => { console.log(data) })
            .catch(err => { console.log(err) });
    },
    downloadJar: function(build) {
        const path = "mapbox/mapbox/com/mapbox/mapboxsdk/mapbox-sdk-services"
        const query = `${build}/mapbox-sdk-services-{version}.jar`
        const url = `https://dl.bintray.com/${path}/${query}`

        console.log(`downloadJar ${build}`)
    },
};