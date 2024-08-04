const readline = require("readline");
const chalkPromise = import("chalk").then((m) => m.default);

class ConsoleInterface {
	constructor({ onExit = () => {}, onLine = () => {}, onData = () => {} } = {}) {
		this.code = true;
		this.promptType = "input";
		this.currentLine = "";
		this.onExit = onExit;
		this.onLine = onLine;
		this.onData = onData;
		this.commandHandlers = new Map(); // Zum Speichern der Befehls-Handler

		this.rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			terminal: true, // Wichtiger Hinweis: terminal muss auf true gesetzt sein
		});

		this.init();
	}

	async init() {
		this.chalk = await chalkPromise;
		this.prompt = this.chalk.magenta(">> ");
		this.updateConsole();
		this.rl.on("line", async (line) => {
			if (this.promptType === "yesno") return;
			const input = line
				.trim()
				.toLowerCase()
				.replace(/\(\s*\)$/, "");
			const inputArgs = input.split(" ");
			const command = inputArgs[0];
			if (this.commandHandlers.has(command)) {
				// Wenn ein Handler für den Befehl existiert, rufe ihn auf
				this.commandHandlers.get(command)(inputArgs.splice(1));
			} else if (input === "exit" || input === "quit" || input === "stop") {
				this.onExit();
			} else if (input === "clear") {
				await this.clearScreen();
			} else {
				this.onLine(input);
			}
		});

		this.rl.on("SIGINT", () => {
			process.stdout.write("\n");
			process.stdout.write("\x1b[2K\r");
			this.onExit();
			//this.code = true;
		});

		process.stdin.on("data", (chunk) => {
			const chunkStr = chunk.toString();
			for (const char of chunkStr) {
				if (char === "\u007F") {
					this.currentLine = this.currentLine.slice(0, -1);
				} else if (char === "\r" || char === "\n") {
					this.currentLine = "";
				} else {
					this.currentLine += char;
				}
			}
			this.updateConsole();
			this.onData(this.currentLine);
		});
	}

	async updateConsole() {
		if (!this.code) return;
		process.stdout.write("\x1b[2K\r");
		const currentLineElements = this.currentLine.split(" ");
		process.stdout.write(
			this.prompt +
				this.chalk.blueBright(currentLineElements[0]) +
				(currentLineElements.length > 1 ? " " + this.chalk.yellow(...currentLineElements.splice(1)) : ""),
		);
	}
	async clearScreen() {
		// ()
		// Clear the console
		console.clear();

		// Clear the scrollback buffer by printing newlines
		process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
		console.clear();

		// Move cursor to top-left position
		process.stdout.write("\u001b[H");

		// Clear from cursor to end of screen
		process.stdout.write("\u001b[0J");

		// Clear readline history
		if (this.rl && this.rl.history) {
			this.rl.history = [];
		}

		// Redraw the prompt if in readline interface
		if (this.rl && this.rl.prompt) {
			this.rl.prompt();
		}
	}

	close() {
		this.rl.close();
	}

	// Methode zum Hinzufügen eines Handlers für einen bestimmten Befehl
	addCommandHandler(command, handler) {
		if (Array.isArray(command)) {
			for (const c of command) {
				this.addCommandHandler(c, handler);
			}
		} else {
			this.commandHandlers.set(command.trim().toLowerCase(), handler);
		}
	}

	removeCommandHandler(command) {
		this.commandHandlers.delete(command.trim().toLowerCase());
	}

	async askYesNoQuestion(question) {
		this.prompt = this.chalk.hex("#FFA500")(">>> ");
		this.promptType = "yesno";
		console.log(this.chalk.red(question));

		let answer = await new Promise((resolve) => {
			const self = this;
			function _resolve(val) {
				self.rl.removeListener("line", onLine);
				resolve(val);
			}
			async function onLine(line) {
				const input = line.trim().toLowerCase();
				if (input === "y" || input === "yes") {
					_resolve(true);
				} else if (input === "n" || input === "no") {
					_resolve(false);
				} else {
					console.log(self.chalk.red("Invalid input. Please enter 'y(es)' or 'n(o)'."));
				}
			}
			this.rl.on("line", onLine);
		});

		this.prompt = this.chalk.magenta(">> ");
		this.promptType = "input";
		this.updateConsole();
		return answer;
	}

	static async write(text, color) {
		const chalk = await chalkPromise;
		process.stdout.write(color ? chalk[color](text) : text);
	}

	static async getColoredText(text, color) {
		const chalk = await chalkPromise;
		return chalk[color](text);
	}
}

module.exports = ConsoleInterface;
