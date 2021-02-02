module.exports = {
	basicEmbed(title, desc, color = 16762103) {
		let embed = {};
		embed.title = title;
		embed.description = desc;
		embed.color = color;
		
		return embed;
	},
	
	errMsg(msg) {
		return "**Error!**\n```" + msg + "```";
	}
}