var read = require("read");
var print = require("./print");

function askForOption(option, config, currentValue, callback) {
	read({
		prompt: option + (config.description && " (" + config.description + ")" || "") + ":",
		"default": currentValue === null ? config["default"] + "" : currentValue === undefined ? "" : currentValue + "",
		edit: true
	}, function(err, result) {
		if(err) return callback(err);
		if(config.required && result == "") {
			print.yellow("It's required.\n");
			return askForOption(option, config, currentValue, callback);
		}
		if(config["boolean"]) {
			if(result == "true" || result == "yes")
				return callback(null, true);
			if(result == "false" || result == "no")
				return callback(null, false);
			print.yellow("Type 'yes' / 'true' or 'no' / 'false'!\n");
			return askForOption(option, config, result, callback);
		}
		return callback(null, result);
	});

}

module.exports = askForOption;