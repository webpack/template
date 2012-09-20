var path = require("path");
module.exports = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    var start = -1;
    args.forEach(function(arg, idx) {
        if(/^https?:\/\//.test(arg))
            start = idx;
    });
    if(start >= 0)
        return normalize(args.slice(start).join("/"));
	return path.join.apply(path, arguments)
}

function normalize(str) {
	str = str
		.replace(/\/[^\/]+\/..\//g, "/")
		.replace(/\/.\//g, "/")
		.replace(/\/[^\/]+\/..$/g, "")
		.replace(/\/.$/, "");
	return str;
}