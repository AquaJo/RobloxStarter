const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
class FolderLogics {
	static findNewestModifiedFolder(dirPath) {
		try {
			// Lesen des Verzeichnisses
			const files = fs.readdirSync(dirPath);

			// Filtern der Verzeichnisse
			const directories = files.filter((file) => {
				const fullPath = path.join(dirPath, file);
				return fs.statSync(fullPath).isDirectory();
			});

			if (directories.length === 0) {
				throw new Error("No directories found.");
			}

			// Ermitteln des neuesten Verzeichnisses
			const latestDir = directories.reduce(
				(latest, dir) => {
					const fullPath = path.join(dirPath, dir);
					const stats = fs.statSync(fullPath);
					return stats.mtime > latest.stats.mtime ? { dir, stats } : latest;
				},
				{ dir: null, stats: { mtime: new Date(0) } },
			);

			return path.join(dirPath, latestDir.dir);
		} catch (error) {
			console.error("Error:", error.message);
			return null;
		}
	}
	static findFirstFolderWithFile(dirPath, fileName) {
		try {
			// Read the directory
			const files = fs.readdirSync(dirPath);

			// Filter the files
			const directories = files.filter((file) => {
				const fullPath = path.join(dirPath, file);
				return fs.statSync(fullPath).isDirectory();
			});

			if (directories.length === 0) {
				throw new Error("No directories found.");
			} else {
				for (const folderName of directories) {
					const fullPath = path.join(dirPath, folderName);
					if (fs.existsSync(path.join(fullPath, fileName))) {
						return fullPath;
					}
				}

				return null;
			}
		} catch (error) {
			console.error("Error:", error.message);
			return null;
		}
	}
	/**
	 * turn WSL-Path into windows-path
	 * @param {string} wslPath - WSL-Path (/mnt/) (in case)
	 * @returns {string} - to windowsPath or just input if not proper wsl-path
	 */
	static wslMntToWindowsInCase(wslPath) {
		if (wslPath.startsWith("/mnt/")) {
			return wslPath
				.replace(/^\/mnt\/([a-z])\//i, (_, drive) => `${drive.toUpperCase()}:\\`)
				.replace(/\\/g, "/")
				.trim();
		} else {
			return wslPath;
		}
	}
	static wslPathToWindowsPath(wslPath) {
		return execSync(`wslpath -w ${wslPath}`).toString().trim();
	}

	static normalize(inputPath) {
		// do a replace of \s in addition to path.normalize
		let normalizedPath = path.normalize(inputPath);
		normalizedPath = normalizedPath.replace(/\\/g, "/").trim();
		return normalizedPath;
	}
	static normalizeLower(inputPath) {
		let normalizedPath = path.normalize(inputPath);
		normalizedPath = normalizedPath.toLowerCase();
		normalizedPath = normalizedPath.replace(/\\/g, "/");
		return normalizedPath;
	}
}

module.exports = FolderLogics;
