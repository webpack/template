require = require("enhanced-require")(module);

var path = require("path");
var fs = require("fs");
var child_process = require("child_process");
var print = require("./print");
var read = require("read");
var replaceStuff = require("./replaceStuff");

module.exports = function(argv) {

	var templatePath = argv._[0] || path.join(__dirname, "..", "template");

	require([path.join(templatePath, "package.json")], function(templatePackageJson) {

		templatePackageJson.webpackTemplate.version = require("../package.json").version;

		var configOptions = templatePackageJson.webpackTemplate.options;
		var options = Object.keys(configOptions).filter(function(opt) {
			return typeof configOptions[opt] == "string";
		});

		print.bold("Hello, welcome to the webpack-template create wizard.\n");
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
	});

	function onPackageDone(outputDir) {
		require([path.join(templatePath, "_files.json")], function(files) {

			processFiles(files, onAllFilesProcessed);

			function processFiles(files, callback) {

				Object.keys(files).forEach(function(file) {
					var setting = files[file];
					if(setting === true) {
						files[file] = {
							overwrite: true,
							file: file
						};
					} else if(setting === false) {
						files[file] = {
							remove: true
						};
					} else if(setting === 1) {
						files[file] = {
							overwrite: false,
							file: file
						};
					}
				});

				var errors = [];
				var count = Object.keys(files).length;
				Object.keys(files).forEach(function(file) {
					processFile(file, files[file], function(err) {
						if(err) {
							if(Array.isArray(err))
								errors.push.apply(errors, err);
							else
								errors.push(err);
						}
						count--;
						if(count == 0) {
							callback(errors);
						}
					});
				});
			}

			function processFile(file, setting, callback) {
				if(setting.than) {
					var finalCallback = callback;
					callback = function(err) {
						if(err) return finalCallback(err);
						processFiles(setting.than, finalCallback);
					}
				}

				var filePath = path.join(outputDir, file);
				fs.exists(filePath, function(exist) {
					if(!exist && setting.remove) return callback();
					if(exist && !setting.overwrite) return callback();
					if(exist && setting.directory) return callback();
					if(setting.remove) {
						print("Removing file " + file + ".");
						return fs.unlink(filePath, callback);
					} else if(setting.overwrite != undefined) {
						fs.readFile(path.join(templatePath, setting.file),
							function(err, content) {
								if(err) return callback(err);
								fs.writeFile(filePath, content, callback);
							}
						);
					} else if(setting.directory) {
						fs.mkdir(filePath, callback);
					} else {
						return callback(
							new Error("No instructions for " + file)
						);
					}
				});
			}

			function onAllFilesProcessed(errors) {
				if(errors.length > 0) {
					errors.forEach(function(err) {
						print.red(err);
						print.nl();
					});
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

		});
	}
}