var path = require("path");
var fs = require("fs");

var print = require("./print");
var promptYesNo = require("./promptYesNo");
var writePackageJson = require("./writePackageJson");
var initWebApp = require("./initWebApp");

var wptVersion = require("../package.json").version;

module.exports = function(argv, enable) {

	var templatePath = path.join(__dirname, "..", "template");

	var outputDir = process.cwd();

	initWebApp(templatePath, outputDir, function(err, packageJson) {
		if(err) return print.red(err + "\n");

		fs.readFile(path.join(templatePath, "template.json"), function(err, templateJson) {
			if(err) return print.red(err + "\n");

			templateJson = JSON.parse(templateJson);

			var configOptions = packageJson.webpackTemplate.options;
			var endis = (enable ? "enable" : "disable");
			if(argv._.length > 0) {
				var option = argv._.shift();
				if(typeof configOptions[option] != "boolean" &&
					typeof configOptions[option] != "undefined") {
					return onError("Please use 'wpt " + endis + "' only for boolean options");
				}
				if(typeof configOptions[option] == "undefined") {
					print.yellow("A new option will be created. Are you sure?\n");
					promptYesNo(exec, print.red.bind(null, "Aborted."));
				} else exec();

				function exec() {
					configOptions[option] = enable;
					onDone(templateJson.options[option] ? templateJson.options[option].requireInit : true);
				}
			} else {
				return print.red("Please specify a option to " + endis + ": 'wpt " + endis + " <option>'.\n");
			}
		});

		function onDone(init) {
			writePackageJson(outputDir, packageJson, function(err) {
				if(err) return print.red(err + "\n");
				if(init)
					initWebApp(templatePath, outputDir, function(err, packageJson) {
						if(err) return print.red(err + "\nCall 'wpt init' to try again.\n");

						writePackageJson(outputDir, packageJson, function(err) {
							if(err) return print.red(err + "\nCall 'wpt init' to try again.\n");
							print.green("Done.");
						});
					});
				else
					print.green("Done.");
			});
		}
	});
}