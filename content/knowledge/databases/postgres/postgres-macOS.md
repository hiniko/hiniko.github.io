---
title: PostgreSQL - Running on macOS
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Postgresql

## Install

* `brew install Postgresql`

## Issues

* Upgrading can leave the database in a state that can't be used. 

* 
  * Effect is that the server, when started with `brew services start postgresql` seems to not run. 
* 
  * `brew services restart -vvv postgresql` will list the settings of the install
* 
  * Log file can be found here (default is `/usr/local/var/log/postgres.log`) to give clues if you need to udpdate the database 
* 
  * Can attempt to upgrade with `brew postgresql-upgrade-database`
* pid from previuos server could still exist, check log (see above) for location and remove file
