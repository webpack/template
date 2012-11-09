function Router(app) {
	this.app = app;
	// Define your routes here
	app.get("/", this.routeGetRoot.bind(this));
}
exports = module.exports = Router;

Router.prototype.dispose = function() {
	// Perform tasks to unbind from app

	// remove routes
	for(var verb in this.app.routes) {
		this.app.routes[verb].length = 0;
	}
}

Router.prototype.routeGetRoot = function(req, res) {
	res.status = 200;
	res.setHeader("Content-Type", "text/html; charset=utf-8")
	res.end(require("raw!indexHtml"), "utf-8");
}
