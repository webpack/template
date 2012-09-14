#!/usr/bin/env node

// Local version replace global one
try {
	var localWpt = require.resolve(path.join(process.cwd(), "node_modules", "wpt", "bin", "wpt.js"));
	if(__filename != localWpt) {
		return require(localWpt);
	}
} catch(e) {}

var version = require("../package.json").version;

var wptIntro =
'  _         _ ' + '  ___   '+ ' _____    \n' +
' | |       | |' + ' |   \\  '+'|_   _|   \n' +
' | |  ___  | |' + ' | () ) '+ '  | |     \n' +
' |  \\/ _ \\/  |'+' |  _/  '+ '  | |     \n' +
'  \\   / \\   / '+' | |    '+ '  | |     \n' +
'   \\_/   \\_/  '+' |_|    '+ '  |_| ' + version + "\n" +
'      Web     ' + ' Pack - '+ 'Template\n';

var argv = require("optimist")
	.usage(wptIntro +
		"Commands:\n" +
		"* create - Create a new web app in a subdirectory.\n" +
		"* init - Inits a existing web app in the current directory.\n" +
		"         It updates the template if mismatched version.\n" +
		"* install - Install a webpack-template-module (wtm).\n" +
		"* uninstall - Unistall a webpack-template-module.\n" +
		"* update <wtm> - Updates a webpack-template-module.\n" +
		"* update all - Updates all wtms.\n" +
		"* enable - Enable an boolean option.\n" +
		"* disable - Disable an boolean option.\n" +
		"* get - Reads the value of an option.\n" +
		"* set - Sets the value of an string option.\n" +
		"")

	.demand(1)
	.argv;

var cmd = argv._.shift();

console.log(wptIntro);

switch(cmd) {
	case "create": return require("../lib/create")(argv);
	case "init": return require("../lib/init")(argv);
	case "install": return require("../lib/install")(argv);
	case "uninstall": return require("../lib/uninstall")(argv);
	case "update": return require("../lib/update")(argv);
	case "enable": return require("../lib/enable")(argv, true);
	case "disable": return require("../lib/enable")(argv, false);
	case "get": return require("../lib/get")(argv);
	case "set": return require("../lib/set")(argv);
}

