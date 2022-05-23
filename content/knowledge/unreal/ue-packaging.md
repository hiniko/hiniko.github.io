---
title: Unreal - Packaging
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Packaging

## Project Launcher

* Can be found at `Window->Project Launcher`
  * Useful tool for monitoring and testing builds, for difference devices from the editor
  * Realtime in editor logging during all build stages. Also attaches to new game process for logging. 
  * Great for finding packaging errors, at least on game start.

## Making a Package

### From the Editor

* Can be cound under `File->Package Project`
  * Can quickly access `Packaging Settings` from this menu as well as change `Build Configuration` and `Build Target`
* Uses `BuildCookRun` as you would on command line to produce the build

### From Command Line

* Two ways of approaching this. `AutomationTool` (`UAT`) or `buildcookrun` commandlet

* BuildCookRun can be used like so:

````$PATH_TO_UNREAL_EDITOR BuildCookRun -project="$PATH_TO_PROJECT/$PROJECT.uproject" -noP4 -platform=$PLATFORM -clientconfig=$BUILD_CONFIG -serverconfig=$BUILD_CONFIG -cook -maps=AllMaps -build -compile -stage -pak -archive -archivedirectory="$ARCHIVE_DIR"
````
