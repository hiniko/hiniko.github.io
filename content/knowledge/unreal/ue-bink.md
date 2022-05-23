---
title: Unreal - Bink Media Player
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Bink Media Player

## Frame Drop

Had this really annoying issue on a client project, where two "Screens", which were UI Widgets, seem to drop a frame, during switching between them, showing the background scene. 
Spent a while with the assumption it was a timing issue between the hide and show calls for the UI, as if I fram was being drawn during the hide and show.

*Actually The issue was Bink Media Player.*

* It is very important to ensure that the video player is loaded and ready before it is called.
