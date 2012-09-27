#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var WebpackDevServer = require("webpack-dev-server");
var indexTemplate = require("enhanced-require")(module)("./index.jade");

var Server = null;
try { Server = require("../app/lib/Server"); } catch(e) {}

var options = require("./loadWebpackOptions")("DevServer");
var config = require("../package.json").webpackTemplate;

options.publicPrefix = "http://localhost:8081/assets/";

// generate the dev-server.html file
var templateParams = {
	assetsPublicPath:
		options.publicPrefix +
		options.output,
	cacheManifestPublicPath: null,
	type: "dev-server",
	config: config.options
};
var indexHtml = indexTemplate(templateParams);

function MyWebpackDevServer() {
	WebpackDevServer.apply(this, arguments);
}

MyWebpackDevServer.prototype = Object.create(WebpackDevServer.prototype);

if(!Server) {
	console.log("- Serving static content.");
	MyWebpackDevServer.prototype.serveContent = function(req, res) {
		res.status = 200;
		res.setHeader("Content-Type", "text/html; charset=utf-8")
		res.end(indexHtml, "utf-8");
	}
} else {
	console.log("- Starting your node.js server on port 8080.");
	var server = new Server({
		indexHtml: indexHtml
	});
	server.listen(8080);
}

console.log("- dev-server on port 8081.");
console.log("> Open http://localhost:8081/ in your browser.");
console.log("\n");
var devServer = new MyWebpackDevServer(path.join(__dirname, "entry.js"), {
	contentUrl: "http://localhost:8080/",
	webpack: options
});
devServer.listen(8081);
