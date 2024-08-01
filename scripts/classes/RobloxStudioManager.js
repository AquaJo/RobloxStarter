require("dotenv").config();
const os = require("os");
const path = require("path");
const { execSync, spawn, exec } = require("child_process");
const kill = require("tree-kill");

const fs = require("fs");
const FolderLogics = require("./FolderLogics");
const FileLogics = require("./FileLogics");
const RobloxBuilder = require("./RobloxBuilder");
const ConsoleInterface = require("./ConsoleInterface");

class RobloxStudioManager {
	constructor() {
		this.groupParentColor = "blueBright";
		this.exiting = false; // cleaning
		this.ending = false; // end dialogue
		this.robloxFolder = process.env.ROBLOX_FOLDER;
		this.RobloxBuilder = new RobloxBuilder(process.env.BUILD_DIR);
		if (this.RobloxBuilder.isLinuxBuild()) {
			console.error("Please use a mounted windows path as build path in .env!");
			process.exit(1);
		}
		this.buildFolderLinuxConform = this.RobloxBuilder.buildDir;
		this.buildPath = this.RobloxBuilder.sourceFileWin;
		this.buildFolder = this.RobloxBuilder.buildDirWin;
		this.isWSL = os.platform() === "linux";
		this.windowsHomeDir = null;
		this.pluginsFolder = null;
		this.rojoPluginPath = null;
		this.rojooExists = false;
		this.versionsFolder = null;
		this.robloxStudioPath = null;
		this.consoleInterface = null;

		// Process references
		this.rojoProcess = null;
		this.tscProcess = null;
		this.powershellLinux = null;
		this.windowPowershellPID = null;

		this.initialize();

		// Set up signal handlers
		process.on("SIGINT", () => this.cleanupAndExit());
		process.on("SIGTERM", () => this.cleanupAndExit());
	}
	async beforeDoneError() {
		if (this.exiting) return;
		if (!this.consoleInterface) {
			await this.setupConsoleInterface();
		}
		this.cleanupAndExit();
	}
	async initialize() {
		console.group(await ConsoleInterface.getColoredText("Setting up development environment", "green"));
		await this.build();
		await this.analyzeRobloxFolders();
		await this.checkRojooPlugin();
		await this.startRserve();
		await this.startTypescriptWatching(75, 40);
		await this.openRobloxStudio();
		await this.setupConsoleInterface();
		console.groupEnd();
	}

	async build() {
		try {
			console.group(await ConsoleInterface.getColoredText("Building", this.groupParentColor));
			execSync("npm run build", { stdio: ["ignore", "pipe", "pipe"] });
			console.groupEnd();
		} catch (error) {
			console.error(error);
			await this.beforeDoneError();
		}
	}
	async analyzeRobloxFolders() {
		console.group(await ConsoleInterface.getColoredText("Roblox folder finding", this.groupParentColor));
		if (!this.robloxFolder) {
			if (this.isWSL) {
				const options = { cwd: "/mnt/c/" };
				this.windowsHomeDir = execSync("cmd.exe /C echo %USERPROFILE%", options)
					.toString()
					.replace(/\\/g, "/")
					.trim()
					.replace(/^([A-Z]):/, (_, letter) => `/mnt/${letter.toLowerCase()}`);
			} else {
				this.windowsHomeDir = os.homedir();
				this.windowsHomeDir = FolderLogics.normalize(this.windowsHomeDir);
			}
			this.robloxFolder = `${this.windowsHomeDir}/AppData/Local/Roblox`;
			console.info("Found Roblox folder: " + this.robloxFolder);
		} else {
			console.info("Using given Roblox folder: " + this.robloxFolder);
		}
		this.pluginsFolder = `${this.robloxFolder}/Plugins`;
		this.rojoPluginPath = `${this.pluginsFolder}/Rojoo.rbxm`;
		console.info("Found plugins folder: " + this.pluginsFolder);
		this.versionsFolder = FolderLogics.findNewestModifiedFolder(`${this.robloxFolder}/Versions`);
		console.info("Found most recent Roblox versions folder: " + this.versionsFolder);
		this.robloxStudioPath = `${this.versionsFolder}/RobloxStudioBeta.exe`;
		console.groupEnd();
	}

