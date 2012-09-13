#!/usr/bin/env node

// Local version replace global one
try {
	var localWpt = require.resolve(path.join(process.cwd(), "node_modules", "wpt", "bin", "wpt.js"));
	if(__filename != localWpt) {
		return require(localWpt);
	}
} catch(e) {}

var version = require("../package.json").version;

var argv = require("optimist")
	.usage("wpt " + version + "\n" +
		"Commands:\n" +
		"* create - Create a new web app in a subdirectory.\n" +
		"* init - Create a new web app in the current directory.\n" +
		"* install - Install a webpack-template-module (wtm).\n" +
		"* uninstall - Unistall a webpack-template-module.\n" +
		"* update - Updates the web app template.\n" +
		"* update <wtm> - Updates a webpack-template-module.\n" +
		"* update all - Updates template and all wtms.\n" +
		"")

	.demand(1)
	.argv;

var cmd = argv._.shift();

console.log("wpt " + version);

switch(cmd) {
	case "create": return require("../lib/create")(argv);
	case "init": return require("../lib/init")(argv);
	case "install": return require("../lib/install")(argv);
	case "uninstall": return require("../lib/uninstall")(argv);
	case "update": return require("../lib/update")(argv);
}

