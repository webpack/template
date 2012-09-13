module.exports = function(type) {
	var options = require("./webpackOptions");
	var userOptions = require("../webpackOptions");
	var typedOptions = require("./webpackOptions"+type);
	var userTypedOptions = require("../webpackOptions"+type);

	var config = require("../package.json").webpackTemplate;

	// "modules: {
	//   "jquery": {
	//     installUrl: "http://webpack.github.com/wtms/jquery.json",
	//     version: "1.8.1",
	//     versionUrl: "https://raw.github.com/webpack/jquery-wtm/v1.8.1/package.json",
	//     manual: true,
	//     references: 0
	//   }
	// }
	Object.keys(config.modules).forEach(function(module) {
		try {
			var moduleOptions = require(path.join(__dirname, "modules", module, "webpackOptions"));
		} catch(e) { return }
		moduleOptions(options);
	});

	userOptions(options);

	typedOptions(options);

	Object.keys(config.modules).forEach(function(module) {
		try {
			var moduleTypedOptions = require(path.join(__dirname, "modules", module, "webpackOptions"+type));
		} catch(e) { return }
		moduleTypedOptions(options);
	});

	userTypedOptions(options);

	return options;
}