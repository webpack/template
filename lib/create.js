require = require("enhanced-require")(module);

var path = require("path");
var fs = require("fs");
var child_process = require("child_process");
var print = require("./print");
var read = require("read");
var replaceStuff = require("./replaceStuff");

module.exports = function(argv) {

	var templatePath = argv._[0] || path.join(__dirname, "..", "template");

	print.bold("Hello, welcome to the webpack-template create wizard.\n");

	var templatePackageJson = require(path.join(templatePath, "package.json"));

	templatePackageJson.webpackTemplate.version = require("../package.json").version;

	var configOptions = templatePackageJson.webpackTemplate.options;
	var options = Object.keys(configOptions).filter(function(opt) {
		return typeof configOptions[opt] == "string";
	});

	print.bold("I'll ask you about some properties for your new web app:\n");
	print.bold("(You may leave some blank, but not the 'appName')\n");

	var i = 0;
	(function next() {
		var name = options[i];
		if(!name) return onOptionsDone();
		i++;
		read({
			prompt: name + ":",
			"default": configOptions[name],
			edit: true
		}, function(err, result) {
			if(err) return print.bold("\nI'll abort by your wish.\n");
			configOptions[name] = result;
			next();
		});
	})()

	function onOptionsDone() {
		if(!configOptions["appName"]) {
			print.bold("I told you that 'appName' cannot be empty!\n");
			return read({
				prompt: "Try it again, appName:",
			}, function(err, appName) {
				if(err) return print.bold("\nI'll abort by your wish.\n");
				configOptions.appName = appName;
				onOptionsDone();
			});
		}
		var outputDir = path.join(process.cwd(), configOptions.appName);
		fs.mkdir(outputDir, function(err) {
			if(err) return onError(err);
			fs.writeFile(
				path.join(outputDir, "package.json"),
				replaceStuff(
					JSON.stringify(templatePackageJson, null, "\t"),
					configOptions, true),
				"utf-8",
				function(err) {
					if(err) return onError(err);
					onPackageDone(outputDir);
				}
			);
		});
		function onError(err) {
			print.red(err + "\n");
			print.bold("Maybe you want to try another appName?\n");
			return read({
				prompt: "appName:",
				"default": configOptions.appName,
				edit: true
			}, function(err, appName) {
				if(err) return print.bold("\nI'll abort by your wish.\n");
				configOptions.appName = appName;
				onOptionsDone();
			});
		}
	}

	function onPackageDone(outputDir) {
		var applyFiles = require("./applyFiles");

		applyFiles(templatePath, outputDir, onFilesApplied)

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
				print.bold("> cd " + path.basename(outputDir) + "\n");
				print.bold("> npm install\n");
				print.bold("> dev-server\n");
				print("Then open dev-server.html in your browser.\n");
				print("It should display: ");
				print.bold("It's working");
				print.nl();
			}
		}

	}
}