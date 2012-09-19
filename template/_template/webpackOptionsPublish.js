var path = require("path");
var wtpOptions = require("../package.json").webpackTemplate.options;
module.exports = function(options) {
	options.outputDirectory = path.join(__dirname, "..", "public", "assets"),
	options.publicPrefix = wtpOptions.nodeServer ? "assets/" : "public/assets/";
	options.publicPrefixCacheManifest = "";
	options.minimize = true;
	addExtension(options.resolve.extensions, ".min.js", ".js");
	addExtension(options.resolve.extensions, ".web.min.js", ".web.js");
	addExtension(options.resolve.extensions, ".webpack.min.js", ".webpack.js");
}

function addExtension(list, newExtension, before) {
	var i = list.indexOf(before);
	if(i < 0) return;
	list.splice(i, 0, newExtension);
}