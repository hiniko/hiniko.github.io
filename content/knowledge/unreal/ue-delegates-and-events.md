---
title: Unreal - Delegates and Events
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Delegates And Events

* Delegates and Events are simliar with different semantics.
  
  * Delegates can be `Broadcast` by anyone where as events can only be broadcast by the owner
* Only `DYNAMIC_MULTICAST_DELEGATES` can be accesed from Blueprints. Non dynamic delegates are event are *code only forms*
  
  * This is due to the need to call the delgate by name
  * `DYNAMIC_MULTICAST_DELEGATES` are said to be slower, which would makes sense considering the level of indirection needed to call from blueprint. Avoid use in pure code parts.
* To be used in blueprint it is important to have the property `BlueprintAssignable`

````
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FHitByLaser, FLaserHit, LaserHit);
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FLaserReceiverActivated);
DECLARE_DYNAMIC_MULTICAST_DELEGATE(FLaserReceiverDeactivated);
UCLASS(Blueprintable, ClassGroup=(Custom), meta=(BlueprintSpawnableComponent) )
class LASERFRIENDS_API ALaserReceiver : public AActor
{
    GENERATED_BODY()

public:	

    ... 

    UPROPERTY(BlueprintAssignable, Category = "Laser Receiver Events", Meta = (DisplayName = "Receiver Activated"))
    FLaserReceiverActivated LaserReceiverActivatedDelegate;

    UPROPERTY(BlueprintAssignable, Category = "Laser Receiver Events", Meta = (DisplayName = "Receiver Deativated"))
    FLaserReceiverDeactivated LaserReceiverDeactivatedDelegate;

    ...
}
````

* When defining a struct as the argument it is important that the struct is also a `BlueprintType` if it is planned to be usable in blueprint

````
USTRUCT(BlueprintType)
struct FLaserDestroyedBy {

    GENERATED_BODY()

    UPROPERTY(BlueprintReadOnly)
    ULaser* Laser;

    UPROPERTY(BlueprintReadOnly)
    AActor* DestroyedByActor;
};
````
