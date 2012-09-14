var path = require("path");
var fs = require("fs");
var bufferEqual = require("buffer-equal");
var read = require("read");

var print = require("./print");
var replaceStuff = require("./replaceStuff");

function applyFiles(templateJson, templatePath, outputDir, packageJson, onAllFilesProcessed) {

	var files = templateJson.files;

	processFiles(files, onAllFilesProcessed);

	function processFiles(files, callback) {

		Object.keys(files).forEach(function(file) {
			var setting = files[file];
			if(setting === true) {
				setting = files[file] = {
					overwrite: true,
					file: file
				};
			} else if(setting === false) {
				setting = files[file] = {
					remove: true
				};
			} else if(setting === 1) {
				setting = files[file] = {
					overwrite: false,
					file: file
				};
			}
			if(setting.ifOption) {
				if(!packageJson.webpackTemplate.options[setting.ifOption]) {
					if(setting.file) {
						setting.remove = true;
					}
				}
			}
		});

		var errors = null;
		var count = Object.keys(files).length;
		Object.keys(files).forEach(function(file) {
			processFile(file, files[file], function(err) {
				if(err) {
					print.red("[" + file + "] " + err + "\n");
					errors = new Error("Some files failed.");
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
			if(setting.remove) {
				if(!exist) return callback();
				if(setting.file) {
					fs.readFile(path.join(templatePath, setting.file),
						function(err, content) {
							if(err) return callback(err);
							fs.readFile(filePath, function(err, oldContent) {
								if(err) return callback(err);
								if(bufferEqual(oldContent, content)) {
									print.yellow("remove file ");
									print(file);
									print.nl();
									return fs.unlink(filePath, callback);
								} else {
									print.red("obsolete file ");
									print(file);
									print.yellow(" --> check for migration?");
									print.nl();
									return callback();
								}
							});
						}
					);
				} else {
					print.yellow("remove file ");
					print(file);
					print.nl();
					fs.unlink(filePath, callback);
				}
			} else if(setting.file) {
				if(exist && !setting.overwrite) return callback();
				fs.readFile(path.join(templatePath, setting.file),
					function(err, content) {
						if(err) return callback(err);
						if(exist) {
							fs.readFile(filePath, function(err, oldContent) {
								if(err) return callback(err);
								if(bufferEqual(oldContent, content)) return callback();
								print.green("update file ");
								print(file);
								print.nl();
								fs.writeFile(filePath, content, callback);
							});
						} else {
							print.cyan("create file ");
							print(file);
							print.nl();
							fs.writeFile(filePath, content, callback);
						}
					}
				);
			} else if(setting.directory) {
				if(exist) return callback();
				print.magenta("create directory ");
				print(file);
				print.nl();
				fs.mkdir(filePath, callback);
			} else {
				return callback(
					new Error("No instructions for " + file)
				);
			}
		});
	}
}
module.exports = applyFiles;