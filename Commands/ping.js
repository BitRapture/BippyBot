module.exports = {
	name : "ping",
	desc : "Ping pong, check latencies",
	category : "utility",
	show : true,
	
	run(client, message, args) {
		message.channel.send({embed: client.tempEmbeds.basicEmbed("🏓 Pong!", "Latency: ``" + (Date.now() - message.createdTimestamp).toString() + 
															"ms`` \nAPI Latency: ``" + (client.ws.ping).toString() + "ms``")});
	}
}