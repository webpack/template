var path = require("path");

var print = require("./print");
var openPackageJson = require("./openPackageJson");
var initWebApp = require("./initWebApp");
var writePackageJson = require("./writePackageJson");

var getFile = require("./getFile");
var pathJoin = require("./pathJoin");
var promptYesNo = require("./promptYesNo");

module.exports = function(argv) {

	var outputDir = process.cwd();
	var modulePath = argv._[0];

	if(!modulePath) return print.red("missing module path parameter. wpt install <module>\n");

	if(/^[^\/\\:]+\/[^\/\\]+$/.test(modulePath))
		modulePath = "https://raw.github.com/" + modulePath + "/master";

	modulePath = modulePath.replace(/\/$/, "");

	openPackageJson(outputDir, function(err, packageJson) {
		if(err) return print.red(err + "\n");

		getFile(pathJoin(modulePath, "template.json"), function(err, templateFile) {
			if(err) return print.red(err + "\n");

			try {
				var templateJson = JSON.parse(templateFile);
			} catch(e) {
				return print.red("template file is no valid json\n");
			}

			if(!templateJson.name) return print.red("template file is valid json, but has no name property\n");

			var current = packageJson.webpackTemplate.modules[templateJson.name];

			if(current) return print.red("Already installed. 'wpt uninstall " + templateJson.name + "' first to replace module.\n");

			print.bold("I'll install the " + templateJson.name + " wpt-module.\n");
			packageJson.webpackTemplate.modules[templateJson.name] = {
				template: modulePath,
				version: templateJson.version
			};

			return onDone(true);
		});

		function onDone(init) {
			writePackageJson(outputDir, packageJson, function(err) {
				if(err) return print.red(err + "\n");
				var templatePath = path.join(__dirname, "..", "template");
				initWebApp(templatePath, outputDir, function(err, packageJson) {
					if(err) return print.red(err + "\nYour module is added, but could not be installed.\nCall 'wpt init' to try again.\n");

					writePackageJson(outputDir, packageJson, function(err) {
						if(err) return print.red(err + "\nCall 'wpt init' to try again.\n");
						print.green("Done.");
					});
				});
			});
		}
	});
}