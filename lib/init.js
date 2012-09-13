require = require("enhanced-require")(module);

var path = require("path");
var fs = require("fs");
var print = require("./print");
var read = require("read");

var wptVersion = require("../package.json").version;

module.exports = function(argv) {

	var templatePath = argv._[0] || path.join(__dirname, "..", "template");
	var outputDir = process.cwd();

	var currentPackageJson = require(path.join(outputDir, "package.json"));

	if(!currentPackageJson.webpackTemplate) {
		print.bold("This is not a web app created by wpt.\n");
		print.red("Failed!\n");
		return;
	}

	var applyFiles = require("./applyFiles");

	if(currentPackageJson.webpackTemplate.version != wptVersion) {
		print.yellow("current template version mismatches wpt version.\n");
		print("current version: " + currentPackageJson.webpackTemplate.version + "\n");
		print.bold("If I continue I'll update your web app to version " + wptVersion + "\nShould I continue?\n");
		(function promptSure() {
			read({
				prompt: "Type 'yes' or 'no':"
			}, function(err, answer) {
				if(err || answer == "no") {
					print.red("\nFailed!\n");
					print("The next steps are:\n");
					print.bold("Install the correct version of wpt:\n");
					print.bold("- Update your package.json dependency\n");
					print.bold("> npm install\n");
					print.bold("> wpt init\n");
					return;
				}
				if(answer == "yes") return update();
				return promptSure();
			});
		})();
		function update() {
			print.yellow("update template version: " +
				currentPackageJson.webpackTemplate.version +
				" --> " +
				wptVersion +
				"\n");
			currentPackageJson.webpackTemplate.version = wptVersion;
			fs.writeFile(
				path.join(outputDir, "package.json"),
				JSON.stringify(currentPackageJson, null, "\t"),
				"utf-8",
				function(err) {
					if(err) {
						print.red(err + "\n");
						print.red("Failed!\n");
						return;
					}
					doApplyFiles();
				}
			);
		}
	} else {
		doApplyFiles();
	}

	function doApplyFiles() {
		applyFiles(templatePath, outputDir, onFilesApplied)
	}

	function onFilesApplied(errors) {
		if(errors && Array.isArray(errors) && errors.length > 0) {
			errors.forEach(function(err) {
				print.red(err);
				print.nl();
			});
			print.red("Failed!");
		} else if(errors && !Array.isArray(errors)) {
			print.red(errors);
			print.nl();
			print.red("Failed!");
		} else {
			print.green("Done.\n");
			print("The next steps are:\n");
			print.bold("> npm install\n");
			print.bold("> dev-server\n");
			print("Then open dev-server.html in your browser.\n");
			print("It should showup the webpack.");
			print.nl();
		}
	}


}