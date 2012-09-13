module.exports = function(options) {
	options.watch = true;
	options.watchDelay = 200;
	options.debug = true;
	options.output = "dev.bundle.js";
	options.outputPostfix = ".dev.bundle.js";
}