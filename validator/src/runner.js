
const fs = require('fs')
const java = require('java');
const jarfile = require("jarfile")
const api = require('./releases')

module.exports = {
    validateJson: function(release, file) {
        api.downloadRelease(release)

        // const javaLangSystem = java.import('java.lang.System');

        // javaLangSystem.out.printlnSync('Hello World');

        // Get the Main-Class entry from foo.jar.
        const outputDirectory = "releases"
        const releaseDirectory = `${outputDirectory}/${release}`
        const relativePath = `./${releaseDirectory}/mapbox-sdk-services.jar`

        var java = require("java");
        java.classpath.push(relativePath);
        java.classpath.push("lib/gson-2.8.6.jar");

        const data = fs.readFileSync(file, 'utf8')
        const className = "com.mapbox.api.directions.v5.models.DirectionsResponse";
        const result = java.callStaticMethodSync(className, "fromJson", data)
        console.log(result)
    }
}