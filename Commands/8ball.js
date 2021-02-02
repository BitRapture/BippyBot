var answers = ["Yes", "No", "Maybe", "Not a chance"];

module.exports = {
	name : "8ball",
	desc : "Magic 8ball",
	category : "fun",
	show : true,
	
	run(client, message, args) {
		message.channel.send(`${message.author}`, {embed : 
		client.tempEmbeds.basicEmbed("🎱 8Ball",
		answers[Math.floor(answers.length * Math.random())])
		});
	}
}