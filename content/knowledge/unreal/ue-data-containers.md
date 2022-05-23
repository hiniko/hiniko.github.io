---
title: Unreal - Data Containers
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Data Containers

## `TCircularBuffer<T>`

*Engine/Source/Runtime/Core/Public/Containers/CircularBuffer.h*

* `TArray<T>` backed, with helper elements to manage indexing in a cirular fashion.
* Backing array is `private`
* Can access elements with a provided `[]` operator
* Does not provide internal current index, this need to be tracked outside of the container.
* Capacity must be provided at compile time meaing you must init this in your `UCLASS` as part of the initalizer list if included as a non inited class variable.
  * `SomeClass::SomeClass(const FObjectInitializer& ObjectInitializer)   : Super(ObjectInitializer), PathBuffer(15)`
