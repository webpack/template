var fs = require("fs");
var print = require("./print");
var url = require("url");

module.exports = function getFile(file, callback) {
	if(/^https?:\/\//.test(file)) {
		var protocol = /^http:/.test(file) ? "http" : "https";
		print.cyan("wpt " + protocol + " GET " + file + "\n");
		var reqOpts = url.parse(file);
		reqOpts.rejectUnauthorized = false;
		require(protocol).get(reqOpts, function(res) {
			print.cyan("wpt " + protocol + " " + res.statusCode + " " + file + "\n");
			if(res.statusCode == 301 || res.statusCode == 302) {
				if(!res.headers.location) return callback(new Error("No location header"));
				return getFile(res.headers.location, callback);
			}
			var buffers = [];
			var len = 0;
			res.on("data", function(b) {
				buffers.push(b);
				len += b.length;
			});
			res.on("end", function() {
				var buffer = new Buffer(len);
				var pos = 0;
				for(var i = 0; i < buffers.length; i++)
					pos += buffers[i].copy(buffer, pos);
				return callback(null, buffer);
			});
		}).on("error", function(e) {
			console.dir(e);
			return callback(e);
		});
		return;
	}
	return fs.readFile(file, callback);
}