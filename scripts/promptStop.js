const readline = require("readline");
const RobloxStudioManager = require("./classes/RobloxStudioManager");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

let foundChoice = false;
async function start() {
	while (!foundChoice) {
		await new Promise((resolve, reject) => {
			rl.question("Syncback assets before exit (else hard close!)? (y/n) : ", (answer) => {
				if (answer.toLowerCase() === "y") {
					foundChoice = true;
					RobloxStudioManager.rsb();
					RobloxStudioManager.closeRoblox(false);
				} else if (answer.toLowerCase() === "n") {
					foundChoice = true;
					RobloxStudioManager.closeRoblox(true);
				}
				resolve();
			});
		});
	}
	rl.close();
}

start();
