---
title: PostgreSQL - User Management
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Postgres User Management

* Watch out for quoting conventions!
  
  * `"foo"` is an identifier, a database, user, column, etc
  * `'bar'` is a contstant, a string or encoding type. e.g. `'UTF8'` 
* Create a user in `psql`:
  
  * `CREATE USER "<username>" WITH PASSWORD '<password>';`
* Create user in shell:
  
  * https://www.postgresql.org/docs/13/app-createuser.html 
  * `createuser <username> -P -e`
    * `-P` password prompt
    * `-e` echo server commands
    * `-s` superuser
* Create a database in `psql`:
  
  * `CREATE DATABASE "<database_name>" WITH OWNER "<username>" encoding 'UTF8';`
* Grant all to user 
  
  * `grant all privileges on database simpletag to simpletag`
* List all tables in `psql`
  
  * `\dt`
* Kill a DB Sesion
  
  * `select * from pg_stat_activity;` to get pidlist
  * `select pg_terminate_backend(pid) from pg_stat_activity where pid = '<pid>';`
* Setup pager for better output
  
  * `less` is usalluy configured by default
  * Set ENV var `$PAGER="less"`
  * `\pset pager on`
* Setup rc file for psql 
  
  * `~/.psqlrc`
