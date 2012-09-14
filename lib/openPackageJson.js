var path = require("path");
var fs = require("fs");

var print = require("./print");
var promptYesNo = require("./promptYesNo");
var writePackageJson = require("./writePackageJson");

var wptVersion = require("../package.json").version;

function openPackageJson(outputDir, callback) {
	fs.readFile(path.join(outputDir, "package.json"), "utf-8", function(err, packageJson) {
		if(err) return onError(err);
		packageJson = JSON.parse(packageJson);

		if(!packageJson.webpackTemplate) {
			return callback("This is not a web app created by wpt.");
		}

		if(packageJson.webpackTemplate.version != wptVersion) {
			print.yellow("current template version mismatches wpt version.\n");
			print("current version:  " + packageJson.webpackTemplate.version + "\n");
			print("template version: " + wptVersion + "\n");
			print.bold("If I continue I'll update your web app to version " + wptVersion + "\nShould I continue?\n");
			promptYesNo(update, function() {
				print.red("\nFailed!\n");
				print("The next steps are:\n");
				print.bold("Install the correct version of wpt:\n");
				print.bold("- Update your package.json dependency\n");
				print.bold("> npm install\n");
				print.bold("Then rerun this command.\n");
			});
			function update() {
				print.yellow("update template version: " +
					packageJson.webpackTemplate.version +
					" --> " +
					wptVersion +
					"\n");
				packageJson.webpackTemplate.version = wptVersion;
				writePackageJson(outputDir, packageJson, function(err) {
					if(err) return onError(err);
					callback(null, packageJson);
				});
			}
		} else {
			callback(null, packageJson);
		}
	});
}

module.exports = openPackageJson;