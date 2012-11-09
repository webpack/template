var path = require("path");
var wtpOptions = require("../package.json").webpackTemplate.options;
module.exports = {
	recursive: true,
	hot: !!wtpOptions.hotServer,
	watch: !!wtpOptions.hotServer,
	context: path.join(__dirname, ".."),
	resolve: {
		alias: {
			app: path.join(__dirname, "..", "app")
		},
		paths: [],
		extensions: [
			"",
			".node",
			".coffee",
			".js"
		],
		modulesDirectories: ["modules", "node_modules"],
		postprocess: {}
	}
}