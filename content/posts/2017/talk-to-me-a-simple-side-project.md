---
title: "Talk To Me - A 'Simple' Side Project"
description: "Simple perfectly describes me, not what I try and do"
date: 10/07/2017
categories:
  - projects
  - personal_log
tags:
  - ruby
  - rails
  - react
  - javascript
  - design
  - architecture
  - projects
---

## I have a 3 year old nephew, who loves comptuers,

and why shouldn't he? They are everywhere. I can remember the first time I saw anything like a computer. I have memories of playing the NES at the age of 2.

So as his very mature and responsible uncle, it is my duty to guide his journey in the devices that are shaping our entire lives. Since I have studied and practiced computing for more years than I like to think about, especially when considering how inept I am, I think it is important for him to know what to can do for and to him.

This somewhat haphazardly brings us to a great idea that I had one day whilst babysitting him and his smaller sister.

## Text to Speech engines are magic

I mean, I don't know how they work and whilst they sound funny to most, they are pretty understandable. Realising that `macOS` has it's own built in engine, that can be called over the command line with `say` lead to the a good hour worth of having a 3 year old talk to a computer. He treated the computer as a normal person, telling it his wants and asking it questions as he would have any other person he met. His excitement that he could do so made me want to be able to get the computer to talk to him in a way that didn't involve me clunky typing in a terminal window next to him.

Hey! I'm a programmer right? Shelling out to the say command isn't really that hard in Ruby! Lets do it!

## And so, another Ruby project is born

Talk to me is a very simple project in essence. Run a web server on the host mac, connect to it with a phone or laptop and type what you want the computer to say and in what voice you want it to say it in.

This really could be achieved in a simple, POST form data, shell to say in the controller, reload input page and carry on fashion. However what do I really learn from that? No. This is a great time to overcomplicate matters and make life as hard as it can be. 

So with that in mind what I plan is this. A single page web app, that only allows one user at a time to post messages with live feedback about when the `say` process is finished.

It shouldn't be too hard. Rails has a `Web Socekts` framework called Action Cable, which works as a pub/sub `redis` backed communications layer. It also have first class support for background jobs as well, also `redis` backed. So I'm pretty sure I can do this and do it quickly!

For the front end this sounds like the perfect opportunity to get on the `react` train. I already know from experience that `AngularJS` is just confusing in my head in places. So it's time to see what people are making the fuss over. 

I will probably be posting about this project as I get along with it. So, Lets have fun. The aim is to make my nephew have a whale of a time talking to a computer, without me having to directly type to it!
