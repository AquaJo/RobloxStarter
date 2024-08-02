const { execSync } = require("child_process");
const path = require("path");
const extractor = require("./extractRSProcesses");

// Extract the processes
const processes = extractor.extract();
const scriptPath = path.join(__dirname, "saveRSProcesses.ps1");

processes.forEach((process) => {
	const pid = process.ProcessId;
	const command = `powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}" ${pid}`;

	try {
		// Execute the PowerShell script synchronously
		const output = execSync(command, { encoding: "utf8" });
		
	} catch (error) {
		console.error(`Error executing command for PID ${pid}: ${error.message}`);
	}
});
