var express = require("express");

function Server(options) {
	this.options = options;
	this.app = new express();
	
	this.app.configure(this.onConfigure.bind(this));
	this.initRoutes(this.app);
}
module.exports = Server;

Server.prototype.updateOptions = function(newOptions) {
	for(var optName in newOptions) {
		this.options[optName] = newOptions[optName];
	}
}

Server.prototype.onConfigure = function() {
	if(this.options.publicPath) {
		var oneYear = 31557600000;
		this.app.use(express.static(this.options.publicPath, { maxAge: oneYear }));
	}
	// uncomment the next line to use the bodyParser middleware
	// app.use(express.bodyParser());
}

Server.prototype.listen = function() {
	return this.app.listen.apply(this.app, arguments);
}

Server.prototype.initRoutes = function(app) {
	// Define your routes here
	app.get("/", this.routeGetRoot.bind(this));
}

Server.prototype.routeGetRoot = function(req, res) {
	res.status = 200;
	res.setHeader("Content-Type", "text/html; charset=utf-8")
	res.end(this.options.indexHtml, "utf-8");
}
