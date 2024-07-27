require("dotenv").config();
const { spawn, exec } = require("child_process");
const path = require("path");
const readline = require("readline");

class RobloxBuilder {
	constructor(buildDir) {
		this.buildDir = buildDir || "./";
		this.sourceFile = path.resolve(this.buildDir, "build.rbxlx");
		this.destinationFile = path.resolve("./build.rbxlx");
		this.equalToSource = path.resolve(this.sourceFile) === path.resolve(this.destinationFile);
	}

	// Copies the source file to the destination file
	copyFile(callback) {
		const cpProcess = spawn("cp", [this.sourceFile, this.destinationFile]);

		cpProcess.stdout.on("data", (data) => {
			console.log(`Copy stdout: ${data}`);
		});

		cpProcess.stderr.on("data", (data) => {
			console.error(`Copy stderr: ${data}`);
		});

		cpProcess.on("close", (code) => {
			if (code !== 0) {
				console.error(`Copy process exited with code ${code}`);
				return callback(new Error(`Copy process exited with code ${code}`));
			}
			console.log("File copied successfully");
			callback(null);
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
		const buildCommand = `rojo build -o "${path.resolve(this.buildDir, "build.rbxlx")}"`;

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