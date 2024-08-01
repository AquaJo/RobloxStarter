const { exec } = require("child_process");
const RobloxBuilder = require("./classes/RobloxBuilder");
const buildPath = new RobloxBuilder(process.env.BUILD_DIR).sourceFileWin;
const args = process.argv.slice(2);
const FolderLogics = require("./classes/FolderLogics");

const extractor = require("./extractRSProcesses");
let processes = extractor.extract();
if (!processes) {
	console.log("No roblox processes at all found - doing nothing!");
	process.exit(0);
}

let found = false; // found a roblox process that belongs to build?
processes
	.filter((process) => {
		const normalizedBuildPath = FolderLogics.normalize(buildPath);
		const normalizedWindowPath = FolderLogics.normalize(process.WindowTitle);
		return normalizedWindowPath.includes(normalizedBuildPath);
	}) // get process objects that contain the
	.forEach((process) => {
		found = true;
		if (args[0] !== "hard") {
			killProcessById(process.ProcessId, false); // should be the more common use case ...
		} else {
			killProcessById(process.ProcessId, true);
		}
	});

if (!found) {
	console.info("Couldn't find a roblox **build** open - doing nothing!");
}
function killProcessById(processId, hard) {
	const options = { cwd: "/mnt/c/" };
	let command;
	if (!hard) {
		command = `cmd.exe /C taskkill /PID ${processId}`; // without force --> safe option
	} else {
		command = `cmd.exe /C taskkill /PID ${processId} /F`;
	}
	try {
		exec(command, options, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error on sending kill-request to process ${processId}: ${error.message}`);
				return;
			}
			if (stderr) {
				console.error(`Error on sending kill-request to process ${processId}: ${stderr}`);
				return;
			}
			console.log(`Successfully sent kill-request to process ${processId}`);
		});
	} catch (err) {
		console.error(`Exception occurred while trying to kill process ${processId}: ${err.message}`);
	}
}
