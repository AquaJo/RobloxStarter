/**
 * Synchronizes the Roblox project with the Tarmac target using the ROBLOSECURITY cookie
 * stored in the .env file.
 */

// Load environment variables from .env file
require("dotenv").config();
const { execSync } = require("child_process");
const readline = require("readline");

// Access the ROBLOX_COOKIE environment variable
const robloxCookieArr = process.env.ROBLOSECURITY.split("|_"); // allow pasting information from roblox before actual, important cookie value
const robloxCookie = robloxCookieArr[robloxCookieArr.length - 1];
/**
 * Checks if the ROBLOSECURITY cookie is defined in the .env file.
 * If not, prompts the user for confirmation before proceeding.
 */
if (!robloxCookie) {
	console.error("Error: ROBLOSECURITY is not defined in the .env file");
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	// Prompt the user for confirmation of proceeding without the ROBLOSECURITY cookie
	rl.question("Do you want to proceed without the ROBLOSECURITY cookie? (y/n): ", (answer) => {
		if (answer.toLowerCase() === "y") {
			// Proceed with the command if the user confirms
			executeTarmacCommand();
		}
		rl.close();
	});
} else {
	console.log("doing authed tarmac sync");
	executeTarmacCommand(robloxCookie);
}

/**
 * Executes the Tarmac command and logs the output.
 */
function executeTarmacCommand(robloxCookie) {
	const tarmacCommand = `tarmac sync --target roblox --auth ${robloxCookie} --verbose --verbose --verbose`;
	execSync(tarmacCommand, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.error(`stderr: ${stderr}`);
	});
}
