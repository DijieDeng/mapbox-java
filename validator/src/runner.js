module.exports = {
    validateJson: function(release, file) {
        const fs = require('fs')
        const java = require('java');

        // const javaLangSystem = java.import('java.lang.System');
        // javaLangSystem.out.printlnSync('Hello World');

        const releaseDirectory = `releases/${release}`

        java.classpath.push(`./${releaseDirectory}/mapbox-sdk-services.jar`);
        java.classpath.push(`./${releaseDirectory}/mapbox-sdk-geojson.jar`);

        // TODO :thinking:
        java.classpath.push("lib/gson-2.8.6.jar");

        const data = fs.readFileSync(file, 'utf8')

        const directionStatic = java.import("com.mapbox.api.directions.v5.models.DirectionsResponse");
        const result = directionStatic.fromJsonSync(data)
        console.log(result.toJsonSync())
        
        console.log("Completed without a crash?")
    }
}