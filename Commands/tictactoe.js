var usersPlaying = new Map();

function updateGameBoard(piece) {
	return "`"+`${piece[0]}`+"` `"+`${piece[1]}`+"`  `"+`${piece[2]}`+
		   "` \n`"+`${piece[3]}`+"` `"+`${piece[4]}`+"`  `"+`${piece[5]}`+
		   "` \n`"+`${piece[6]}`+"` `"+`${piece[7]}`+"`  `"+`${piece[8]}`+"`";
}
function checkWinning(board) {
	let check = "X",
		ret = 1;
	for (let i = 0; i < 2; ++i) {
		for (let c = 0; c < 3; ++c) {
			if (board[(c * 3)] === check && board[(c * 3) + 1] === check && board[(c * 3) + 2] === check) { return ret; break; }
			if (board[c] === check && board[c + 3] === check && board[c + 6] === check) { return ret; break; }
		}
		if (board[0] === check && board[4] === check && board[8] === check) { return ret; break; }
		if (board[2] === check && board[4] === check && board[6] === check) { return ret; break; }
		check = "O";
		ret = 2;
	}
	return 0;
}

module.exports = {
	name : "tictactoe",
	desc : "Play a game of TicTacToe against Bippy or a Discord member",
	category : "fun",
	show : true,
	
	run(client, message, args) {
		let finalEmbed = client.tempEmbeds.basicEmbed("🎲 TicTacToe", "");
		let userPlaying = usersPlaying.has(message.author.id);
		let boardG = [" ", " ", " ", 
					" ", " ", " ",
					" ", " ", " "];
		let inGame = false
		if (!userPlaying) {
			if (args.length == 0) {
				finalEmbed.description = "**Please specify gamemode** \n``"+client.prfx+"tictactoe com`` : Play against Bippy \n``"
										+client.prfx+"tictactoe online`` : Play against a Discord member";
			} else {
				switch (args[0].toLowerCase()) {
					case "com":
						usersPlaying.set(message.author.id, { mode : "com", opponent : "", turn : true, piece : "X", board : boardG });
						finalEmbed.description = "**Game created: Beginning** \n```"+`${message.author.username} VS Bippy!`+"```";
						message.channel.send(`<@${message.author.id}>`,{embed : finalEmbed});
						finalEmbed.description = updateGameBoard(boardG);
						message.channel.send(`<@${message.author.id}> it's your turn!`, {embed : finalEmbed});
						inGame = true;
						break;
						
					case "online":
						finalEmbed.description = "**Game created: Matchmaking** \n```"+`Join this game: ${client.prfx}tictactoe @${message.author.tag} join`+"```";
						finalEmbed.footer = {text : `Type ${client.prfx}tictactoe quit to stop matchmaking`};
						usersPlaying.set(message.author.id, { mode : "user", opponent : "", turn : false, piece : "X", board : boardG });
						break;
						
					default:
						if (args[0].toLowerCase() === "join" || args.length == 2 && args[1].toLowerCase() === "join") {
							let usr = message.mentions.members.first();
							if (usr !== undefined) {
								if (usr.id === message.author.id) {
									finalEmbed.description = client.tempEmbeds.errMsg("You cannot play against yourself");
									message.channel.send({embed : finalEmbed});
									return;
								}
								if (usersPlaying.has(usr.id)) {
									let player = usersPlaying.get(usr.id);
									if (player.mode === "user" && player.opponent === "") {
										
										let decTurn = Math.round(Math.random());
										usersPlaying.set(message.author.id, { mode : "user", opponent : usr.id, turn : decTurn, piece : (decTurn ? "X" : "O"), board : boardG });
										usersPlaying.set(usr.id, { mode : "user", opponent : message.author.id, turn : !decTurn, piece : (!decTurn ? "X" : "O"), board : boardG });
										finalEmbed.description = "**Game created: Beginning** \n```"+`${usr.user.username} VS ${message.author.username}!`+"```";
										message.channel.send(`<@${usr.id}> & <@${message.author.id}>`,{embed : finalEmbed});
										finalEmbed.description = updateGameBoard(boardG);
										message.channel.send(`<@${(!decTurn ? usr.id : message.author.id)}> it's your turn!`, {embed : finalEmbed});
										inGame = true;
										
									} else finalEmbed.description = client.tempEmbeds.errMsg(usr.user.username+" is already in a game");
								} else finalEmbed.description = client.tempEmbeds.errMsg(usr.user.username+" isn't matchmaking");
							} else finalEmbed.description = client.tempEmbeds.errMsg("No member specified");
						} else {
							finalEmbed.description = "**Please specify gamemode** \n``"+client.prfx+"tictactoe com`` : Play against Bippy \n``"
													+client.prfx+"tictactoe online`` : Play against a Discord member";
						}
				}
			}
		} else if (!inGame) {
			if (args.length > 0 && args[0].toLowerCase() === "quit") {
				usersPlaying.delete(message.author.id);
				finalEmbed.description = "**Matchmaking stopped: "+message.author.username+" quit**";
			} else {
				finalEmbed.description = client.tempEmbeds.errMsg("Currently matchmaking, quit using: "+`${client.prfx}tictactoe quit`);
			}
		}
		
		if (inGame) {
			let filter = m => usersPlaying.has(m.author.id);
			let collector = message.channel.createMessageCollector(filter, {idle : 20000});
			
			collector.on("collect", (m) => {
				let cPlayer = usersPlaying.get(m.author.id);
				if (!cPlayer.turn) return;
				let oPlayer = (cPlayer.mode == "user" ? usersPlaying.get(cPlayer.opponent) : undefined);
				let mArgs = m.content.toLowerCase().split(" ");
				let place = -1;
				
				if (mArgs.length === 1 && !isNaN(mArgs[0]) && mArgs[0] > 0 && mArgs[0] < 10) {
					place = mArgs[0] - 1;
				} else if (mArgs.length === 2) {
					switch (mArgs[0]) {
						case "top":
							switch (mArgs[1]) {
								case "left":
									place = 0;
									break;
								case "center":
								case "centre":
								case "middle":
									place = 1;
									break;
								case "right":
									place = 2;
									break;
							}
						break;
						case "center":
						case "centre":
						case "middle":
							switch (mArgs[1]) {
								case "left":
									place = 3;
									break;
								case "center":
								case "centre":
								case "middle":
									place = 4;
									break;
								case "right":
									place = 5;
									break;
							}
						break;
						case "bottom":
							switch (mArgs[1]) {
								case "left":
									place = 6;
									break;
								case "center":
								case "centre":
								case "middle":
									place = 7;
									break;
								case "right":
									place = 8;
									break;
							}
						break;
					}
				} else if (mArgs.length === 1) {
					if (mArgs[0] === "quit") {
						collector.stop(`${m.author.id}`);
						return;
					}
					if (mArgs[0] === "middle" || mArgs[0] === "center" || mArgs[0] === "centre")
						place = 4;
				}
				let uBoard = cPlayer.board;
				let pMoves = [];
					for (let i = 0; i < uBoard.length; ++i)
						if (uBoard[i] === " ") pMoves.push(i);
				let winning = checkWinning(uBoard);
				
				if (place !== -1 && pMoves.length > 0 && cPlayer.board[place] === " ") {
					uBoard[place] = cPlayer.piece;
					winning = checkWinning(uBoard);
					usersPlaying.set(m.author.id, { mode : "user", opponent : cPlayer.opponent, turn : false, piece : cPlayer.piece, board : uBoard });
					if (oPlayer !== undefined) {
						usersPlaying.set(cPlayer.opponent, { mode : "user", opponent : m.author.id, turn : true, piece : oPlayer.piece, board : uBoard });
						finalEmbed.description = updateGameBoard(uBoard);
						if (winning === 0 && pMoves.length - 1 > 0) message.channel.send(`<@${cPlayer.opponent}> it's your turn!`, {embed : finalEmbed});
					} else {
						finalEmbed.description = updateGameBoard(uBoard);
						message.channel.send(`<@${client.user.id}>'s turn!`, {embed : finalEmbed});
						pMoves = [];
						for (let i = 0; i < uBoard.length; ++i)
							if (uBoard[i] === " ") pMoves.push(i);
						if (pMoves.length > 0) {
							uBoard[pMoves[Math.floor(Math.random() * pMoves.length)]] = "O";
							usersPlaying.set(m.author.id, { mode : "user", opponent : cPlayer.opponent, turn : true, piece : cPlayer.piece, board : uBoard });
								
							finalEmbed.description = updateGameBoard(uBoard);
							winning = checkWinning(uBoard);
							if (winning === 0 && pMoves.length - 1 > 0) 
								message.channel.send(`<@${m.author.id}> it's your turn!`, {embed : finalEmbed});
							else if (winning === 2) 
								message.channel.send({embed : finalEmbed});
						} 
					}
				} 
				
				switch (winning) {
					case 1:
						finalEmbed.description = `**Match completed** \n${m.author.username} won!`;  
						message.channel.send({embed : finalEmbed});
						collector.stop("finished");
						break;
					 
					case 2:
						if (oPlayer !== undefined)
							finalEmbed.description = `**Match completed** \n${m.author.username} won!`; 
						else
							finalEmbed.description = `**Match completed** \nBippy won!`;  
						message.channel.send({embed : finalEmbed});
						collector.stop("finished");
						break;
						
					case 0:
						if (pMoves.length === 0) {
							finalEmbed.description = "It was a tie!"; 
							message.channel.send({embed : finalEmbed});
							collector.stop("finished");
						}
				}
				
			});
			
			collector.on("end", (c, r) => {
				usersPlaying.delete(usersPlaying.get(message.author.id).opponent);
				usersPlaying.delete(message.author.id);
				
				switch (r) {
					case "finished":
						break;
					case "idle":
						finalEmbed.description = `**Game ended** \nIdle timeout`;
						message.channel.send({embed : finalEmbed});
						break;
					default:
						finalEmbed.description = `**Game ended** \nSomeone quit!`;
						message.channel.send({embed : finalEmbed});
				}
			});
			
		} else message.channel.send({embed : finalEmbed});
	}
}