const RobloxBuilder = require("./classes/RobloxBuilder");
const path = require("path");
const buildPath = new RobloxBuilder(process.env.BUILD_DIR).sourceFileWin;

const { exec } = require("child_process");
const FolderLogics = require("./classes/FolderLogics");

// powershell-script that extracts open roblox studio windows-data
const scriptPath = path.join(__dirname, "extractRSProcesses.ps1");

// prepare cmd that we want to exec
const command = `powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}"`;

// exec the powershell script in ./ relative to this file
exec(command, (error, stdout, stderr) => {
	if (error) {
		console.error(`Error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.error(`stderr: ${stderr}`);
		return;
	}

	// parse json from powershell output and ensureObjArr in case only one object --> then no array at first by default here
	try {
		let processes = ensureObjArray(JSON.parse(stdout));
		console.log(processes);
		processes
			.filter((process) => {
				const normalizedBuildPath = FolderLogics.normalize(buildPath);
				const normalizedWindowPath = FolderLogics.normalize(process.WindowTitle);
				return normalizedWindowPath.includes(normalizedBuildPath);
			}) // get process objects that contain the
			.forEach((process) => killProcessById(process.ProcessId));
	} catch (err) {
		console.error(`Fehler beim Parsen der JSON-Ausgabe: ${err.message}`);
	}
});

function killProcessById(processId) {
	const command = `cmd.exe /C taskkill /PID ${processId}`; // without force --> safe option
	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Fehler beim Beenden des Prozesses ${processId}: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`Fehlerausgabe beim Beenden des Prozesses ${processId}: ${stderr}`);
			return;
		}
		console.log(`Prozess ${processId} erfolgreich beendet.`);
	});
}

function ensureObjArray(input) {
	return Array.isArray(input) ? input : [input];
}
