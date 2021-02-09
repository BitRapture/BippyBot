function errorChecking(args, i, sum, type) {
	if (type == 1) {
		if (args[i + 1] === undefined) return `No operand after ${args[i]}`;
		if (isNaN(args[i + 1])) return `${args[i + 1]} is NaN`;
	}
	if (type == 2) {
		if (i !== 0) return `NOT is a flag in this calculator because the \ndev is too tired to implement it properly, \nit must be declared at the beginning. \nIt will NOT the answer`;
	}
	
	return "fine";
}

module.exports = {
	name : "bitwise",
	desc : "Bitwise calculator",
	category : "utility",
	show : true,
	
	run(client, message, args) {
		let embed = client.tempEmbeds.basicEmbed("⚙️ Bitwise Calculator", "placeholder");
		embed.footer = {text : "Note: this calculates from the first operator to the last.\nThere is no operator precedence!"};
		
		if (args.length > 0) {
			let sum = undefined;
			let notf = false;
			let success = true;
			let errMsg = "fine";
			for (let i = 0; i < args.length; ++i) {
				switch (args[i].toLowerCase()) {
					case "and":
					case "&":
						errMsg = errorChecking(args, i, sum, 1);
						if (errMsg !== "fine") { success = false; break; }
						sum = sum & args[i + 1];
						break;
					case "or":
					case "|":
						errMsg = errorChecking(args, i, sum, 1);
						if (errMsg !== "fine") { success = false; break; }
						sum = sum | args[i + 1];
						break;
					case "xor":
					case "^":
						errMsg = errorChecking(args, i, sum, 1);
						if (errMsg !== "fine") { success = false; break; }
						sum = sum ^ args[i + 1];
						break;
					case "lsr":
					case ">>":
						errMsg = errorChecking(args, i, sum, 1);
						if (errMsg !== "fine") { success = false; break; }
						sum = sum >> args[i + 1];
						break;
					case "lsl":
					case "<<":
						errMsg = errorChecking(args, i, sum, 1);
						if (errMsg !== "fine") { success = false; break; }
						sum = sum << args[i + 1];
						break;
					case "asr":
					case ">>>":
						errMsg = errorChecking(args, i, sum, 1);
						if (errMsg !== "fine") { success = false; break; }
						sum = sum >>> args[i + 1];
						break;
					
					case "--not":
					case "-n":
					case "~":
						errMsg = errorChecking(args, i, sum, 2);
						if (errMsg !== "fine") { success = false; break; }
						notf = true;
						break;
					
					default:
						if (isNaN(args[i])) { 
							success = false; 
							errMsg = `${args[i]} is NaN or an operator`;
							break; 
						}
						if (sum === undefined)
							sum = args[i];
				}
				if (!success)
					break;
			}
			if (success) {
				sum = (notf ? ~sum : sum);
				embed.description = "```0b " + (sum >>> 0).toString(2) + " \n-----------------------------------\n0d " + sum.toString() + "```";
			} else {
				embed.description = client.tempEmbeds.errMsg(errMsg);
			}
		} else {
			embed.description = client.tempEmbeds.errMsg("No arguments supplied");
		}
		
		message.channel.send({embed : embed});
	}
}