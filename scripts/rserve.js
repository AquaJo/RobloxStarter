// does rojo serve but implements proxy server as forwarder to have more control if needed
// set own ports using args: -- rojoPort proxyPort
const http = require("http");
const httpProxy = require("http-proxy");
const { exec } = require("child_process");
const args = process.argv.slice(2);

let rojoPort;
let proxyPort;
// if args[0] and args[1] are given and port numbers then use them as rojoPort and proxyPort
if (args[0] && args[1]) {
	rojoPort = args[0];
	proxyPort = args[1];
} else {
	rojoPort = 34873;
	proxyPort = 34872;
}

// Start Rojo server
exec("rojo serve --port " + rojoPort, (error, stdout, stderr) => {
	if (error) {
		console.error(`Fehler beim Starten von Rojo: ${error}`);
		return;
	}
	if (stdout) console.log(`Rojo Server Output: ${stdout}`);
	if (stderr) console.error(`Rojo Server Error: ${stderr}`);
});

// starts proxy server that forwards requests to the Rojo server
startPortalServer(proxyPort, rojoPort);

function startPortalServer(port, hostPort) {
	const proxy = httpProxy.createProxyServer({});

	const server = http.createServer((req, res) => {
		console.log(`Intercepted request: ${req.method} ${req.url}`);

		// Forward requests to the Rojo server
		proxy.web(req, res, { target: "http://localhost:" + hostPort }, (error) => {
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

	server.listen(port, () => {
		console.log("Proxy server listening on port " + port);
	});
}
