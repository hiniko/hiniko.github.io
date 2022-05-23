---
title: Powershell - Remote Management
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Powershell Remote Management

* Get a session on the remote PC

````
$cred = get-credential
Enter-PSSession -ComputerName erikmpc -credential $cred
````

* Remote Restart 

````Restart-Computer -ComputerName "WWS-00011" -Force -Credential "WUSHU\shermanr"
````
