var reqExpJson = /"<<<([^>]+)>>>"/g;
var reqExp = /<<<([^>]+)>>>/g;

function replaceStuff(str, stuff, json) {
	if(json) return str.replace(reqExpJson, function(str, match) {
		if(typeof stuff[match] == "string") return JSON.stringify(stuff[match], null, "\t");
		return str;
	});
	else return str.replace(reqExp, function(str, match) {
		if(typeof stuff[match] == "string") return stuff[match];
		return str;
	});
}

module.exports = replaceStuff;