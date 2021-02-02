module.exports = {
	name : "help",
	desc : "list of commands",
	category : "utility",
	show : false,
	
	run(client, message, args) {
		let pageNo = 1,
			pages = Math.ceil(client.cmdHelpCat[0].cmds.length / 10);
		let catNo = 1,
			justOneCat = false;
		let finalEmbed = client.tempEmbeds.basicEmbed("📘 Help - Command List", ""),
			pageContent = "";
		
		if (args.length !== 0 && !isNaN(args[0])) {
			pageNo = args[0];
		} else if (args.length !== 0 && client.cmdHelpCat.find(i => i.cat === args[0].toLowerCase()) !== undefined) {
			catNo = client.cmdHelpCat.findIndex(i => i.cat === args[0].toLowerCase());
			pages = Math.ceil(client.cmdHelpCat[catNo].cmds.length / 10);
			justOneCat = true;
			finalEmbed.title = "📘 Help - Category: " + args[0].toUpperCase();
			if (args.length > 1 && !isNaN(args[1])) pageNo = args[1];
		}
		if (pageNo <= 0 || pageNo > pages) pageNo = pages;
		
		let cPos = 0, i = 0;
		while (true) {
			if (client.cmdHelpCat[catNo].cmds[i] === undefined) {
				if (justOneCat) break;
				catNo++;
				i = 0;
				if (catNo >= client.cmdHelpCat.length) break;
			}
			
			if (cPos >= (pageNo - 1) * 10 && cPos < pageNo * 10) {
				if (i == 0) {
					pageContent += `**${client.cmdHelpCat[catNo].cat.toUpperCase()}**\n`;
				}
				pageContent += "``"+client.prfx+client.cmdHelpCat[catNo].cmds[i]+ "`` : "+client.cmdList.get(client.cmdHelpCat[catNo].cmds[i]).desc+"\n";
			} else if (cPos >= pageNo * 10) break;
			
			cPos++;
			i++;
		}
		
		finalEmbed.description = pageContent;
		finalEmbed.footer = {text : `Page ${pageNo}/${pages}    |    `+"b.help "+(justOneCat ? `${args[0]} <page>` : "<page>") };
		message.channel.send({embed : finalEmbed});
	}
}