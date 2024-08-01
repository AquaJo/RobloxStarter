const crypto = require("crypto");
const fs = require("fs");
const fsExtra = require("fs-extra");
class FileLogics {
	/**
	 * Returns the SHA256 hash of the specified file.
	 * @param {string} filePath The path to the file to hash.
	 * @returns {string} synchronious return of a SHA256 hash of the file.
	 */
	static getHashSync(filePath) {
		const hash = crypto.createHash("sha256");
		try {
			// Lies die Datei in kleinen Chunks (Puffern)
			const fileBuffer = fs.readFileSync(filePath);
			hash.update(fileBuffer);
			return hash.digest("hex");
		} catch (err) {
			throw new Error(`Error reading file: ${err.message}`);
		}
	}
	static fileExistsSync(filePath) {
		try {
			return fs.statSync(filePath).isFile();
		} catch (err) {
			return false;
		}
	}
	static copyFileSync(from, to) {
		// recursive copy
		fs.copyFileSync(from, to);
	}
}

module.exports = FileLogics;
