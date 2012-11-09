var path = require("path");
module.exports = function(category, type) {
	var options = require("./"+category+"Options");
	var userOptions = null, typedOptions = null, userTypedOptions = null;

	var config = require("../package.json").webpackTemplate;


	try {
		userOptions = require("../"+category+"Options");
	} catch(e) {}
	try {
		typedOptions = require("./"+category+"Options"+type);
	} catch(e) {}
	try {
		userTypedOptions = require("../"+category+"Options"+type)
	} catch(e) {}

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
			var moduleOptions = require(path.join(__dirname, "modules", module, category+"Options"));
			console.log("- included options from " + module + " wpt-module.");
		} catch(e) { return }
		moduleOptions(options);
	});

	userOptions && userOptions(options);

	typedOptions && typedOptions(options);

	Object.keys(config.modules).forEach(function(module) {
		try {
			var moduleTypedOptions = require(path.join(__dirname, "modules", module, category+"Options"+type));
			console.log("- included specific options from " + module + " wpt-module.");
		} catch(e) { return }
		moduleTypedOptions(options);
	});

	userTypedOptions && userTypedOptions(options);

	return options;
}