var fs = require("fs");
var path = require("path");

var applyOptions = require("./applyOptions");
var applyFiles = require("./applyFiles");

function applyTemplate(templateDir, outputDir, packageJson, callback) {

	fs.readFile(path.join(templateDir, "template.json"), function(err, templateJson) {
		if(err) return callback(err);

		templateJson = JSON.parse(templateJson);

		applyOptions(templateJson, templateDir, outputDir, packageJson, function(err) {
			if(err) return callback(err);

			applyFiles(templateJson, templateDir, outputDir, packageJson, callback);
		});

	});
}

module.exports = applyTemplate;