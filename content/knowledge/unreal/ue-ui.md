---
title: Unreal - UI and Widgets
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# UI, Widgets and stuff

## Creating Widgets in Code

* Simple Tutorial 
  * https://www.youtube.com/watch?v=lYfXkxlInVIuuukjA

## Nagivation of UI

* Unreal has a built in system that can handle basic navigation types. 
  * These types are defined in `EUINavigation` and are. `Up Down Left Right Next Previous`
  * Most of the Widgets, will use the `EVisibilty` type and code for each of the widgets to determine which items should be navigated to next
  * Each `EUINavigation` Type can have some behaviour associated with it. These are:
    * `Escape` - Navigation is a allow to leave the bounds of the widget
    * `Stop` - Navigation stops at the bounds of the widget
    * `Wrap` - Navigation will wrap to the opposite bounds of the widget
    * `Explicit` - Navigation will travel to a specified widget
    * `Custom` - Navigation will be decided by calling a function
    * `Custom Boundary` - Navigation will travel to the boundry decided by this Function
  * If `NativeOnKeyDown` is not handeled by the focused widget, Unreal will check the Visibilty and Navigation rules for that in put before.
  * 

### Custom UI Navigation

* The above works well for most simple cases howerer there are times where there is a more complicated setup that it can't handle. In these cases you can provide either a Native or BP function that can return the correct widget that should be focused.
  * An example decleration :
  * `UFUNCTION(BlueprintCallabe) UWidget* Class::FunctionName(EUINavigation Nav)`
  * Here you can write the logic to determin the next focuasable widget and return a pointer to it or `nullptr`
    * \#TODO *what happens in the nullptr case?*
