var applyOptions = require("./applyOptions");
var applyFiles = require("./applyFiles");
var getFile = require("./getFile");
var pathJoin = require("./pathJoin");

function applyTemplate(name, templateDir, outputDir, packageJson, callback) {

	getFile(pathJoin(templateDir, "template.json"), function(err, templateJson) {
		if(err) return callback(err);

		templateJson = JSON.parse(templateJson);

		if(templateJson.name != name)
			return callback(new Error("module name mismatch. " + JSON.stringify(templateJson.name) + " != " + JSON.stringify(name)));

		applyOptions(templateJson, templateDir, outputDir, packageJson, function(err) {
			if(err) return callback(err);

			applyFiles(templateJson, templateDir, outputDir, packageJson, callback);
		});

	});
}

module.exports = applyTemplate;