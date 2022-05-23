---
title: Unreal - Movement
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Movement

Movement is split between a few components. 

## APlayerController

*Engine/Source/Runtime/Engine/Classes/GameFramework/PlayerController.h*

`UPlayerController` handles input modes and events.

* Contains a rotation to represent a players rotation
  * `AddPitchInput(float Val)`
  * `AddYawInput(float Val)`
  * `AddRollInput(float Val)`
* Contains functions and events for handling input
  * `IsInputKeyDown(FKey Key)`
  * `WasInputKeyJustPressed(FKey Key)`
  * `GetInputVector / GetInputAnalogKeyState / GetMousePos`

## UPawnMovementController

Takes a normalised movment input vector in order and then calculates the output velocity of the Actor it is attached to.

* Inherits from UNavMovmentComponent to allow AI Pathfinding Useful functions exist that can be overloaded
  * `virtual void RequestPathMove(const FVector& MoveInput) override;`
  * `virtual void RequestDirectMove(const FVector& MoveVelocity, bool bForceMaxSpeed) override;`
  * `virtual bool CanStartPathFollowing() const override;`
  * `virtual bool CanStopPathFollowing() const override;`
  * `virtual float GetPathFollowingBrakingDistance(float MaxSpeed) const override;`

## UPathFollowingComponent

Used by the AI Module to determine the next control input needed to move to an actor directly, or to follow a path from the navigation system.
