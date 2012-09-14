var path = require("path");
var fs = require("fs");
var child_process = require("child_process");
var read = require("read");

var print = require("./print");
var createWebApp = require("./createWebApp");

module.exports = function(argv) {

	var templatePath = path.join(__dirname, "..", "template");

	var appName = argv._[0];

	if(appName) return checkAppName(false);
	else return askForAppName();

	function askForAppName() {
		read({
			prompt: "Choose a name for your web app:",
			"default": appName,
			edit: true
		}, function(err, name) {
			if(err) {
				print.red("You do not want it anymore?\n");
				return;
			}
			if(name == "") {
				print.red("Just type a name. Do not leave it empty!\n");
				return askForAppName();
			}
			appName = name;
			checkAppName(true);
		});
	}

	function checkAppName(retry) {
		var outputDir = path.join(process.cwd(), appName);
		fs.mkdir(outputDir, function(err) {
			if(err) {
				print.red(err);
				print.nl();
				if(retry) return askForAppName();
				return;
			}
			print.green("I created the directory successfully.\n");
			print.bold("Let's add some files.\n");
			print.bold("We start with the package.json file.\n");
			print.bold("I need some options for your web app:\n");
			createWebApp(templatePath, outputDir, appName, function(err) {
				if(err) {
					print.red(err);
					print.nl();
					if(retry) return promptYesNo(checkAppName.bind(null, true), function() {});
					return;
				}
				print.green("\nDone. Your web app is created.\n");
				print("The next steps are:\n");
				print.bold("> cd " + path.basename(outputDir) + "\n");
				print.bold("> npm install\n");
				print.bold("> dev-server\n");
				print("Then open dev-server.html in your browser.\n");
				print("It should display: ");
				print.bold("It's working");
				print.nl();
			});
		});
	}
}