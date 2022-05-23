---
title: Unreal - Cameras
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Cameras

## Dynamic Third Person Cameras

* https://magazine.renderosity.com/article/4382/6-tips-for-creating-a-dynamic-third-person-camera-in-unrealengine
  
  * A great article detailing the setup of the Camera Manager in Unreal and example code for setting up modifiers 
    * https://github.com/DaedalicEntertainment/third-person-camera
* `UCameraModifer` has a number of functions that can be overwritten in order to change the camera
  
  * `ProcessViewRotation` allows you to make changes to the `AController`'s Control totaiton which represents the 'true aim' view. 
    * This can be used for effects like making the character look at a Point of Interest or for things like aim correction / snapping.
  * `ModifyCamera` has a couple of empty funcitons for overriding that can be used in blueprint or natively. 
    * The empty version given the the play breaks the `FMinimalView` info out in to function parameters. The base `ModifyCamera` function will look for this as well as any blueprint implimentations and execute them in this order, as well as some other logic.
    * 
