var verb = ["punched", "slapped", "hit", "striked", "punted", "kicked", "shot"];
var bodyPart = ["nose", "eyes", "eye", "throat", "knee", "face", "head", "arm", "leg", "gut", "chest"];

module.exports = {
	name : "punch",
	desc : "Punch a user, or yourself...",
	category : "fun",
	show : true,
	
	run(client, message, args) {
	
		let punch = verb[Math.floor(verb.length * Math.random())],
			body = bodyPart[Math.floor(bodyPart.length * Math.random())];
		let user = message.mentions.users.first();
		let msgEmbed = client.tempEmbeds.basicEmbed("👊 Punch", `You just ${punch} yourself in the ${body}! Why!?`);
		
		if (typeof user !== "undefined") {
			msgEmbed.description = `You ${punch} ${user.username} in the ${body}!`;
		}
		
		message.channel.send({embed : msgEmbed});
	}
}