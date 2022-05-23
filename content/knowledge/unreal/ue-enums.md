---
title: Unreal - Enums
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Enums

## Enum Scoping

* Never use unscoped enums, as values can clash with predefined eums
  * Use `enum class / enum struct` instead:
  * I have had a warning that scroped classes only support `uint8`

````
UENUM(BlueprintType)
enum class ETabBreadcrumb : uint8
{
 None,
 ThingA,
 ThingB
}
````

## Getting the enum name from a value:

* `UEnum::GetValueAsString(value);`
  * Returns an FString, so when logging make sure to dereference!
  * `UE_LOG(LogCat, LogType, TEXT("This is enum %s"), *UEnum::GetValueAsName(value).ToString())`
