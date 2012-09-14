var path = require("path");

var print = require("./print");
var initWebApp = require("./initWebApp");
var writePackageJson = require("./writePackageJson");

module.exports = function(argv) {

	var templatePath = path.join(__dirname, "..", "template");
	var outputDir = process.cwd();

	initWebApp(templatePath, outputDir, function(err, packageJson) {
		if(err) return print.red(err + "\n");

		writePackageJson(outputDir, packageJson, function(err) {
			if(err) return print.red(err + "\n");

			print.green("Done.\n");
			print("The next steps are:\n");
			print.bold("> npm install\n");
			print.bold("> dev-server\n");
			print("Then open dev-server.html in your browser.\n");
			print("It should open your web app.");
			print.nl();
		});
	});
}