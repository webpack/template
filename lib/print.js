function print(msg) {
	process.stdout.write(msg);
}

print.nl = function() {
	process.stdout.write("\n");
}

// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
var colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

Object.keys(colors).forEach(function(name) {
	var begin = "\033[1m\033[" + colors[name][0] + "m";
	var end = "\033[" + colors[name][1] + "m\033[22m";
	print[name] = function(msg) {
		print(begin + msg + end);
	}
});

module.exports = print;