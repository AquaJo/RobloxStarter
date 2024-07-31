require("dotenv").config();
let robloxFolder = process.env.ROBLOX_FOLDER;
const os = require("os");
const path = require("path");
const { execSync } = require("child_process");
const FolderLogics = require("./classes/FolderLogics");
const FileLogics = require("./classes/FileLogics");
const RobloxBuilder = require("./classes/RobloxBuilder");
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

const pluginsFolder = robloxFolder + "/Plugins";
const rojoPluginPath = pluginsFolder + "/Rojoo.rbxm";
const rojooExists = FileLogics.fileExistsSync(rojoPluginPath);
// specify the versionsFolder and the studio file exe
const versionsFolder = FolderLogics.findNewestModifiedFolder(robloxFolder + "/Versions");
const robloxStudioPath = versionsFolder + "/RobloxStudioBeta.exe"; // global var needed from openRobloxStudio

/*
	Now before opening Roblox Studio, we want to check the plugins folder to have the newest version of rojoo-plugin in it 
*/
const rojooMainPath = path.resolve("./plugin/Rojoo.rbxm");
if (rojooExists) {
	const rojooMainHash = FileLogics.getHashSync(rojooMainPath);
	const rojooStudioHash = FileLogics.getHashSync(rojoPluginPath);
	console.log(rojooMainHash, rojooStudioHash);
	if (rojooMainHash !== rojooStudioHash) {
		console.log("replacing older Rojoo-Plugin with newer one");
		// override older version of rojoo-plugin with newer one (hashes are not the same anymore)
		FileLogics.copyFileSync(rojooMainPath, rojoPluginPath);
	}
} else {
	// copy file to plugins folder (else no rojoo plugin would exist after start)
	console.log("placing Rojoo-Plugin into the plugins folder of Roblox Studio");
	FileLogics.copyFileSync(rojooMainPath, rojoPluginPath);
}

// after we ensured the rojoo-plugin is placed in plugings-folder of roblox and is up to date, Roblox Studio gets opened with the build file located in buildPath (analyzed before)
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
