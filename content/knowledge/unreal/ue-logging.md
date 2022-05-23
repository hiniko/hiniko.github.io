---
title: Unreal - Logging
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Logging

## Logging to Game Window

## UE_LOG

General logging Macro with configurable category and verbosity.

* `UE_LOG(LogTemp, Warning, TEXT("We %s hit %s"), *actor_name, *our_name);`
  * `LogTemp` and `Warning` are the Category  and Verbosity Mask. See engine source `Engine\Source\Runtime\Core\Public\Logging\LogVerbosity.h` for listings
  * The text portion can use `printf` specifiers 
  * when passing `FString`, remember to dereference them so the log can use the underlaying `TCHAR`, 
* Verbosity levels :
  * `NoLogging,  Fatal,  Error, Warning, Display, Log, Verbose, VeryVerbose, All,  VerbosityMask,  SetColor,  BreakOnLog,`     	
  * Docs: https://docs.unrealengine.com/en-US/API/Runtime/Core/Logging/ELogVerbosity__Type/index.html

## CustomLog Categories

* In the header:
  `DECLARE_LOG_CATEGORY_EXTERN(LogCatName, DefaultVerbosity, CompileTimeVerbosity)`

* in the implimentation file
  `DEFINE_LOG_CATEGORY(LogCatName)`

* You should also be able to define these in blunk in a common header, in order to use a more common category without including unrelated files.

### Logging Of Data Types

#### Enums

* Returns an FString, so when logging make sure to dereference!
  * `UE_LOG(LogCat, LogType, TEXT("This is enum %s"), *UEnum::GetValueAsName(value).ToString())`

#### Bools

## UE_VLOG

Logging macros that export data to the [ue-visual-logger](ue-visual-logger.md) allow collection and display of debug data over time.

* `UE_VLOG_LOCATION(AActor* Owner, Category, Verbosity, TEXT("Format"), VarArgs.. )`

* Other Varients exist
  
  * `UE_VLOG_ARROW` - Draw a debug Arrow
  * `UE\_VLOG_\SEGMENT / _THICK` - Draw a line / thick line
  * `UE\_VLOG\_CONE / BOX / CAPSULE` - Draw Shapes
  * Check Visual logger docs for more: https://docs.unrealengine.com/en-US/TestingAndOptimization/VisualLogger/index.html
* Can be wrapped with `[[if]] ENABLE_VISUAL_LOG`

## Logs in Shipping Build

It can be useful the see logs in a shipping build but not in game as the build process is different and can quite often have changes that do not happen in editor.

To enable output logs in shipping:

* Add the following to your modules build target:

````
// enable logs and debugging for Shipping builds  
if (Configuration \== UnrealTargetConfiguration.Shipping)  
{  
 BuildEnvironment \= TargetBuildEnvironment.Unique;  
 bUseChecksInShipping \= true;  
 bUseLoggingInShipping \= true;  
````

* Run the build exe with `-Log` as an argument
  * `Build.exe -Log`
