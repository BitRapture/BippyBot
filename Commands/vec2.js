function checkType(args, size) {
	if (args.length - 1 !== size) return "Malformed command";
	for (let i = 1; i < args.length; i++) {
		if (isNaN(args[i])) return `${args[i]} is NaN`;
	}
	return "fine";
}

function vecAdd(v1X, v1Y, v2X, v2Y) {
	let nX = parseFloat(v1X) + parseFloat(v2X), nY = parseFloat(v1Y) + parseFloat(v2Y);
	return "```vec2D: [" + `${nX}, ${nY}` + "]```";
}

function vecSub(v1X, v1Y, v2X, v2Y) {
	let nX = parseFloat(v1X) - parseFloat(v2X), nY = parseFloat(v1Y) - parseFloat(v2Y);
	return "```vec2D: [" + `${nX}, ${nY}` + "]```";
}

function vecMult(v1X, v1Y, s) {
	let nX = parseFloat(v1X) * parseFloat(s), nY = parseFloat(v1Y) * parseFloat(s);
	return "```vec2D: [" + `${nX}, ${nY}` + "]```";
}

function vecDot(v1X, v1Y, v2X, v2Y) {
	let nX = parseFloat(v1X) * parseFloat(v2X), nY = parseFloat(v1Y) * parseFloat(v2Y);
	return "```scalar: " + `${nX + nY}` + "```";
}

function vecMag(v1X, v1Y) {
	let v1 = parseFloat(v1X), v2 = parseFloat(v1Y);
	v1 *= v1; v2 *= v2;
	let m = Math.sqrt(v1 + v2);
	return "```||vec2D||: " + `${m}` + "```";
}

function vecUnit(v1X, v1Y) {
	let v1 = parseFloat(v1X), v2 = parseFloat(v1Y);
	v1 *= v1; v2 *= v2;
	let m = Math.sqrt(v1 + v2);
	let nX = parseFloat(v1X) / m, nY = parseFloat(v1Y) / m;
	return "```^vec2D^: [" + `${(v1 + v2 == 0 ? 0 : nX)}, ${(v1 + v2 == 0 ? 0 : nY)}` + "]```";
}

module.exports = {
	name : "vec2",
	desc : "2D vector calculator",
	category : "utility",
	show : true,
	
	run(client, message, args) {
		
		let msgEmbed = client.tempEmbeds.basicEmbed("⤴️ 2D Vector Calculator", "");
		
		if (args.length > 0) {
			let error = "fine";
			let ans = "", type = "";
			switch (args[0]) {
				case "add":
				case "+":
				case "a":
					error = checkType(args, 4);
					type = "Addition";
					if (error === "fine") {
						ans = vecAdd(args[1], args[2], args[3], args[4]);
					}
					break;
				case "sub":
				case "subtract":
				case "-":
				case "s":
					error = checkType(args, 4);
					type = "Subtraction";
					if (error === "fine") {
						ans = vecSub(args[1], args[2], args[3], args[4]);
					}
					break;
				case "mult":
				case "times":
				case "*":
					error = checkType(args, 3);
					type = "Multiplication";
					if (error === "fine") {
						ans = vecMult(args[1], args[2], args[3]);
					}
					break;
				case "dot":
				case "d":
				case ".":
					error = checkType(args, 4);
					type = "Dot product";
					if (error === "fine") {
						ans = vecDot(args[1], args[2], args[3], args[4]);
					}
					break;
				case "mag":
				case "magnitude":
				case "||":
				case "m":
					error = checkType(args, 2);
					type = "Magnitude";
					if (error === "fine") {
						ans = vecMag(args[1], args[2]);
					}
					break;
				case "unit":
				case "norm":
				case "normalise":
				case "normalize":
				case "u":
				case "^":
					error = checkType(args, 2);
					type = "Unit vector";
					if (error === "fine") {
						ans = vecUnit(args[1], args[2]);
					}
					break;
					
				default:
					error = "Malformed command";
			}
			msgEmbed.description = type + " answer:\n" + ans; //"`` vec2D: [" + ans[0] + ", " + ans[1] + "]``";
			if (error !== "fine") msgEmbed.description = client.tempEmbeds.errMsg(error);
			message.channel.send({embed : msgEmbed});
		} else {
			msgEmbed.description = "List of available commands";
			msgEmbed.fields = [
				{
					"name": "Addition",
					"value": "``"+`${client.prfx}vec2 add <v1X> <v1Y> <v2X> <v2Y>`+"``"
				},
				{
					"name": "Subtraction",
					"value": "``"+`${client.prfx}vec2 sub <v1X> <v1Y> <v2X> <v2Y>`+"``"
				},
				{
					"name": "Multiplication",
					"value": "``"+`${client.prfx}vec2 mult <vX> <vY> <s>`+"``"
				},
				{
					"name": "Dot product",
					"value": "``"+`${client.prfx}vec2 dot <v1X> <v1Y> <v2X> <v2Y>`+"``"
				},
				{
					"name": "Magnitude",
					"value": "``"+`${client.prfx}vec2 mag <vX> <vY>`+"``"
				},
				{
					"name": "Unit vector",
					"value": "``"+`${client.prfx}vec2 norm <vX> <vY>`+"``"
				}
			];
			
			message.channel.send({embed : msgEmbed});
		}
	}
}