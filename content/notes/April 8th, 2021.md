## Todo

* ~Investigate mouse capture in unreal~
* Investigate missing audio in packaged game

## Today I learned (Notes)

* [ue-packaging](../knowledge/unreal/ue-packaging.md)
  * If a file isn't directly reference in editor it will be excludedin cooks / packaged builds. You need to add the directory to the `Additonal Asset Directories to Cook` array in the `Project Settings -> Packaging` menu under advanced
* [ue-project-launcher](../knowledge/unreal/ue-project-launcher.md) 
  * Useful tool to build and deploy the project to a specific device.
  * Advanced mode gives great control over config
    * Variant `*NoEditor`, Config `Development` and Data build `ByTheBook` is a good way to get in editor logging of the entire build process but also logs in realtime of what is happening in game.

## Tomorow's Tasks
