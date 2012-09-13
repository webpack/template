var path = require("path");
module.exports = function(options) {
	options.outputDirectory = path.join(__dirname, "..", "assets"),
	options.publicPrefix = "assets/";
	options.publicPrefixCacheManifest = "";
	options.minimize = true;
	addExtension(options.extensions, ".min.js", ".js");
	addExtension(options.extensions, ".web.min.js", ".web.js");
	addExtension(options.extensions, ".webpack.min.js", ".webpack.js");
}

function addExtension(list, newExtension, before) {
	var i = list.indexOf(before);
	if(i < 0) return;
	list.splice(i, 0, newExtension);
}