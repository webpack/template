var writePackageJson = require("./writePackageJson");
var openPackageJson = require("./openPackageJson");

function initWebApp(templatePath, outputDir, callback) {

	openPackageJson(outputDir, function(err, packageJson) {
		if(err) return callback(err);

		var applyTemplate = require("./applyTemplate");

		applyTemplate(templatePath, outputDir, packageJson, function(err) {
			if(err) return callback(err);

			callback(null, packageJson);
		})
	});

}

module.exports = initWebApp;