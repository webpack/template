require = require("enhanced-require")(module);

var path = require("path");
var fs = require("fs");
var print = require("./print");
var read = require("read");
var replaceStuff = require("./replaceStuff");

function applyFiles(templatePath, outputDir, onAllFilesProcessed) {
	var files = require(path.join(templatePath, "_files.json"));

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
}
module.exports = applyFiles;