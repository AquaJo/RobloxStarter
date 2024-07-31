require("dotenv").config();
const os = require("os");
const RobloxBuilder = require("./classes/RobloxBuilder");

const buildDir = process.env.BUILD_DIR;
if (os.platform() === "linux" && !buildDir) {
	console.error("please set a build dir in .env pointing to a windows folder using /mnt/c/");
}

const buildSet = new RobloxBuilder(buildDir);

buildSet.runRojoBuild((err) => {
	if (err) {
		console.error(`Build failed: ${err.message}`);
	} else {
		//console.log("Build succeeded");
	}
});
