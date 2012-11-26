#!/usr/bin/env node

var fs = require("fs");
var path = require("path");

fs.exists = fs.exists || path.exists; // node 0.6 support
fs.existsSync = fs.existsSync || path.existsSync; // node 0.6 support

var WebpackDevServer = require("webpack-dev-server");
var er = require("enhanced-require")(module, require("./loadOptions")("enhancedRequire", "DevServer"));
var options = require("./loadOptions")("webpack", "DevServer");

var indexTemplate = er("./index.jade");

var config = require("../package.json").webpackTemplate;

var hasServer = fs.existsSync(path.join(__dirname, "..", "app", "lib", "Server.js"));

var devPort = process.env.PORT && parseInt(process.env.PORT, 10) || 8081;

options.publicPrefix = (hasServer ? "http://localhost:8081" : "") + "/assets/";

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
if(hasServer)
	Server = er("../app/lib/Server");

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

console.log("- dev-server on port " + devPort + ".");
console.log("> Open http://localhost:" + devPort + "/ in your browser.");
console.log("\n");
var devServer = new MyWebpackDevServer(path.join(__dirname, "entry.js"), {
	contentUrl: "http://localhost:8080/",
	webpack: options
});
devServer.listen(devPort);
