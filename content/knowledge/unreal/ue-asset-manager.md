---
title: Unreal - Asset Manager
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Asset Manager

At a high level, you can use the asset manager to handle loading and unloading of assets at runtime. It is also is used to manage the chunks that data are compiled into (when using chunking).

It communicates with the Asset Register, the system used by the editor to know of all of the assets available, which is in turn used by the Cooker. When something is cooked, changes are it had a reference to it from another asset, discovered from the Asset Registry.

## Video

https://www.youtube.com/watch?v=9MGHBU5eNu0

A great overview, with a lot of details about the system and it's usages
