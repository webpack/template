var writePackageJson = require("./writePackageJson");
var openPackageJson = require("./openPackageJson");

function initWebApp(templatePath, outputDir, callback) {

	openPackageJson(outputDir, function(err, packageJson) {
		if(err) return callback(err);

		var applyTemplate = require("./applyTemplate");

		applyTemplate(null, templatePath, outputDir, packageJson, function(err) {
			if(err) return callback(err);

			var modules = Object.keys(packageJson.webpackTemplate.modules);

			if(modules.length == 0) return callback(null, packageJson);

			var i = 0;
			(function next() {
				var module = modules[i++];
				if(!module) return callback(null, packageJson);
				var moduleConfig = packageJson.webpackTemplate.modules[module];

				applyTemplate(module, moduleConfig.template, outputDir, packageJson, function(err) {
					if(err) return callback(err);
					next();
				});

			})();
		})
	});

}

module.exports = initWebApp;