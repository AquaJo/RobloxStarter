/**
 * Synchronizes the Roblox project with the Tarmac target using the ROBLOSECURITY cookie
 * stored in the .env file.
 */

// Load environment variables from .env file
require("dotenv").config();
const { execSync } = require("child_process");
const readline = require("readline");

let robloxCookie;
// Access the ROBLOX_COOKIE environment variable
if (process.env.ROBLOSECURITY) {
	let robloxCookieArr = process.env.ROBLOSECURITY.split("|_"); // allow pasting information from roblox before actual, important cookie value
	robloxCookie = robloxCookieArr[robloxCookieArr.length - 1];
} else {
	robloxCookie = undefined;
}
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
	const tarmacCommand = `tarmac sync --target roblox --auth ${robloxCookie}`;

	try {
		// Execute the command synchronously
		const stdout = execSync(tarmacCommand, { encoding: "utf-8" });

		// Log the standard output
		console.log(`stdout: ${stdout}`);
	} catch (error) {
		// Handle errors from execSync
		console.error(`exec error: ${error.message}`);

		// Error details
		if (error.stderr) {
			console.error(`stderr: ${error.stderr.toString()}`);
		} else {
			// If error.stderr is not available, provide a fallback
			console.error(`No stderr available: ${error.toString()}`);
		}

		// Additional error handling can be done here, if needed
	}
}
