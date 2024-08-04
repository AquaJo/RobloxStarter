const http = require("http");
const httpProxy = require("http-proxy");
const { spawn } = require("child_process");
const process = require("process");
const args = process.argv.slice(2);
let first = true;
let rojoPort;
let proxyPort;

// Default ports
if (0 && args[0] && args[1]) {
	// not yet supported to add custom ports
	rojoPort = args[0];
	proxyPort = args[1];
} else {
	rojoPort = 34873;
	proxyPort = 34872;
}

let rojoProcess;
let proxyServer;

// Start Rojo server
function startRojoServer() {
	rojoProcess = spawn("rojo", ["serve", "--port", rojoPort], { stdio: "inherit" });

	rojoProcess.on("error", (error) => {
		console.error(`Error setting up Rojo server: ${error}`);
	});

	rojoProcess.on("exit", (code) => {
		console.log(`Rojo server exited with code ${code}`);
	});
}

// Start proxy server
function startProxyServer() {
	const proxy = httpProxy.createProxyServer({});

	const server = http.createServer((req, res) => {
		console.log(`Intercepted request: ${req.method} ${req.url}`);
		if (req.method === "GET" && req.url === "/api/first") {
			// Handle the specific GET /api/first request
			console.log("Handling GET /api/first request");
			res.writeHead(200, { "Content-Type": "application/json" });
			if (first) {
				res.end(JSON.stringify({ firstStart: true }));
			} else {
				res.end(JSON.stringify({ firstStart: false }));
			}

			first = false;
		} else {
			// Forward requests to the Rojo server
			proxy.web(req, res, { target: `http://localhost:${rojoPort}` }, (error) => {
				if (error) {
					console.error(`Proxy error: ${error}`);
					res.writeHead(500, { "Content-Type": "text/plain" });
					res.end("Proxy error occurred.");
				}
			});
		}
	});

	server.on("error", (error) => {
		console.error(`Proxy server error: ${error}`);
	});

	server.listen(proxyPort, () => {
		console.log(`Proxy server listening on port ${proxyPort}`);
	});

	return server;
}

// Handle termination signals to clean up
function handleExit(signal) {
	console.log(`Received ${signal}. Closing servers...`);

	if (rojoProcess) {
		rojoProcess.kill();
	}

	if (proxyServer) {
		proxyServer.close(() => {
			console.log("Proxy server closed");
		});
	}

	process.exit();
}

// Set up signal handlers
process.on("SIGINT", () => handleExit("SIGINT"));
process.on("SIGTERM", () => handleExit("SIGTERM"));
process.on("SIGQUIT", () => handleExit("SIGQUIT"));
// Start the servers
startRojoServer();
proxyServer = startProxyServer();

process.stdin.on("data", (data) => {
	const message = data.toString().trim();
	console.log(`Message from parent process: ${message}`);
	if (message === "reset") {
		first = true;
	}
});
