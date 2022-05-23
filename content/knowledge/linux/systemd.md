---
title: Linux - SystemD
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# SystemD

* `systemctl` - the one stop shop for all service / system related tasks
  * `systemctl [status|start|stop|reload|restart|...] <unit-name>`
    * Basic service control
  * `systemctl enable <unit-name>`
    * Symlinks a unit to start on boot
  * `systemctl list-unit --type=[service|...]`
    * Get a list of installed units
  * `systemctl daemon-reload`
    * Reload units from disk. Requires root
