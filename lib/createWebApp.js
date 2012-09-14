var fs = require("fs");
var path = require("path");

var writePackageJson = require("./writePackageJson");
var openPackageJson = require("./openPackageJson");
var askForOption = require("./askForOption");
var applyTemplate = require("./applyTemplate");

var wptVersion = require("../package.json").version;

function createWebApp(templatePath, outputDir, appName, callback) {

	fs.readFile(path.join(templatePath, "package.json"), "utf-8", function(err, packageJson) {
		if(err) return callback(err);

		packageJson = JSON.parse(packageJson);

		packageJson.webpackTemplate.version = wptVersion;
		packageJson.webpackTemplate.options.appName = appName;

		fs.readFile(path.join(templatePath, "template.json"), function(err, templateJson) {
			if(err) return callback(err);

			templateJson = JSON.parse(templateJson);

			var createOptions = Object.keys(templateJson.options).filter(function(name) {
				return templateJson.options[name].create;
			});

			var i = 0;
			(function next() {
				var option = createOptions[i++];
				if(!option) return createFiles();
				askForOption(option, templateJson.options[option], null, function(err, value) {
					if(err) return callback(err);
					packageJson.webpackTemplate.options[option] = value;
					next();
				});
			})();

		});

		function createFiles() {
			applyTemplate(templatePath, outputDir, packageJson, function(err) {
				if(err) return callback(err);
				writePackageJson(outputDir, packageJson, function(err) {
					if(err) return callback(err);
					return callback();
				});
			});
		}

	});

}

module.exports = createWebApp;