	async checkRojooPlugin() {
		console.group(await ConsoleInterface.getColoredText("Checking Rojoo-Plugin", this.groupParentColor));
		const rojooMainPath = path.resolve("./plugin/Rojoo.rbxm");
		this.rojooExists = FileLogics.fileExistsSync(this.rojoPluginPath);
		if (this.rojooExists) {
			const rojooMainHash = FileLogics.getHashSync(rojooMainPath);
			const rojooStudioHash = FileLogics.getHashSync(this.rojoPluginPath);
			if (rojooMainHash !== rojooStudioHash) {
				console.info("Replacing older Rojoo-Plugin with newer one");
				FileLogics.copyFileSync(rojooMainPath, this.rojoPluginPath);
			} else {
				console.info("Rojoo-Plugin is up to date");
			}
		} else {
			console.info("Placing Rojoo-Plugin into the plugins folder of Roblox Studio");
			// check if folder exists, else create it
			if (!fs.existsSync(this.pluginsFolder)) {
				fs.mkdirSync(this.pluginsFolder, { recursive: true });
			}
			FileLogics.copyFileSync(rojooMainPath, this.rojoPluginPath);
		}
		console.groupEnd();
	}

	async startRserve() {
		console.info(await ConsoleInterface.getColoredText("Starting proxied rojo-dev-server", this.groupParentColor));
		this.rojoProcess = spawn("npm", ["run", "rserve"], {
			stdio: ["ignore", "ignore", "pipe"],
			shell: false,
		});

		this.rojoProcess.on("error", async (error) => {
			console.error(`Error starting Rojo process: ${error.message}`);
			await this.beforeDoneError();
		});

		this.rojoProcess.on("exit", async (code) => {
			console.log(`Rojo process exited with code ${code}`);
			await this.beforeDoneError();
		});
	}

	async startTypescriptWatching(cols, lines) {
		console.group(await ConsoleInterface.getColoredText("Starting TypeScript watching", this.groupParentColor));
		if (this.isWSL) {
			console.log(
				"Starting PowerShell window mirroring tswatch - logs performed inside WSL2. Be sure to set a valid Windows path in .env when using WSL2!",
			);
			let writePath = path.join(this.buildFolderLinuxConform, "tswatcher.log");
			let writePathWin = path.join(this.buildFolder, "tswatcher.log");
			// mkdirsync on fs.existsSync not needed in theory
			console.log(`Writing TypeScript logs to: ${writePath}`);
			const outputStream = fs.createWriteStream(writePath);
			this.tscProcess = spawn("npm", ["run", "tswatch"], {
				stdio: ["ignore", "pipe", "pipe"],
				shell: false,
			});
			this.tscProcess.stdout.pipe(outputStream);
			this.tscProcess.stderr.pipe(outputStream);
			// now open powershell mirroring the file content

			// Command to open a new PowerShell window
			// Command to open a new PowerShell window
			/* const powershellCommand = `
$process = Start-Process powershell.exe -ArgumentList '-NoExit', '-Command', 'Get-Content -Path \\"${writePathWin}\\" -Wait' -PassThru
$process.Id
`; */

			const powershellCommand = `
$process = Start-Process powershell.exe -ArgumentList '-NoExit', '-Command', 'mode con: cols=${cols} lines=${lines}; Get-Content -Path \\"${writePathWin}\\" -Wait' -PassThru
$process.Id
`;

			this.powershellLinux = spawn("powershell.exe", ["-Command", powershellCommand]);
			this.windowPowershellPID = null;
			this.powershellLinux.stdout.on("data", (data) => {
				if (!this.windowPowershellPID) {
					this.windowPowershellPID = parseInt(data.toString().trim());
					//console.log(`New PowerShell window process ID: ${this.windowPowershellPID}`);
				}
			});
			this.powershellLinux.on("error", async (error) => {
				await this.beforeDoneError();
			});
		} else {
			console.log("Starting Typescript watcher directly from windows");
			const command = "npm run tswatch";
			const newPowerShell = `Start-Process powershell -ArgumentList "-NoExit", "-Command", "${command}"`;
			this.tscProcess = spawn("powershell.exe", ["-Command", newPowerShell], {
				stdio: "inherit",
			});
		}

		this.tscProcess.on("error", async (error) => {
			await this.beforeDoneError();
			console.error(`Error starting TypeScript watcher: ${error.message}`);
		});

		this.tscProcess.on("exit", async (code) => {
			console.log(`TypeScript watcher exited with code ${code}`);
			await this.beforeDoneError();
		});

		console.groupEnd();
	}

