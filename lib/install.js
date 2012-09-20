var path = require("path");
var read = require("read");

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
	var version = argv._[1];

	if(!modulePath) return print.red("missing module path parameter. wpt install <module>\n");

	if(/^[^\/\\:]+\/[^\/\\]+$/.test(modulePath))
		modulePath = "https://raw.github.com/" + modulePath + "/master";

	modulePath = modulePath.replace(/\/$/, "");

	openPackageJson(outputDir, function(err, packageJson) {
		if(err) return print.red(err + "\n");

		getFile(pathJoin(modulePath, "templates.json"), function(err, templatesFile) {
			if(err) return tryTemplate(err);

			try {
				var templatesJson = JSON.parse(templatesFile);
				if(!templatesJson.versions) throw new Error("Json do not contain versions property.");
			} catch(e) {
				return tryTemplate(e);
			}

			if(version) {
				return installVersion(version);
			} else if(typeof templatesJson.defaultVersion == "string") {
				return installVersion(templatesJson.defaultVersion);
			} else if(Array.isArray(templatesJson.defaultVersion)) {
				askForVersion(templatesJson.defaultVersion);
			} else {
				askForVersion(Object.keys(templatesJson.versions));
			}

			function askForVersion(array) {
				print.bold("Versions: " + array.join(", ") + "\n");
				read({
					prompt: "Type version to install: ",
					"default": array[0],
					edit: true
				}, function(err, result) {
					if(err) return print.red(err + "\n");
					if(array.indexOf(result) < 0) {
						print.red("Version " + result + " is not an option.\n");
						return askForVersion(array);
					}
					return installVersion(result);
				});
			}

			function installVersion(version) {
				if(typeof templatesJson.versions[version] != "string") {
					print.red("Version " + version + " not found.\n");
					return askForVersion(Object.keys(templatesJson.versions));
				}
				print.bold("I'll install version " + version + "\n");
				var templatePath = modulePath;
				if(templatesJson.base) templatePath = pathJoin(templatePath, templatesJson.base);
				templatePath = pathJoin(templatePath, templatesJson.versions[version]);
				return installTemplate(templatePath);
			}

			function tryTemplate(err) {
				if(version) return print.red(err + "\nYou specified a version to install, but you didn't passed a valid templates path\n");
				print.yellow(err + "\n");
				print.bold("This is not a templates path. I'll try it as template path.\n");
				print.yellow("Installing modules from template path is not recommended!\n");
				print.yellow("You will not be able to update the module.\n");
				return installTemplate(modulePath)
			}
		});

		function installTemplate(templatePath) {
			getFile(pathJoin(templatePath, "template.json"), function(err, templateFile) {
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
					templates: modulePath != templatePath ? modulePath : undefined,
					template: templatePath,
					version: templateJson.version
				};

				return onDone(true);
			});
		}

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