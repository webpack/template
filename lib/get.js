var path = require("path");
var fs = require("fs");
var print = require("./print");

var wptVersion = require("../package.json").version;

module.exports = function(argv) {

	var outputDir = process.cwd();
	fs.readFile(path.join(outputDir, "package.json"), "utf-8", function(err, currentPackageJson) {
		if(err) return onError(err);

		currentPackageJson = JSON.parse(currentPackageJson);

		if(!currentPackageJson.webpackTemplate) {
			print.bold("This is not a web app created by wpt.\n");
			print.red("Failed!\n");
			return;
		}

		var configOptions = currentPackageJson.webpackTemplate.options;

		if(argv._.length > 0) {
			var option = argv._[0];
			printOption(option);
		} else {
			Object.keys(configOptions).forEach(function(option) {
				print(" - ");
				printOption(option);
			});
		}

		function printOption(option, next) {
			var value = configOptions[option];
			switch(typeof value) {
			case "string":
				print.bold(option)
				print(": ");
				print(value);
				print.nl();
				break;
			case "boolean":
				print.bold(option);
				print(" ");
				if(value) print.green("is enabled");
				else print.yellow("is disabled");
				print.nl();
				break;
			default:
				print(option);
				print.red(" has some opaque value.");
				print.nl();
				break;
			}
		}

	});
	function onError(err) {
		print.red(err + "\n");
		print.red("Failed!\n");
		return;
	}
}