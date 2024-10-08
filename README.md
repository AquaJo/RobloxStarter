# Boilerplate for a Roblox-Studio Project configured for WSL2

This project is aimed to make Roblox Studio - Visual Studio Code Integration as comfortable as possible in development and also setup, while providing support by default for cool tools that come with external IDE - programming in Roblox.\
For that it accesses Windows from within WSL (e.g. on start) by itself to, for e.g., startup Roblox Studio with the build file.\
Just follow the instructions below and do an `npm start`.\
Not even manual installing of plugins in Roblox Studio is required using aboves cmd.\
**Use this project at your own "risk"!**

## Features

-   "Linux first" - stack (rsync used in syncback & bash usage on plugin build not ported to windows yet, ...)
    -   Windows is kept in mind but isn't tested yet and guaranteed to be limited in functionality
-   Optional [Docker-Build-Dev-Setup & Experience](#with-docker-on-windows-machine) for minimum setup requirements and conflict limiting
-   Uses git-lfs by default for future-proofing (install before copy!)
-   Includes tarmac for the same reason
-   Rojo - file syncing from vsc to Roblox Studio
-   Rojo syncback from Uplift Games as Two-Way-Sync Option (Experimental!)
    -   Now even with an automatic save before option
-   Variety of npm scripts (like `npm run save`)
-   Start-Script as main development process - script
-   Roblox-TS integration (also with Rojo Syncback with the help of rsync)
-   dotenv, Prettier, Eslint formatting & linting & git, ... all the advantages of using an external IDE
-   Workspace added
-   Simple demonstration logic

## How to Setup?

### Without Docker

-   If you previously have set up a docker container for RobloxStarter, be sure to stop it first.\
    Also be sure to stop all processes on http://localhost:34872/ & http://localhost:34873/ in general
-   Before doing a git clone
    -   Install git & [git-lfs](https://github.com/git-lfs/git-lfs/wiki/Installation)
    -   Install [node & install dependencies](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) with `npm i`
        -   Be sure using at least version 19 or sth.
    -   Install [aftman](https://github.com/LPGhatguy/aftman) & do an `aftman install`
-   Be sure to include VS-Code plugins!
    -   Install [eslint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    -   Install [roblox-ts plugin](https://marketplace.visualstudio.com/items?itemName=Roblox-TS.vscode-roblox-ts)
-   Don't want to follow [start-script-practice](#want-to-develop)? --> feel free to `npm run updateSubmodules && npm run updatePlugin`
    -   This diminishes much of the usecase of this project!

### [With docker on Windows-Machine](https://github.com/AquaJo/Windows-Docker-Pipe-for-RobloxStarter)

-   git clone this repository and do `npm run docker` or update the submodule and somehow run [`./docker/buildContainer.ps1`] or use the [submodules repo](https://github.com/AquaJo/Windows-Docker-Pipe-for-RobloxStarter) only.
-   Then work inside the containers `/app`, e.g. with the help of the [Remote-Explorer for Containers in Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
-   Repeat **both** steps each time you start a new session :]

### Customization - dotenv

Feel free to add process.env variables for customizing folder-paths.\
Can be useful in case of errors while running scripts or if you want more control.

Because you probably use WSL2 you should edit `.env.example`'s `BUILD_DIR` to a windows **directory** beginning with `/mnt/` (referencing windows path inside linux machine).\
Be sure to rename the file to `.env`.\
**This way you can temporarily save the build when using referenced `BUILD_DIR` for rojo syncbacks.**\
A build in `./` is always copied on build commands nevertheless.

Also feel free setting `ROBLOX_FOLDER` (shouldn't be necessary in most cases bc script will find it in `%appdata%`).\
Setting `ROBLOSECURITY` ensures saving assets handled via tarmac only on one specific account on roblox. Handy if you are in a team-create and don't want same-hashed assets multiple times. You can receive it by inspecting the cookie data (e.g. through dev-console in the browser).

## Workflow after Setup

### Just want to build once?

Do an `npm run build`, which compiles ts, then compiles to rbxlx-build

### Want to develop?

-   After following [.env recommendations](#customization---dotenv) and above run `npm start`
    -   Running that should result in opening Roblox Studio with the build file while watching vs-code changes and opening a powershell that prints you roblox-ts-watch-logs
-   Also a terminal interface in the main process should appear, which you can interact with (only custom [cmds](#start---commands-development))
-   Do you want to syncback changes you made to models etc. in Roblox Studio?
    -   Run `rojo syncback`
        -   <ins>Note:</ins> this does more than the usual rojo syncback cmd! (saving automatically and using rsync)
    -   Be sure to do nothing while saving is in process and always check if it really saved!
        -   If saving isn't working feel free setting the timeout in the [according ps1](scripts/saveRSProcesses.ps1) higher
        -   Or save by yourself and do an ["rssb"](#start---commands-development)
-   Want to do a tarmac sync? - run `tarmac sync`
-   Want to quit terminal while safely exiting whole development process (including Roblox Studio - Window, other opened windows, processes etc.?)
    -   Run `quit` or just do a `Ctrl+C` and follow the prompting for a save exit-run

If you want to do some things more manually, see the [npm cmds](#npm---commands).

**Be aware that this isn't a fully featured 2-way-sync experience. Be sure to only edit scripts in vsc-code and only work with models etc. in Roblox Studio.**

### Start - Commands (development)

| Command                                | Use Case                                                                                                                    |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `echo <message>`                       | Repeats `<message>`                                                                                                         |
| `quit`, `exit`, `stop`, `Ctrl+C`       | Starts safe terminal-ending-process, on hard exits roblox will close immediately but saves some backups                     |
| `clear`                                | Clears the console                                                                                                          |
| `tarmac sync`, `tm sync`, `tms`        | Syncs tarmac assets                                                                                                         |
| `rojo syncback`, `rsb`, `pull`         | Does an automated saving and rojo syncback on build with rsync afterwards                                                   |
| `rojo syncback nosave`, `rssb`, `rsbn` | Only does `npm run rssb` followed by rsync (so not a normal rssb bc rsync is always done in start-experience)               |
| `reset`                                | Does a build from src & restarts Roblox Studio, throwing unpulled changes away (e.g. if ya mess up parts between syncbacks) |

Commands without options or messages can also be run as e.g. `quit()` instead of just `quit`

### NPM - Commands

| Command                                 | Description                                                                                                                |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `npm run updateRojooSubmodules`         | Downloads specific pointed Rojo(o)-submodules if needed                                                                    |
| `npm run updateRojooSubmodulesToLatest` | Downloads Rojo-submodules if needed and updates Rojoo submodule to latest on remote                                        |
| `npm run updatePlugin`                  | Builds [Rojoo-plugin from git submodule](https://github.com/AquaJo/Rojoo)                                                  |
| `npm run start`                         | Starts developer - experience interface                                                                                    |
| `npm run start -- noPluginLoading`      | Starts developer - experience interface without a new plugin-build                                                         |
| `npm run start -- latest`               | Starts developer - experience interface while updating needed Rojo(o)-Submodules                                           |
| `npm run build`                         | Runs `tsbuild` and `rbuild` (rojo-building) to build the project rbxlx - file                                              |
| `npm run stop`                          | Stops the Roblox Studio Build-Window using the `stop.js` script without **force**-kill roblox window                       |
| `npm run stop -- hard`                  | Does the same as as npm run stop, but closing it forcefully. Roblox will keep auto backups ig                              |
| `npm run promptStop`                    | Runs `promptStop.js` to make an prompted npm run stop with possible rojo syncback (including save and rsync)               |
| `npm run tsbuild`                       | Compiles TypeScript using `rbxtsc` available through `npm install`                                                         |
| `npm run tswatch`                       | Watches TypeScript files and compiles them on changes (to lua) into out                                                    |
| `npm run rbuild`                        | Runs `rbuild.js` to build the project (rojo build, but with .env configuration and copy to `./` etc)                       |
| `npm run rserve`                        | Starts the server using the `rserve.js` script (proxies normal `rojo serve` (maybe for future features))                   |
| `npm run rssb`                          | Runs `rsb.js`, doing a "simple, but else standard" `rojo sync back` without saving before nor rsync into `./src` folder    |
| `npm run rsync`                         | Synchronizes (`./out` to `/src`) files using `rsync` with specific include and exclude patterns (addressing roblox models) |
| `npm run rsb`                           | Runs `rssb` and `rsync` to synchronize files ("my rojo syncback (without save)")                                           |
| `npm run save`                          | Runs `save.js` to save the current state of Roblox-Studio progress **to build file**                                       |
| `npm run saveRsb`                       | Runs `save`, `rssb`, and `rsync` to save the state and synchronize files                                                   |
| `npm run rkill`                         | Terminates `rojo` processes and kills all processes on port 34872 (proxy)                                                  |
| `npm run tms`                           | Runs `tms.js` (a tarmac sync)                                                                                              |
| `npm run docker`                        | Downloads specific pointed docker submodule and executes docker-building with windows piper active                         |
| `npm run dockerLatest`                  | Downloads specific pointed docker submodule, updates to remote and executes docker-building with windows piper active      |
| `npm run updateDocker`                  | Just updates docker submodule to latest commit on main branch without starting build process                               |

## Todo

-   Workflows for docker and whatever
-   Docker submodule optionally with build from here instead of newest main branch? ... (allowing easy own container clone on modified projects)
-   Want to exit? (start terminal)
-   Rsync on build only should remove changed files in out again! / or other solution
-   Local option for tarmac
-   proper handling of y/n when doing rsb in start-terminal
-   more commands, like `save` in start-experience
-   Becoming Windows-friendly
-   Maybe framework integration like [flamework](https://devforum.roblox.com/t/roblox-ts-tutorial-roblox-ts-and-flamework-introduction/1937537)
-   Specific kill option in case of kickout while in start?
-   Make npm start startup / close faster / more efficient
-   Maybe create a github workflow automatically building and releasing rbxm - plugins .... (but not just using it here then --> open source building is fun right?)
-   No sec listener for roblox shutdown on reset
-   Universal accessible reset?
-   Only english comments & more comments in general
