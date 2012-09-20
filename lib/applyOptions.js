function applyOptions(templateJson, templatePath, outputDir, packageJson, callback) {
	if(!templateJson.options) return callback();

	var options = Object.keys(templateJson.options);

	options.forEach(function(option) {
		var config = templateJson.options[option];
		var value = packageJson.webpackTemplate.options[option];

		if(config.packageJson) {
			packageJson[config.packageJson] = value;
		}
	});

	return callback();
}

module.exports = applyOptions;