	async openRobloxStudio() {
		console.info(
			await ConsoleInterface.getColoredText(
				"Opening Roblox Studio with build: " + this.buildPath,
				this.groupParentColor,
			),
		);
		const command = `"${this.robloxStudioPath}" "${this.buildPath}"`;

		try {
			exec(command, (error, stdout, stderr) => {
				if (!this.ending) {
					if (error) {
						console.error(`Error on opening Roblox Studio with build: ${error.message}`);
						this.beforeDoneError(); // could even happen haver done, but should cancle out nevertheless :D
						return;
					}
					if (stderr) {
						console.error(`Error on opening Roblox Studio with build: ${stderr}`);
						this.beforeDoneError();
						return;
					}
				}
			});
		} catch (err) {
			console.error(`Exception occurred while trying to open Roblox Studio with build: ${err.message}`);
			this.beforeDoneError();
		}
	}

	static rsb() {
		console.warn(
			"Don't do anything while rojo syncback is running please! Also be sure that Ctrl+S is the right shortcut for saving!",
		);
		try {
			execSync("npm run saveRsb", { stdio: "inherit" });
		} catch (error) {
			console.error(error);
		}
	}

	setupConsoleInterface() {
		ConsoleInterface.write("Done, have fun developing in Roblox Studio & feel free using dev-commands \n", "green");
		this.consoleInterface = new ConsoleInterface({
			onExit: () => {
				this.endDialogue();
			},
			onLine: (input) => {
				// handle input if needed
			},
			onData: (currentLine) => {
				// handle data if needed
			},
		});
		this.consoleInterface.addCommandHandler("echo", (args) => {
			console.log(...args);
		});

		function tms() {
			console.log("Syncing with Tarmac");
			try {
				execSync("npm run tms", { stdio: "inherit" });
			} catch (error) {
				console.error(error);
			}
		}
		this.consoleInterface.addCommandHandler(["tarmac", "tm"], (args) => {
			if (args.length < 1) {
				console.log("needing second hand argument");
				return;
			}
			if (args[0] === "sync") {
				tms();
			} else {
				console.log("second argument not valid");
			}
		});
		this.consoleInterface.addCommandHandler("tms", (args) => {
			tms();
		});

		this.consoleInterface.addCommandHandler(["pull", "rsb"], (args) => {
			RobloxStudioManager.rsb();
		});
		this.consoleInterface.addCommandHandler("rojo", (args) => {
			if (args.length < 1) {
				console.log("needing second hand argument");
				return;
			}
			if (args[0] === "syncback") {
				RobloxStudioManager.rsb();
			} else {
				console.log("second argument not valid");
			}
		});
	}
	static closeRoblox(hard) {
		if (!hard) {
			try {
				execSync("npm run stop", { stdio: "inherit" });
			} catch (error) {
				console.error(error);
			}
		} else {
			try {
				execSync("npm run stop -- hard", { stdio: "inherit" });
			} catch (error) {
				console.error(error);
			}
		}
	}
	async endDialogue() {
		this.ending = true;
		console.log("safe prompt for stopping");
		try {
			execSync("npm run promptStop", { stdio: "inherit" });
		} catch (error) {
			console.error(error);
		}
		this.cleanupAndExit();
	}

	async cleanupAndExit() {
		this.exiting = true;
		this.consoleInterface.code = false;
		console.group(await ConsoleInterface.getColoredText("Cleaning up ... and exiting", this.groupParentColor));

		if (this.rojoProcess) {
			kill(this.rojoProcess.pid);
			this.rojoProcess = null;
		}
		if (this.tscProcess) {
			kill(this.tscProcess.pid);
			this.tscProcess = null;
		}
		if (this.powershellLinux) {
			if (this.windowPowershellPID) {
				try {
					const closeCommand = `Stop-Process -Id ${this.windowPowershellPID} -Force`;
					const windowClosePowerShell = spawn("powershell.exe", ["-Command", closeCommand]); // should close on its own
					console.log(`Closed PowerShell window with process ID: ${this.windowPowershellPID}`);
					this.windowPowershellPID = null;
					windowClosePowerShell.on("close", (code) => {
						kill(this.powershellLinux.pid);
						this.powershellLinux = null;
					});
				} catch (e) {
					console.error("Could not close PowerShell window: " + e);
				}
			} else {
				console.log("No PowerShell window to close.");
			}
		}
		const logFilePath = path.join(this.buildFolderLinuxConform, "tswatcher.log");
		if (fs.existsSync(logFilePath)) {
			console.log("removing log-file from " + logFilePath);
			fs.unlinkSync(logFilePath);
		}

		// Optionally wait for a moment to ensure processes are terminated
		setTimeout(() => {
			console.groupEnd();
			this.consoleInterface.code = true;
			process.exit();
		}, 1500);
	}
}

module.exports = RobloxStudioManager;
