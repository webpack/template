module.exports = function(type) {
	var options = require("./webpackOptions");
	var userOptions = require("../webpackOptions");
	var typedOptions = require("./webpackOptions"+type);
	var userTypedOptions = require("../webpackOptions"+type);

	userOptions(options);
	typedOptions(options);
	userTypedOptions(options);

	var config = require("../_templateConfig.json");

	config.webpackOptions.forEach(function(module) {
		var moduleOptions = require(path.join(__dirname, "modules", module, "webpackOptions"));
		moduleOptions(options);
	});
	config["webpackOptions"+type].forEach(function(module) {
		var moduleTypedOptions = require(path.join(__dirname, "modules", module, "webpackOptions"+type));
		moduleTypedOptions(options);
	});
	return options;
}