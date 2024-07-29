// "rojo syncback" (powered by uplift games)

require("dotenv").config();
const RobloxBuilder = require("./classes/RobloxBuilder");

// Verzeichnispfad aus Umgebungsvariablen
const buildDir = process.env.BUILD_DIR;

// Erstelle eine Instanz der FileOperations-Klasse
const buildSet = new RobloxBuilder(buildDir);

// Verarbeite die Dateien
buildSet.runSmartRojoSyncback((error) => {
	if (error) {
		console.error(`Error during file operations: ${error.message}`);
		return;
	}

	console.log("Syncback process completed successfully");
});
