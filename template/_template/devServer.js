#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var WebpackDevServer = require("webpack-dev-server");
var er = require("enhanced-require")(module, require("./loadOptions")("enhancedRequire", "DevServer"));
var options = require("./loadOptions")("webpack", "DevServer");

var indexTemplate = er("./index.jade");

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

er.options.substitutions[er.resolve("raw!indexHtml")] = indexHtml;

var Server = null;
try { Server = er("../app/lib/Server"); } catch(e) {}

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
	var server = new Server();
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
