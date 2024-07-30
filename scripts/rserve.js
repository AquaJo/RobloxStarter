const http = require("http");
const httpProxy = require("http-proxy");
const { exec } = require("child_process");

// Start Rojo server
exec("rojo serve --port 34873", (error, stdout, stderr) => {
	if (error) {
		console.error(`Fehler beim Starten von Rojo: ${error}`);
		return;
	}
	if (stdout) console.log(`Rojo Server Output: ${stdout}`);
	if (stderr) console.error(`Rojo Server Error: ${stderr}`);
});

setTimeout(() => {
	console.log("Waiting for proxy server to start...");
	startProxyServer();
}, 2000);

function startProxyServer() {
	const proxy = httpProxy.createProxyServer({});

	const server = http.createServer((req, res) => {
		console.log(`Intercepted request: ${req.method} ${req.url}`);

		// Forward requests to the Rojo server
		proxy.web(req, res, { target: "http://localhost:34873" }, (error) => {
			if (error) {
				console.error(`Proxy error: ${error}`);
				res.writeHead(500, { "Content-Type": "text/plain" });
				res.end("Proxy error occurred.");
			}
		});
	});

	server.on("error", (error) => {
		console.error(`Proxy server error: ${error}`);
	});

	server.listen(34872, () => {
		console.log("Proxy server listening on port 34872");
	});
}
