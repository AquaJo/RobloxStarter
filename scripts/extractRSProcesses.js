const { execSync } = require("child_process");
const path = require("path");

function ensureObjArray(input) {
	return Array.isArray(input) ? input : [input];
}

function extract() {
	// Path to the PowerShell script
	const scriptPath = path.join(__dirname, "extractRSProcesses.ps1");

	// Prepare the command to execute the PowerShell script
	const command = `powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}"`;

	try {
		// Execute the PowerShell script synchronously
		const stdout = execSync(command, { encoding: "utf-8" }).toString().trim(); // to make it an valid json to handle with in case of docker build
		// Attempt to parse JSON from stdout and ensure it's an array of objects
		try {
			let processes = ensureObjArray(JSON.parse(stdout));
			console.log(processes);
			return processes; // Return the processes for further use
		} catch (parseError) {
			console.error(`Error parsing JSON: ${parseError.message}`);
			return null;
		}
	} catch (error) {
		// Handle errors from execSync
		console.error(`Error executing command: ${error.message}`);
		return null;
	}
}

module.exports = {
	extract,
};
