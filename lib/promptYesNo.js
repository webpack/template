var read = require("read");

function promptYesNo(yes, no, def) {
	read({
		prompt: "Type 'yes' or 'no':"
	}, function(err, answer) {
		if(err) answer = def ? "yes" : "no";
		if(answer == "yes") return yes && yes();
		if(answer == "no") return no && no();
		return promptYesNo(yes, no, def);
	});
}

module.exports = promptYesNo;