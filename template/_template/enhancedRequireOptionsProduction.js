var path = require("path");
var wtpOptions = require("../package.json").webpackTemplate.options;
module.exports = function(options) {
	options.hot = options.watch = wtpOptions.hotProductionServer;
	options.resolve.alias.indexHtml = path.join(__dirname, "..", "index.html");
}