var path = require("path");
module.exports = function(first) {
	if(/^https?:\/\//.test(first)) {
		return Array.prototype.join.call(arguments, "/");
	}
	return path.join.apply(path, arguments)
}