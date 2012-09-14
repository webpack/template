var path = require("path");
var fs = require("fs");

var print = require("./print");

function writePackageJson(outputDir, packageJson, callback) {
	print.green("update ");
	print("package.json");
	print.nl();
	fs.writeFile(
		path.join(outputDir, "package.json"),
		JSON.stringify(packageJson, null, "\t"),
		"utf-8",
		callback
	);
}

module.exports = writePackageJson;