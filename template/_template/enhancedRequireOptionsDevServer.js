var path = require("path");
module.exports = function(options) {
	options.resolve.alias.indexHtml = path.join(__dirname, "index.html");
	options.substitutions = {};
	options.substitutionFactories = {};
}