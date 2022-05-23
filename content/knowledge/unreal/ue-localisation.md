---
title: Unreal - Localisation
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Localisation in UE4

* Firstly, Read the docs
  
  * https://docs.unrealengine.com/en-US/Gameplay/Localization/Overview/index.html
* `Window -> Localization Dashboard` to bring up UI.
  
  * Most resources talk about this part as if the system is new, however the dashboard is just a new UI to link with the system that was already there in code.
* Set up your gather rules, how you gather these rules has a **direct** effect on how long the `Gather Text` takes take. ![Gather Test Settigns](localization-dashboard-gather-text-setup.png)
  
  * By default nothing is included.
  * You an add include or exclude folders. Only include folders that contain assets / code you care about! This will prevent the gather text from finding hunderers of `FText` variables for things like material names, items not of interest in maps and so on.
  * You can use Wildcards with `foldername/*`
* Ensure to setup the cultures you need.
