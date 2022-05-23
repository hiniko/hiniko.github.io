---
title: Unreal - Sequences
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Sequences

*"possibly one of the most finicky parts of unreal...:)" - Jonny* 

Sequences are the name for the timeline utilities. From cutscenes to looping event's animations.

## Cameras

From my observations working with cameras and sequences. (4.26)

* Creating `Cine Camera Actor` cameras does add them to the level, however (in PIE at least), they are recreated and deleted on demand. (Currently not sure how this plays with Dollys and cranes). 
  * Referencing any other Camera manually a placed causes and error when saving the sequence that it contains referneces to an external level. This may just be for cameras as you are supposed to be able to refer to actors in tracks.
  * Selecting an asset left behind after a PIE session, before the timeline has had a chance to clean up will likely leave a numbered copy of the camera behind. You can not use this and shouldn't. It goes away when you save the level and when playing the the sequence again you should see the real backing object reappear.

### Cutscene Blending

Two ways this can be done:

#### Using Events and `SetViewTargetWithBlend`

* Create an event track on the camera itself to be able to fire events in the `Sequence Manager`. Doing so will create an event with the reference to the camera yo uwant to manage	
* From here you can use the `Set View Target With Blend` to blend in to the `Cine Camera Actor`
* Ensure the change the start and end points of the cut track in order to make sure that camera is not forcably the used before your blend time if over
* When blending out, make sure to put the blend out event just before the last cut and  **Importantly** ensure to lock the outgoing camera's frame in the blend options. This will stop the camera cutting to an unknown position before the blend starts!

#### Using the cut track

* Much easier and can manage blend curves as expected
* Hit plus on the camera cuts track and select your actor from the level
* A little fiddly when it comes to rearranging cuts overall, but worth the hassle complared to manually firing blends.
* Actors that do not exist before a PIE session can be added during a PIE Session
  * After the session the track name will become red denoting it wasn't found, however it will appear white again when the actor is spanwed again.
