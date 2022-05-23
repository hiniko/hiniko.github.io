---
title: Unreal - Config Variables
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Config Variables

* You can create custom Client and Server vars as feature or testing switches.
  * To access in editor open the command window (\` by default). 
    
    * It supports fuzzy matching and autocomplete
    * Settings here last the duration of the editor session
  * Vars can be set in `config/*.ini` files. Helpful for persistant testing vars across editor loads. Careful not to submit to VCS by mistake

````
[SystemSettings]
MyNameSpace.MyVar=1
````
