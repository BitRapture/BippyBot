const {createCanvas, loadImage} = require("canvas");
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");

const placeGridW = 5, placeGridH = 5;
var placeGrid = [0, 0, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0,
				0, 0, 0, 0, 0];

function showImage(message) {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, 200, 200);
	for (let x = 0; x < 5; ++x) {
		for (let y = 0; y < 5; ++y) {
			if (placeGrid[y * placeGridW + x]) {
				ctx.fillStyle = "white";
			} else {
				ctx.fillStyle = "black";
			}
			ctx.fillRect(x * 40, y * 40, (x * 40) + 40, (y * 40) + 40);
		}
	}
	
	message.channel.send("🎮 **Discord r/place**", { files : [canvas.toBuffer()] });
}

module.exports = {
	name : "place",
	desc : "Discord version of r/place",
	category : "fun",
	show : true,
	
	run(client, message, args) {
		if (args.length === 2) {
			if (!isNaN(args[0]) && !isNaN(args[1])) {
				if (args[0] - 1 >= 0 && args[0] - 1 < placeGridW &&
					args[1] - 1 >= 0 && args[1] - 1 < placeGridH) {
					let _x = args[0] - 1, _y = args[1] - 1;
					placeGrid[_y * placeGridW + _x] = !placeGrid[_y * placeGridW + _x];
				}
			}
		}
		
		showImage(message);
	}
}