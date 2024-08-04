// "rojo syncback" (powered by uplift games)
const os = require("os");
if (os.platform() !== "linux") {
	throw new Error(
		"Rojo-Syncback by uplift with ts-mirroring only working in linux as of now due to the direct use of rsync! If you want to try a non-mirroring approach because you don't want to use typescript or whatever, feel free to run 'npm run rssb' (rojo-simple-syncback)",
	);
}

require("dotenv").config();
const RobloxBuilder = require("./classes/RobloxBuilder");

const buildDir = process.env.BUILD_DIR;

const buildSet = new RobloxBuilder(buildDir);

buildSet.runSmartRojoSyncback((error) => {
	if (error) {
		console.error(`Error during file operations: ${error.message}`);
		return;
	}

	console.log("Syncback process completed successfully");
});
