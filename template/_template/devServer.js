#!/usr/bin/env node

require = require("enhanced-require")(module)
var fs = require("fs");
var path = require("path");
var webpackDevMiddleware = require("webpack-dev-middleware");
var express = require("express");
var indexTemplate = require("./index.jade");

var port = process.argv[2] && parseInt(process.argv[2], 10) || 8081;

var app = new express();

var rootDir = path.join(__dirname, "..");

var options = require("./loadWebpackOptions")("DevServer");
var config = require("../_templateConfig.json");

// check for errors in webpackOptions
if(/\[hash\]/.test(options.output))
	throw new Error("devServer: [hash] is not allowed.");

// update publicPrefix
options.publicPrefix = "http://localhost:" + port + "/";

// use webpack middleware ware
app.configure(function() {
	app.use(webpackDevMiddleware(path.join(__dirname, "entry.js"), options));
});

// listen
app.listen(port);

// generate the dev-server.html file
var templateParams = {
	assetsPublicPath:
		options.publicPrefix +
		options.output,
	cacheManifestPublicPath: null,
	type: "dev-server",
	config: config.options
};
templateParams.templateParams = templateParams;
fs.writeFile(
	path.join(rootDir, "dev-server.html"),
	indexTemplate(templateParams),
	throwOnErr);
function throwOnErr(err) {
	if(err) throw err;
}