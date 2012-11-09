var path = require("path");
var EventEmitter = require("events").EventEmitter;
var events = new EventEmitter();
module.exports = {
	output: "[hash].bundle.js",
	outputPostfix: ".[hash].bundle.js",
	events: events,
	context: path.join(__dirname, ".."),
	resolve: {
		alias: {
			"app": path.join(__dirname, "..", "app")
		},
		paths: [],
		extensions: [
			"",
			".webpack.coffee",
			".webpack.js",
			".web.coffee",
			".web.js",
			".coffee",
			".js"
		],
		modulesDirectories: ["web_modules", "modules", "node_modules"],
		postprocess: {}
	},
	parse: {
		overwrites: {}
	},
	postLoaders: [],
	preLoaders: []
};
