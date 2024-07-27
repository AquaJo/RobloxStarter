# Boilerplate for a Roblox-Studio Project configured for WSL2

## Features

-   "linux first" - stack, feel free using wsl2
-   Rojo - Filesyncing from vsc to Roblox Studio
-   Rojo syncback from Uplift Games as Two-Way-Sync Option (Experimental!)
-   variety of npm scripts
-   Roblox-TS integration (also with Rojo Syncback with the help of rsync)
-   Prettier, Eslint formatting & linting & git
-   Workspace added
-   Simple demonstration logic

## Todo

-   maybe docker build option as easy to set up build
-   maybe framework intergration like flamework

## How to Setup?

-   install [node & install dependencies](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) with `npm i`
-   install [aftman](https://github.com/LPGhatguy/aftman) & do an `aftman install`
-   install roblox [rojo uplift plugin](https://github.com/UpliftGames/rojo/releases/download/v7.4.0-uplift.syncback.rc.14/Rojo.rbxm) (its prerelease!) in Roblox Studio
    -   for this, go to your `AppData\Local\Roblox\Plugins` and place the rbxm inside & restart Roblox-Studio if needed
-   add .env file with `BUILD_DIR=DIR` where DIR can just be `./`
    -   if on wsl2 inside ubuntu feel free to set a `/mnt/` path to windows and work with the windows-located rbxlx-build (wsl2 might give permission error for Roblox-Studio else on safes)
    -   a current version of the rbxlx-build is copied to `./` nevertheless!

## Workflow after Setup

### Just want to build once?

Do an `npm run build`, which compiles ts, then compiles to rbxlx-build

### Want to develop?

-   Open build.rbxlx from your .env BUILD_DIR Folder (if first time, do a [build](#just-want-to-build-once))
-   in vsc run `rojo serve` or `npm run rserve` to start uplift-rojo-server
    -   if already in use, feel free to try `npm run rkill`
-   in Roblox-Studio connect to the server via the installed uplift-rojo-plugin (Plugins-Tab)
-   in vsc create new bash and run `npm run tswatch` to start typescript compiling
-   in vsc program in the ./src typescript-system
-   feel free create / change / delete models inside Roblox-Studio, but do an occasional `npm run rsb` in a new bash to run a rojo syncback to your out folder and rsync to src folder
    -   a reassurance of proper working through Disconnecting and Reconnecting Rojo on an empty place via the uplift-rojo-plugin might be recommended!
    -   also be aware of some objects like mesh not updating directly, ... on a new build and open it should load
    -   DONT END SESSIONS UNWISELY WHEN WORKING FULLY-MANAGED-ROJO & DONT HAVE NAME DUPLICATES NO MATTER IF UPPERCASE- OR LOWERCASE-LETTER-MATCH
