var path = require("path");
var EventEmitter = require("events").EventEmitter;
var events = new EventEmitter();
module.exports = {
	output: "[hash].bundle.js",
	outputPostfix: ".[hash].bundle.js",
	events: events,
	context: path.join(__dirname, ".."),
	resolve: {
		alias: {},
		paths: []
	},
	parse: {
		overwrites: {}
	},
	extensions: [
		"",
		".webpack.coffee",
		".webpack.js",
		".web.coffee",
		".web.js",
		".coffee",
		".js"
	],
	postprocess: {},
	postLoaders: [],
	preLoaders: []
};
// INSERT EVENTS HERE