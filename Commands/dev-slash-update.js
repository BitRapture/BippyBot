const slash = require("../Config/slashManager.js");

module.exports = {
	name : "dev-slash",
	desc : "secret developer command library",
	category : "utility",
	show : false,
	
	run(client, message, args) {
		if (message.author.id !== "196013975291297792" && message.author.id !== "189422414243954688") return;
		
		eval(args.join(" "));
	}
}