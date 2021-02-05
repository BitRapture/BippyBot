const https = require("https");
const slashCommands = require("./slashCommands.json");

var optionsPost = {
	hostname: "discord.com",
	port: 443,
	path: "/api/v8/applications/770775077284872202/commands",
	method: "post",
	headers: {
		"Authorization": "Bot ",
		"Content-Type": "application/json",
		"Content-Length": 0
	}
};
var optionsGet = {
	hostname: "discord.com",
	port: 443,
	path: "/api/v8/applications/770775077284872202/commands",
	method: "get",
	headers: {
		"Authorization": "Bot "
	}
};
var optionsDel = {
	hostname: "discord.com",
	port: 443,
	path: "/api/v8/applications/770775077284872202/commands",
	method: "delete",
	headers: {
		"Authorization": "Bot "
	}
};

module.exports = {
	
	commands: new Map(),
	commandNames: [],
	commandsUpToDate: false,
	debugMessages: true,
	
	login(token) {
		
		optionsPost.headers.Authorization += token;
		optionsGet.headers.Authorization += token;
		optionsDel.headers.Authorization += token;
		
	},
	
	get() {
		
		this.commandsUpToDate = false;
		this.commandNames = [];
		
		if (this.debugMessages) console.log("Get Commands: ");
		
		let body = [];
		
		let req = https.request(optionsGet, res => {
			if (this.debugMessages) console.log(res.statusCode);
			if (res.statusCode >= 400) return;
			this.commandsUpToDate = true;
			
			res.on("data", d => {
				body.push(d);
			});
			
			res.on("end", () => {
				body = Buffer.concat(body).toString();
				if (this.debugMessages) console.log(body);
				let data = JSON.parse(body);
				for (let i = 0; i < data.length; i++) {
					this.commands.set(data[i].name, data[i]);
					this.commandNames.push(data[i].name);
				}
			});
			
		});
		req.end();
	},
	
	add() {
		
		this.get();
		
		if (this.commands.size !== slashCommands.length) {
			
			if (this.debugMessages) console.log("Add Commands: ");
			
			for (let i = 0; i < slashCommands.length; i++) {
				if (!this.commands.has(slashCommands[i].name)) {
					
					let body = [];
					
					let data = JSON.stringify(slashCommands[i]);
					optionsPost.headers["Content-Length"] = data.length;
					this.commandsUpToDate = false;
					let req = https.request(optionsPost, res => {
						if (this.debugMessages) console.log(res.statusCode);
						if (res.statusCode >= 400) return;
						this.commandsUpToDate = true;
			
						res.on("data", d => {
							body.push(d);
						});
						
						res.on("end", () => {
							body = Buffer.concat(body).toString();
							if (this.debugMessages) console.log(body);
							let data = JSON.parse(body);
							this.commands.set(data.name, data);
							this.commandNames.push(data.name);
						});
						
					});
					req.write(data);
					req.end();
				}
			}
		}
	},
	
	remove() {
		
		this.commandsUpToDate = false;
		this.commandNames = [];
		
		if (this.debugMessages) console.log("Delete Commands: ");
		
		let body = [];
		
		let req = https.request(optionsGet, res => {
			if (this.debugMessages) console.log(res.statusCode);
			if (res.statusCode >= 400) return;
			this.commandsUpToDate = true;
			
			res.on("data", d => {
				body.push(d);
			});
			
			res.on("end", () => {
				body = Buffer.concat(body).toString();
				let data = JSON.parse(body);
				for (let i = 0; i < data.length; i++) {
					this.commands.set(data[i].name, data[i]);
					this.commandNames.push(data[i].name);
				}
				
				let markForDel = [],
					access = [];
				
				for (let i = 0; i < this.commandNames.length; i++) {
					if (this.findCmd(this.commandNames[i]) < 0) {
						markForDel.push(this.commandNames[i]);
						access.push(i);
						if (this.debugMessages) console.log("Deleting: " + this.commandNames[i]);
					}
				}
				
				for (let i = 0; i < markForDel.length; i++) {
					optionsDel.path = optionsGet.path + "/" + this.commands.get(markForDel[i]).id;
					this.commandsUpToDate = false;
					let req = https.request(optionsDel, res => {
						if (this.debugMessages) console.log(res.statusCode);
						if (res.statusCode >= 400) return;
						this.commandsUpToDate = true;
							
					});
					this.commands.delete(markForDel[i]);
					this.commandNames.splice(access[i], 1);
					req.end();
				}
						
				optionsDel.path = optionsGet.path;
			});
			
		});
		req.end();
	},
	
	update(cmdName) {
		
		if (this.commands.has(cmdName)) {
		
			if (this.debugMessages) console.log("Updating Commands: ");
			
			let body = [];
			
			let req = https.request(optionsPost, res => {
				if (this.debugMessages) console.log(res.statusCode);
				if (res.statusCode >= 400) return;
				this.commandsUpToDate = true;
		
				res.on("data", d => {
					body.push(d);
				});
				
				res.on("end", () => {
					body = Buffer.concat(body).toString();
					if (this.debugMessages) console.log(body);
					let data = JSON.parse(body);
					this.commands.set(data.name, data);
				});
				
			});
			
			let cmd = slashCommands.findIndex(i => i.name === cmdName);
			let data = JSON.stringify(slashCommands[cmd]);
			optionsPost.headers["Content-Length"] = data.length;
			this.commandsUpToDate = false;
			req.write(data);
			req.end();
		}	
	},
	
	findCmd(cmdName) {
		return slashCommands.findIndex(i => i.name === cmdName);
	}
	
}