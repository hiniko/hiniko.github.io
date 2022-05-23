---
title: Java and Gradle Notes
description: "Another language, another package manager and build tool"
date: 31/10/2017
categories:
  - projects
  - personal_log
tags:
  - java
  - gradle
  - build tools
  - dependancy managers
---

## Yay, build tools!

OK, here we go. I'm working using Java now, so of course this means I have to learn a bit more about the build tools and dependacy managers that are out there now.

As far as I can see there are really two major contenders out there, [`maven`](https://maven.apache.org/what-is-maven.html) and [`gradle`](https://gradle.org). Both of these are combined dependancy managers and build tools each aimed at being "THE ONE TRUE WAY" of doing things.

I remember `maven` from back at uni though I never really understood what it was for and Java developers had a horrible way of making things seem much more complicated than they had to be. Or maybe I was just that ignorant. To be fair, I struggled with `ant` which is only a build / `make` like tool written in `XML` at the time so...
Since then I have used various tools like this in other languages so the concepts are easy these days; it's just a case of learning how to write the files needed to use the tools so lets do that. 

I don't really have good criteria for learning one system over the other. It seems that there are a couple repositories of packaged `.jar` librires that I can use out there, such as [Maven Central](https://search.maven.org), [MVN Repository](https://mvnrepository.com/repos/central), \[bintray's jcenter\](https://bintray.com/bintray/jcenter.

So I am going to make the decision to use `gradle` based on two things:

1. It was suggested to me
1. It doesn't invole writing `XML` to use

Whilst I am on the topic of build tools how about [this for a StackOverflow question](https://stackoverflow.com/a/1694229)?

Pretty much illistrates the point that people keep reinventing wheels left right and center and ultimately make things harder than they have to be in some cases. 

So! Let's get started with `gradle`, how hard could it be?

## Getting started with `gradle`

`gradle` has a [number of guides](https://gradle.org/guides/#getting-started) on their website about how to use it, and even some [getting started guides](https://guides.gradle.org/creating-new-gradle-builds/). Great, go read them about 10 times and if you understand how to do anything you think you would know how to do in any other build tool, you're a better person than me (not hard though.)

It's probably worth noting I am doing this with direct support for `Eclipse IDE`. Sod writing Java with `vim`.

### Installtion

On all systems the most basic install is download an archive, extracting and then updating your `PATH` to include the `bin/` directory of the extrated archive. A lot like a basic install of `ant`, so, easy enough.

It can be found in `macOS` package managers such as `brew` and `port` and hey apparnetly `Windows` has those too now. Apparently `scoop` for `Windows` has grade in it as well. 

Pick one and run with it.

### Setting up

1. Make a new or go into your existing `Eclipse` project.
1. In a terminal run `gradle init`. It should start a deamon for you, which I hear speeds things up for you during development as it's probably caching some project state between calls to try and speed up your day to day tasks.
1. Observe all of the files that have now now appaeraed. Now is a good time to add all of that to your version control of choice. In other words `git commit` time. 

That is about it for the basic setup process.
It is worth noting, tha that a file called `gradlew` is created. This is a standalone wrapper script designed to make it easy for anyone who hasn't yet install the supposed magic that is this build system to do so, simply by running a `gradle` command as you ususally would through it. It will grab and extract the `gradle` files and make them work, apparently. Not tested it yet.

### `build.gradle`

Right so now we look in the build file itself. If you used the generator you will find that there is a lovely boilerplate made for you, which is enough to get any project started, or at least to give you a small idea of how to intergrate it into an existing project.

The first thing you should notice is that rather than using `XML` it uses a `DSL` written in `Groovy` (something I really should look at one day I guess) to express the tasks, plugins, and dependancies you need in this project. It looks like basic code though so hopefully this is going to be easy. 

Comment out all of the guff and lets get into this.

### Pulgins

The first thing to note when you start using `gradle` is that everything is based around plugins. That is to say, `gradle` is actually a multi purpose build tool with no language specicics dictating it's defualt use. However since it is mostly associated with `java` projects, the generated build file does by default have the `java` plugin. More can be read on the [`java` projects tutorial](https://docs.gradle.org/4.2.1/userguide/tutorial_java_projects.html), but is is safe to say that all of the tools needed to compile, test, build and package `java` projects are contained from within this plugin, so this one is a must in my case.

By adding the `Eclipse` plugin to the build file, it will also allow gradle to manage the `.project` file that is used by `Eclipse` to specify project settings. The main reason to do this is to automatically update the class path and imported libraries configuration in `Eclipse` each time you add or update a dependacy in `gradle`.

There are a good few builtins on the plugin front, which can be spied at from the [Project page](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N149E9) of the docs or in more depths from the [user guide](https://docs.gradle.org/current/userguide/userguide.html). If that doesn't sedate your need to configure the crap out of things, there is also the online plugins community where you can find things like, `AWS` tools, tools for other `JVM` langauges like `kotlin` build process like building `.app` files for `macOS`. 

Crazy. 

### Repositories

Not much to say here, you can configure where `gradle` looks for the dependacies you specify. Handy if you have a really tight internal thing going on but, I'm sure I will just stick with whatever service seems the most trustworthy and popular. (jcenter is currently the default and apparently mirrors to maven central as well.)

### Dependancies

Really this is the main event. How to I list the millons of `.jar` files I have and also should add to my classpath somehow?
