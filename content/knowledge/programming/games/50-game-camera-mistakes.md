---
title: 50 Game Camera Mistakes
tags:
  - games
  - camera
  - video
  - Sim Sickness
---

# 50 Game Camera Mistakes

* [50 Game Camera Mistakes](https://www.youtube.com/watch?v=C7307qRmlMI)

A 2014 GDC talk about lessons learned making the dynamic camera for Journey. All points are listed below.

\#todo - Sort these out in to sections

1. Using a dynamic camera when another approach would work. 
1. Designing levels and camera behaviors that don't match. 
1. Using global coordinates or quaternions to persist camera state. 
1. Using a default camera distance that's likely to break line-of-sight. 
1. Allowing obstacles to break line-of-sight from the side. 
1. Pushing the camera away from an obstacle while the player is trying to swing the camera towards it. 
1. Letting the player push the camera inside an obstacle. 
1. Letting independent forces compete to push the camera. 
1. Excessively moving the camera to prevent unimportant items from breaking line-of-sight. 
   1.: Letting the camera intersect narrow columns. 
1. Interpreting a hill as a wall to be avoided. 
1. Swinging the camera sideways when occluders come from behind. 
1. Letting the camera's near-clipping-plane intersect the avatar. 
1. Using the same camera distance for all angles. 
1. Using the same field-of-view for worm's eye angles and standard angles. 
1. Shifting pitch, distance, and field-of-view independently. 
1. Not cutting when the avatar passes through opaque objects.
1. Letting cuts remap directional controls. 
1. Breaking the player's sense of direction. 
1. Violating the 180 degree rule.
1. Focusing only on the avatar.
1. Relying on players to control the camera all the time. 
1. Leaving the camera yaw alone while the player is running. 
1. Making it hard to judge distances, 
1. Looking straight ahead as the avatar approaches a cliff. 
1. Keeping the camera level when the avatar is running on a slope. 
1. Misusing the "Rule of thirds". 
1. Using the same logic for ground and air motion. 
1. Relying entirely on procedural camera behaviors. 
1. Letting players make themselves lost and confused. 
1. Rotating excessively to look at nearby targets. 
1. Translating to look at distance targets. 
1. Letting the avatar's own body occlude targets ahead. 
1. Giving the player control over the camera, and then taking it away. 
1. Immediately applying a camera hint after the player finished turning the camera to look at something. 
1. Not letting experts explore. 
1. Not providing inverted controls. 
1. Responding to accidental controller input. 
1. Using linear sensitivity. 
1. Letting the camera pivot drift too far. 
1. Using a too small field-of-view. 
1. Rapidly shifting field-of-view.
1. Excessively shaking the camera. 
1. Bouncing the camera with the avatar's walk cycle. 
1. Translating or rotating up and down when the avatar jumps. 
1. Rapidly transitioning to a new camera position. 
1. Maintaining pitch speed until hitting the pitch limit. 
1. Developing for the Oculus Rift as the primary camera method. 
1. Testing with a narrow demographic.
1. Writing a general "constraint solver" that optimizes for the camera.
