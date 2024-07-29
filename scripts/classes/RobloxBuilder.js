require("dotenv").config();
const { spawn, exec } = require("child_process");
const path = require("path");
const readline = require("readline");
const fs = require("fs-extra"); // fs-extra importieren
const FolderLogic = require("./FolderLogics");
class RobloxBuilder {
	constructor(buildDir) {
		this.equalToSource = false;
		const projectMain = path.resolve("./");
		this.buildDir = path.normalize(path.resolve(buildDir)) || projectMain;
		this.sourceFile = path.join(this.buildDir, "build.rbxlx");
		this.sourceFileWin = FolderLogic.wslToWindowsInCase(this.sourceFile);
		let firstSegment = buildDir.split(path.sep).find((segment) => segment.length > 0);
		if (firstSegment === "mnt") {
			this.destinationFile = path.resolve("./build_noEditWsl.rbxlx");
		} else if (this.buildDir !== projectMain) {
			this.destinationFile = path.resolve("./build_noEdit.rbxlx");
		} else {
			this.destinationFile = this.sourceFile;
			this.equalToSource = true;
		}
	}

	// Copies the source file to the destination file
	copyFile(callback) {
		fs.copy(this.sourceFile, this.destinationFile)
			.then(() => {
				console.log("File copied successfully");
				callback(null);
			})
			.catch((error) => {
				console.error(`Copy error: ${error}`);
				callback(error);
			});
	}

	// Runs the Rojo syncback command
	runRojoSyncback(callback) {
		const rojoProcess = spawn("rojo", ["syncback", "./", "--input", this.destinationFile], {
			stdio: ["pipe", "pipe", "pipe"], // Pipes stdin, stdout, stderr of the process
		});

		// Listen to the output from the Rojo process
		rojoProcess.stdout.on("data", (data) => {
			process.stdout.write(data); // Forward Rojo stdout to the console
		});

		rojoProcess.stderr.on("data", (data) => {
			process.stderr.write(data); // Forward Rojo stderr to the console
		});

		// Use readline for user input
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		// Listen to user input and pass it to the Rojo process's stdin
		rl.on("line", (input) => {
			rojoProcess.stdin.write(input + "\n");
		});

		rojoProcess.on("close", (code) => {
			if (code !== 0) {
				console.error(`Rojo process exited with code ${code}`);
				return callback(new Error(`Rojo process exited with code ${code}`));
			}
			console.log("Rojo syncback completed successfully");
			callback(null);
		});

		// Close readline when the Rojo process exits
		rojoProcess.on("exit", () => {
			rl.close();
		});
	}

	// Runs Rojo syncback or copies the file and then runs Rojo syncback
	runSmartRojoSyncback(callback) {
		if (this.equalToSource) {
			// If sourceFile and destinationFile are the same, run Rojo syncback directly
			this.runRojoSyncback(callback);
		} else {
			// Otherwise, copy the file first, then run Rojo syncback
			this.copyFile((copyError) => {
				if (copyError) return callback(copyError);

				this.runRojoSyncback(callback);
			});
		}
	}

	// Runs the Rojo build command
	runRojoBuild(callback) {
		const buildCommand = `rojo build -o "${this.sourceFile}"`;

		exec(buildCommand, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error: ${error.message}`);
				return callback(new Error(`Build failed: ${error.message}`));
			}
			if (stderr) {
				console.error(`Stderr: ${stderr}`);
			}
			console.log(`Stdout: ${stdout}`);

			// After the build is done, copy the file if necessary
			if (!this.equalToSource) {
				this.copyFile((copyError) => {
					if (copyError) {
						return callback(copyError);
					}
					console.log("Build and copy completed successfully");
					callback(null);
				});
			} else {
				console.log("Build completed successfully, no copy needed");
				callback(null);
			}
		});
	}
}

module.exports = RobloxBuilder;
