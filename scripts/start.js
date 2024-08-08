const RobloxStudioManager = require("./classes/RobloxStudioManager");
const args = process.argv.slice(2);
// Instantiate the class to run everything
//let instance = new RobloxStudioManager("noPluginLoading");
let instance = new RobloxStudioManager(args);
