var path = require("path");
var fs = require("fs");
var read = require("read");

var print = require("./print");
var askForOption = require("./askForOption");
var writePackageJson = require("./writePackageJson");
var initWebApp = require("./initWebApp");

var wptVersion = require("../package.json").version;

module.exports = function(argv) {

	var templatePath = path.join(__dirname, "..", "template");

	var outputDir = process.cwd();

	initWebApp(templatePath, outputDir, function(err, packageJson) {
		if(err) return print.red(err + "\n");

		fs.readFile(path.join(templatePath, "template.json"), function(err, templateJson) {
			if(err) return print.red(err + "\n");

			templateJson = JSON.parse(templateJson);


			if(argv._.length == 0) {
				var options = Object.keys(templateJson.options);

				var i = 0;

				(function next() {
					var option = options[i++];
					if(!option) return onDone(true);
					askForOption(option,
						templateJson.options[option],
						packageJson.webpackTemplate.options[option], function(err, value) {
						if(err) return print.red(err + "\n");
						packageJson.webpackTemplate.options[option] = value;
						next();
					});
				})();
			} else if(argv._.length == 1) {
				var option = argv._[0];

				askForOption(option, templateJson.options[option] || {
					description: "Unknown Option"
				}, packageJson.webpackTemplate.options[option], function(err, value) {
					if(err) return print.red(err + "\n");
					packageJson.webpackTemplate.options[option] = value;
					onDone(templateJson.options[option] ? templateJson.options[option].requireInit : true);
				});
			} else {
				print.red("Wrong arguments\n");
				print("* wpt set\n");
				print("* wpt set <option>\n");
			}

		});

		function onDone(init) {
			writePackageJson(outputDir, packageJson, function(err) {
				if(err) return print.red(err + "\n");
				if(init)
					initWebApp(templatePath, outputDir, function(err, packageJson) {
						if(err) return print.red(err + "\n");

						writePackageJson(outputDir, packageJson, function(err) {
							if(err) return print.red(err + "\n");
							print.green("Done.");
						});
					});
				else
					print.green("Done.");
			});
		}
	});
}