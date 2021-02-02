const { getLyrics, getSong } = require("genius-lyrics-api");

module.exports = {
	name : "lyrics",
	desc : "Get lyrics for a song",
	category : "utility",
	show : true,
	
	run(client, message, args) {
		
		let search = args.join(" ");
		
		let options = {
			apiKey: client.lyricsToken,
			title: search,
			artist: "",
			optimizeQuery: true
		};
		if (search.length > 240) search = search.slice(0, 240);
		let msgEmbed = client.tempEmbeds.basicEmbed("🎵 Lyrics: " + search, "Searching Genius for lyrics...");
		
		let activities = message.author.presence.activities;
		let onSpotify = false, spotify = {};
		if (activities.length > 0) {
			let index = activities.findIndex(item => item.name === "Spotify" && item.type === "LISTENING");
			if (index > -1) {
				spotify.details = activities[index].details;
				spotify.state = activities[index].state;
				onSpotify = true;
			}
		}
		
		message.channel.send({embed : msgEmbed}).then((msg) => {
			
			if (search.length > 0 || onSpotify) {
				
				if (search.length == 0) {
					options.title = spotify.details;
					options.artist = spotify.state;
				}
				
				getSong(options).then((song) => {
				
						if (song !== null) {
							
							if (search.length == 0 && onSpotify) {
								msgEmbed.title += spotify.details + " " + spotify.state;
							}
							
							let lyricSize = song.lyrics.length;
							if (lyricSize > 2047) song.lyrics = song.lyrics.slice(0, 2044) + "...";
							
							msgEmbed.description = song.lyrics;
							msgEmbed.url = song.url;
							msgEmbed.thumbnail = {
								url : song.albumArt
							}
						
						} else {
							msgEmbed.description = "Couldn't find anything!";
						}
				
					msg.edit({embed : msgEmbed});
				});
			
			} else {
				msgEmbed.description = "Can't search nothing!";
				msg.edit({embed : msgEmbed});
			}
		});
	}
}