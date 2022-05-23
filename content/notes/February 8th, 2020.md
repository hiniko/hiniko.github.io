## \#facebook-unity-sdk

* Adding #facebook-unity-sdk to a unity app has been a pain
* Import the package was trivial at first however, the menu it adds would not work for some reason at first.
* Making the build process for IOS work after the fact was also a pain in the ass
  * Firstly it uses `CocoaPods` an app / xCode package manager in order to pull the underlying `facebook-ios-sdk` packages down however that in it self was not enough to get things godoing
  * Had to install CocoaPods using `brew`
  * Ensure that the project includes a subproject for the pods in xCode which if you pods installation is missing can happen after a bit of `brew link` that went away after getting unity to rebuild the ios poroject
  * The package uses `clang` modules so that had to be enabled as a build option
    * This could be done in xCode however we have a post processing script of as part of the unity build process for the xCode project, (Helpful to look at unity cloud build resources here) and it's better off living there for reproducible builds.
    * 
      ````// Enable clang imports for FBSDK cocoa pod
      ````

pbxProject.SetBuildProperty("CLANG_ENABLE_MODULES", "YES");\``` 
- `FBSDKCOCOAPODS` is needed as a `GCC_PREPROCESSOR_FLAG` to enable the build to use the cocoapods installation of the sdk
- For some reason doing this then requires that we have the `libsqlite3.tbd` library imported in order to compile properly. Perhaps the sdk needs this?
