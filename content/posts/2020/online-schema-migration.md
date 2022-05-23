---
title: Online Schema Migration for MySQL
excerpt: 😭
date: 07/01/2020
---

OK, A mistake was made. The database was made with a `latin1` charset in the age of emoji. Sorry I mean Unicode. Should be easy enough to fix. You quickly find out that you want to use the charset `utf8mb4` and the collation `utf8_unicode_ci` for you database / tables / columns, in order to take full advantage how most text is stored today.

## What about Postgres?

This may have been a good chance to migrate over to `PostgreSQL`. There are a lot of good things about it being more useful in a lot more cases, what with it being an Object Relational Data Store, having great GIS extentions, It even has an internal Event system you can hook into (LISTEN / NOTIFY) and a lot mroe mature HSTORE for JSON object storage. In this one project the LISTEN / NOTIFY commands would be killer.

`pgloader` is a recommended tool for making this kind of move. It didn't take much to setup and seemed to copy most of all the data over without too much issue. There were complaints about a couple of keys but that looked like a table order issue, it didn't take the "parent" key table first before then trying to remake the `FKs` for the other table. Easy fix if anything.

However it became very apprently very quickly that changing our code base to use `PostgreSQL` in place of `MySQL` was going to be a lot more effort then I can justify putting in on my own. We don't use `JOOP` or something similar to write abstracted `SQL` and of course `MySQL` is too non-ANSI in places.

## Online Schema Migration

At least 8 has native JSON columns that and a load of performance improvements. We could set up replication and get that part of the upgrade done no problem. Except of course the real issuse is that our schema is incorrect. It  wouldn't take much to just run some `ALTER TABLE...` commands, however that could block the database for an unknown amount of time. 

There are a couple of online transactions tools worth mentioning. `gh-ost`, `pt-online-schema-change`, and some facebook tools mentioned in gh-ost. `gh-ost` seemed really good and after getting some spare databases up in order to test out how it works and if it would work for us, I found that at GitHub, they don't use `FKs` I had actually seen this before it didn't really sink in. Anyway for good reasons, `gh-ost` doesn't like working on tabkes with `FKs` I don't really trust `Perconas` tools on a mysql database and of course mysql doesn't really give you much in the way on online schema changing either.

It seems I'm going to have to investigate the offline route now. What I really want to be able to do is copy over the data, alter it to the new charset and then be able to replicate back up to the latest data from master. 

Thought it worth nothign down some of what I have seen though
