# Boilerplate for a Roblox-Studio Project configured for WSL2 ^^

## Features

-   "linux first" - stack (rsync used in syncback not ported to windows yet, ...)
-   Uses git-lfs by default for future-proofing
-   Rojo - Filesyncing from vsc to Roblox Studio
-   Rojo syncback from Uplift Games as Two-Way-Sync Option (Experimental!)
-   Variety of npm scripts
-   Roblox-TS integration (also with Rojo Syncback with the help of rsync)
-   Prettier, Eslint formatting & linting & git
-   Workspace added
-   Simple demonstration logic

## Todo

-   readme update
    -   include syncback hint --> don't do anything
-   upload git clone of Rojo(o) --> find solution for question how to include plugin
-   local option for tarmac
-   maybe docker build option as easy to set up build
-   maybe framework integration like [flamework](https://devforum.roblox.com/t/roblox-ts-tutorial-roblox-ts-and-flamework-introduction/1937537)
-   specific kill option in case of kickout while in start?

## How to Setup?

-   Before doing a git clone
    -   Install [git-lfs](https://github.com/git-lfs/git-lfs/wiki/Installation)
    -   Install [node & install dependencies](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) with `npm i`
    -   Install [aftman](https://github.com/LPGhatguy/aftman) & do an `aftman install`
-   in developing - mode as of now : be sure to copy the plugin as "Rojoo.rbxm" in plugin folder!
-   Be sure to include VS-Code plugins!
    -   Install [eslint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    -   Install [roblox-ts plugin](https://marketplace.visualstudio.com/items?itemName=Roblox-TS.vscode-roblox-ts)

### Customization - dotenv

Feel free to add process.env variables for customizing folder-paths.\
Can be useful in case of errors while running scripts or if you want more controll.

Because you probably use WSL2 you should edit `.env.example`'s `BUILD_DIR` to a windows **directory** beginning with `/mnt/` (referencing windows path inside linux machine).\
Be sure to rename the file to `.env`.\
**This way you can temporarily save the build when using referenced BUILD_DIR for rojo syncbacks.**\
A build in `./` is always built on build commands nevertheless.

## Workflow after Setup

### Just want to build once?

Do an `npm run build`, which compiles ts, then compiles to rbxlx-build

### Want to develop?

-   Open build.rbxlx from your .env BUILD_DIR Folder (if first time, do a [build](#just-want-to-build-once))
-   In vsc run `rojo serve` or `npm run rserve` to start uplift-rojo-server
    -   if already in use, feel free to try `npm run rkill`
-   In Roblox-Studio connect to the server via the installed uplift-rojo-plugin (Plugins-Tab)
-   In vsc create new bash and run `npm run tswatch` to start typescript compiling
    -   Didn't includes `tskills` yet, shouldn't rly be a problem nevertheless if you keep track of terminals
-   In vsc program in the ./src typescript-system
-   Feel free create / change / delete models inside Roblox-Studio, but do an occasional `npm run rsb` in a new bash to run a rojo syncback to your out folder and rsync to src folder
    -   A reassurance of proper working through Disconnecting and Reconnecting Rojo on an empty place via the uplift-rojo-plugin might be recommended!
        -   BUT THEN OBJECTS LIKE MESHES MIGHT LOOSE ID IF YOU DO A SYNCBACK AFTER RECONNECTING (/changes in studio)!! --> YOU MIGHT SHOULD DO A BUILD BEFORE RECONNECTING AND OPEN THAT FRESHLY IN ROBLOX STUDIO!
    -   Also be aware of some objects like mesh not updating directly, ... on a new build and open it should load
    -   DONT END SESSIONS UNWISELY WHEN WORKING FULLY-MANAGED-ROJO & DONT HAVE NAME DUPLICATES NO MATTER IF UPPERCASE- OR LOWERCASE-LETTER-MATCH
