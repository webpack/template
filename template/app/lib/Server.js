var express = require("express");

function Server(options) {
	this.options = options || {};
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
	// this.app.use(express.bodyParser());
}

Server.prototype.listen = function() {
	return this.app.listen.apply(this.app, arguments);
}

Server.prototype.initRoutes = function(app) {
	var Router = require("./Router");
	this.router = new Router(app);

	if(module.hot) {
		module.hot.accept("./Router", function() {
			this.router.dispose();
			Router = require("./Router");
			this.router = new Router(app);
		}.bind(this));
	}
}
