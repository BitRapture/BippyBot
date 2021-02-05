// ---------------------------------------
// Definitions/Declarations
// ---------------------------------------

const Discord = require("discord.js");
const client = new Discord.Client();
const slash = require("./Config/slashManager.js");
const iConfig = require("./Config/config.json");
const fs = require("fs");
const commandFiles = fs.readdirSync("./Commands").filter(i => i.endsWith(".js"));
client.tempEmbeds = require("./Config/embedTemplates.js");
client.prfx = iConfig.prefix;
client.lyricsToken = iConfig.lyricsToken;

// ---------------------------------------
// Command Mapping
// ---------------------------------------

client.cmdList = new Map();
client.cmdHelpCat = [];
client.cmdHelpCat[client.cmdHelpCat.length] = { cat : "all", cmds : [] };
for (const file of commandFiles) {
	const command = require(`./Commands/${file}`);
	client.cmdList.set(command.name, command);
	if (command.show && client.cmdHelpCat.find(i => i.cat === command.category) === undefined) {
		let cmdCat = {};
		cmdCat.cat = command.category;
		cmdCat.cmds = [];
		client.cmdHelpCat[client.cmdHelpCat.length] = cmdCat;
	} 
	if (command.show) {
		client.cmdHelpCat[client.cmdHelpCat.findIndex(i => i.cat === command.category)].cmds.push(command.name);
		client.cmdHelpCat[0].cmds.push(command.name);
	}
}

// ---------------------------------------
// Slash Manager
// ---------------------------------------

slash.login(iConfig.token);
slash.get();

// ---------------------------------------
// Discord Bot 
// ---------------------------------------

client.on("ready", () => {
	console.log(`Successfully logged in as ${client.user.tag}!`);
	console.log(`Loaded ${slash.commands.size} slash command(s)!`);
	client.user.setActivity(`${iConfig.prefix}help`, { type: "STREAMING", url: "https://www.youtube.com/watch?v=A8EfSiQFuvo" });
});

client.on("resume", () => {
	client.user.setActivity(`${iConfig.prefix}help`, { type: "STREAMING", url: "https://www.youtube.com/watch?v=A8EfSiQFuvo" });
});

client.on("message", (message) => {
	if (message.author.bot || !message.content.startsWith(iConfig.prefix)) return;
	
	let args = message.content.slice(iConfig.prefix.length).split(" ");
	let cmd = args.shift().toLowerCase();
	
	if (!client.cmdList.has(cmd)) return;
	try {
		client.cmdList.get(cmd).run(client, message, args);
	} catch (err) {
		console.error(err);
	}
});

client.login(iConfig.token);