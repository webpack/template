var path = require("path");
var fs = require("fs");
var bufferEqual = require("buffer-equal");
var read = require("read");

var print = require("./print");
var getFile = require("./getFile");
var pathJoin = require("./pathJoin");

fs.exists = fs.exists || path.exists; // node 0.6 support

function applyFiles(templateJson, templatePath, outputDir, packageJson, callback) {

	processFiles(templateJson.files || {}, templatePath, outputDir, function(err) {
		if(err) return callback(err);

		if(templateJson.moduleFiles && templateJson.name) {
			var moduleDir = path.join(outputDir, "_template", "modules", templateJson.name);
			var processModule = processFiles.bind(null, templateJson.moduleFiles,
				templatePath,
				moduleDir,
				callback);
			fs.exists(moduleDir, function(exist) {
				if(exist) return processModule();
				print.magenta("create module directory ");
				print(templateJson.name);
				print.nl();
				fs.mkdir(moduleDir, function(err) {
					if(err) return callback(err);
					processModule();
				});
			});
		} else callback();
	});

	function processFiles(files, templatePath, outputDir, callback) {

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
					if(setting.directory) {
						setting.remove = true;
						var before = setting.before;
						setting.before = setting.than;
						setting.than = before;
					}
				}
			}
		});

		var errors = null;
		var count = Object.keys(files).length;
		if(count == 0) return callback();
		Object.keys(files).forEach(function(file) {
			processFile(file, files[file], templatePath, outputDir, function(err) {
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

	function processFile(file, setting, templatePath, outputDir, callback) {
		if(setting.than) {
			var finalCallback = callback;
			callback = function(err) {
				if(err) return finalCallback(err);
				processFiles(setting.than, pathJoin(templatePath, file), path.join(outputDir, file), finalCallback);
			}
		}

		if(!setting.before) return process();

		processFiles(setting.before, pathJoin(templatePath, file), path.join(outputDir, file), process);

		function process(err) {
			if(err) return callback(err);
			var filePath = path.join(outputDir, file);
			fs.exists(filePath, function(exist) {
				if(setting.remove) {
					if(!exist) return callback();
					if(setting.file) {
						getFile(pathJoin(templatePath, setting.file),
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
					} else if(setting.directory) {
						fs.readdir(filePath, function(err, files) {
							if(err) return callback(err);
							if(!files || files.length == 0) {
								print.yellow("remove directory ");
								print(file);
								print.nl();
								return fs.rmdir(filePath, callback);
							} else {
								print.red("obsolete directory ");
								print(file);
								print.yellow(" --> check for migration?");
								print.nl();
								return callback();
							}
						});
					} else {
						print.yellow("remove file ");
						print(file);
						print.nl();
						fs.unlink(filePath, callback);
					}
				} else if(setting.file) {
					if(exist && !setting.overwrite) return callback();
					getFile(pathJoin(templatePath, setting.file),
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
}
module.exports = applyFiles;