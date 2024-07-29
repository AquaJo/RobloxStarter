require("dotenv").config();
const os = require("os");
const { execSync } = require("child_process");
const FolderLogics = require("./classes/FolderLogics");
const RobloxBuilder = require("./classes/RobloxBuilder");
let robloxFolder = process.env.ROBLOX_FOLDER;
const buildPath = new RobloxBuilder(process.env.BUILD_DIR).sourceFileWin;
const isWSL = os.platform() === "linux";
let windowsHomeDir;

// locate roblox folder if not given through env
if (!robloxFolder) {
	if (isWSL) {
		windowsHomeDir = execSync("cmd.exe /C echo %USERPROFILE%") // invoke cmd from inside wsl2
			.toString()
			.replace(/\\/g, "/")
			.trim()
			.replace(/^([A-Z]):/, (_, letter) => `/mnt/${letter.toLowerCase()}`);
	} else {
		windowsHomeDir = os.homedir();
		windowsHomeDir = FolderLogics.normalize(windowsHomeDir);
	}
	robloxFolder = windowsHomeDir + "/AppData/Local/Roblox";
}
// specify the versionsFolder and the studio file exe
const versionsFolder = FolderLogics.findNewestModifiedFolder(robloxFolder + "/Versions");
const robloxStudioPath = versionsFolder + "/RobloxStudioBeta.exe"; // global var needed from openRobloxStudio

openRobloxStudio(buildPath);

// Open Roblox Studio using a specific build (filePath is a windows Path, bc roblox is started inside Windows)
function openRobloxStudio(filePath) {
	// command to start roblox studio with rbxlx file defined in filePath
	const command = `"${robloxStudioPath}" "${filePath}"`;

	execSync(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`stderr: ${stderr}`);
			return;
		}
		//console.log(`stdout: ${stdout}`);
	});
}
