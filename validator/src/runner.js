const fs = require('fs')

function validateJsonData(release, data) {
    const java = require('java');    
    const releaseDirectory = `releases/${release}`

    java.classpath.push(`./${releaseDirectory}/mapbox-sdk-services.jar`);
    java.classpath.push(`./${releaseDirectory}/mapbox-sdk-geojson.jar`);

    // TODO :thinking:
    java.classpath.push("lib/gson-2.8.6.jar");

    try {
        const directionStatic = java.import("com.mapbox.api.directions.v5.models.DirectionsResponse");
        const result = directionStatic.fromJsonSync(data)
        // console.log(result.toJsonSync())

        console.log(`Completed ${release} without a crash`)
    } catch (err) {
        console.log(`Completed ${release} with a CRASH`)
    }
}

module.exports = {
    validateJson: function(release, file) {
        const data = fs.readFileSync(file, 'utf8');
        validateJsonData(release, data);
    },
    validateJsonAll: function(releases, file) {
        const data = fs.readFileSync(file, 'utf8');
        releases.forEach(element => {
            validateJsonData(element, data);
        });
    }
}