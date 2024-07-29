# Boilerplate for a Roblox-Studio Project configured for WSL2 - USED FOR A CAMERA-PROJECT

## Features

-   "linux first" - stack (rsync used in syncback not ported to windows yet, ...), feel free using wsl2 ^^
-   uses git-lfs on default for future-proofing
-   Rojo - Filesyncing from vsc to Roblox Studio
-   Rojo syncback from Uplift Games as Two-Way-Sync Option (Experimental!)
-   variety of npm scripts
-   Roblox-TS integration (also with Rojo Syncback with the help of rsync)
-   Prettier, Eslint formatting & linting & git
-   Workspace added
-   Simple demonstration logic

## Todo

-   probably include [tarmac](https://github.com/rojo-rbx/tarmac) option
-   maybe automate scripts better to make development easier - like closing Roblox Studio before saving ID-lost meshes or sth. --> maybe fixable with tarmac??
-   maybe docker build option as easy to set up build
-   maybe framework intergration like [flamework](https://devforum.roblox.com/t/roblox-ts-tutorial-roblox-ts-and-flamework-introduction/1937537)

## How to Setup?

-   install [git-lfs](https://github.com/git-lfs/git-lfs/wiki/Installation)
-   install [node & install dependencies](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) with `npm i`
-   install [aftman](https://github.com/LPGhatguy/aftman) & do an `aftman install`
-   install roblox [rojo uplift plugin](https://github.com/UpliftGames/rojo/releases/download/v7.4.0-uplift.syncback.rc.14/Rojo.rbxm) (its prerelease!) in Roblox Studio
    -   for this, go to your `AppData\Local\Roblox\Plugins` and place the rbxm inside & restart Roblox-Studio if needed

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
-   in vsc run `rojo serve` or `npm run rserve` to start uplift-rojo-server
    -   if already in use, feel free to try `npm run rkill`
-   in Roblox-Studio connect to the server via the installed uplift-rojo-plugin (Plugins-Tab)
-   in vsc create new bash and run `npm run tswatch` to start typescript compiling
    -   didn't includes `tskills` yet, shouldn't rly be a problem nevertheless if you keep track of terminals
-   in vsc program in the ./src typescript-system
-   feel free create / change / delete models inside Roblox-Studio, but do an occasional `npm run rsb` in a new bash to run a rojo syncback to your out folder and rsync to src folder
    -   a reassurance of proper working through Disconnecting and Reconnecting Rojo on an empty place via the uplift-rojo-plugin might be recommended!
        -   BUT THEN OBJECTS LIKE MESHES MIGHT LOOSE ID IF YOU DO A SYNCBACK AFTER RECONNECTING (/changes in studio)!! --> YOU MIGHT SHOULD DO A BUILD BEFORE RECONNECTING AND OPEN THAT FRESHLY IN ROBLOX STUDIO!
    -   also be aware of some objects like mesh not updating directly, ... on a new build and open it should load
    -   DONT END SESSIONS UNWISELY WHEN WORKING FULLY-MANAGED-ROJO & DONT HAVE NAME DUPLICATES NO MATTER IF UPPERCASE- OR LOWERCASE-LETTER-MATCH
