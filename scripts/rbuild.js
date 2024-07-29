require("dotenv").config();
const RobloxBuilder = require("./classes/RobloxBuilder");

// Verzeichnispfad aus Umgebungsvariablen
const buildDir = process.env.BUILD_DIR;

// Erstelle eine Instanz der FileOperations-Klasse
const buildSet = new RobloxBuilder(buildDir);

// Verarbeite die Dateien
buildSet.runRojoBuild((err) => {
	if (err) {
		console.error(`Build failed: ${err.message}`);
	} else {
		//console.log("Build succeeded");
	}
});
