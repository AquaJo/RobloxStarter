const readline = require("readline");
const RobloxStudioManager = require("./classes/RobloxStudioManager");
const { argv } = require("process");
const instance = JSON.parse(argv[2]);
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

let foundChoice = false;
async function start() {
	while (!foundChoice) {
		await new Promise(
			new Promise((resolve, reject) => {
				rl.question("Do you really want to throw your changes away?", (answer) => {
					if (answer.toLowerCase() === "y") {
						foundChoice = true;
						RobloxStudioManager.closeRoblox(true);
						instance.openRobloxStudio();
					} else if (answer.toLowerCase() === "n") {
						foundChoice = true;
					}
					resolve();
				});
			}),
		);
	}
}
