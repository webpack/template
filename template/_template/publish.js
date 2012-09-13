#!/usr/bin/env node

require = require("enhanced-require")(module)
var fs = require("fs");
var path = require("path");
var webpack = require("webpack");
var formatOutput = require("webpack/lib/formatOutput");
var indexTemplate = require("./index.jade");

var rootDir = path.join(__dirname, "..");

var options = require("./loadWebpackOptions")("Publish");
var config = require("../package.json").webpackTemplate;

webpack(path.join(__dirname, "entry.js"), options, function(err, stats) {
	if(err) throw err;
	console.log(formatOutput(stats, {
		context: options.context,
		colors: true
	}));

	// generate the index.html file
	var templateParams = {
		assetsPublicPath:
			options.publicPrefix +
			options.output.replace(/\[hash\]/g, stats.hash),
		cacheManifestPublicPath: config.options.cacheManifest &&
			(options.publicPrefixCacheManifest + "cache.manifest") || null,
		type: "publish",
		config: config.options,
	};
	templateParams.templateParams = templateParams;
	fs.writeFile(
		path.join(rootDir, "index.html"),
		indexTemplate(templateParams),
		throwOnErr);

	// store stats in json format
	// it may be used by external applications
	fs.writeFile(
		path.join(rootDir, "publishedStats.json"),
		JSON.stringify(stats, null, "\t"), "utf-8",
		throwOnErr);

	// generate a cache manifest
	var manifest = ["CACHE MANIFEST", "# " + stats.hash, "", "CACHE:"];
	for(var file in stats.fileSizes) {
		manifest.push(
			options.publicPrefix +
			file.replace(/\[hash\]/g, stats.hash));
	}
	manifest.push("", "NETWORK:", "*");
	fs.writeFile(
		path.join(rootDir, "cache.manifest"),
		manifest.join("\n"), "utf-8",
		throwOnErr);
});
function throwOnErr(err) {
	if(err) throw err;
}