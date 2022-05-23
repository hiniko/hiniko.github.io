---
title: "BASH: Starting with best practices"
date: 06/04/2017
description: "It's like working with spit, glue and tongue depressors"
categories:
  - programming
  - nix
tags:
  - bash
  - notes
---

Since I started using Linux and macOS I have spent an increasing amount of time using BASH for more than just it's interactive shell. The thing I want to always remember is that it is is a rich tool that enables you to orchestrate a number of other programs in to working in tandem. 

For some this maybe be a given, but for me who wanted to learn to program first and foremost, I would often forget the principal about reinventing the wheel. Most of the the time, the functionality you want already exists, you just need to tie it together in a way that works for you. Imagine that a program is also a set of functions or libraries that I can use and look how much already exists!

With this view, I often will write a BASH script over writing in a different language, such as Ruby or Python. However it does breed it's own set of challenges and with anything you end up researching and learning new tricks as well as developing your own styles. In the end, sometimes it's better to just use a different environment to get the job done, but as a tool to start out with and re implement later if needed BASH works quite well. 

So I think it is about time I started to note down the many facets of BASH that I come across and keep needing to look up whenever I come back to it. Over the next week I will be noting down good pages I have seen that talk about good bash practices as well as noting down some of my own usage and the issues they cause or show.

## Starting out

As BASH is nothing new, there are a lot of articles and resources out there to keep in consideration when writing your scripts and programs. Here is a list of a couple I keep reading and wish I had started out with.

[BASH Best Practices](http://kvz.io/blog/2013/11/21/bash-best-practices/) offers a boilerplate of options for bash as well as a couple of style practices to make it easier to find errors in your scripts as well as avoiding pitfalls in variable substitutions. My favourite part of this article are the BASH options repeated here for my own reference:

````bash
#!/bin/bash

set -o errexit    # Exit on command errors, fail fast and hard and you will spend less
                  # time scratching your head about odd errors
set -o pipefail   # Return the exit status from the last failed piped command
                  # which can be useful for finding which command in the chain is broken 
set -o nounset    # Exit when a variable is undeclared. Honestly you are just asking for
                  # pain if you're doing this

# Magic variable really feel out of place in bash if you don't consider it on the same level as other programming languages, but honestly you will be saving time here by using these 

# Set magic variables for current file & dir
__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
__file="${__dir}/$(basename "${BASH_SOURCE[0]}")"
__base="$(basename ${__file} .sh)"
__root="$(cd "$(dirname "${__dir}")" && pwd)" # <-- change this as it depends on your app

arg1="${1:-}"
````

[Defensive BASH Programming](http://www.kfirlavi.com/blog/2012/11/14/defensive-bash-programming/) tells of techniques to keep your BASH scripts clean and readable, whilst avoiding scoping issues. It has a few tips on formatting plain text and command line parsing, which is an actual pain to get right if you want short and long option styles (-o vs --option). The most useful parts for me are:

````bash
readonly FOO="bar" # Don't allow this variable to be changed. Can help you not 
                   # make bad decisions

some_function(){
  local FOO="baz" # Use local to ensure that functions do not make global 
                  # changes. Prevents head scratching when odd things 
                  # happen.
}

````

## And so

I will keep this short and sweet for now. I'd rather post about issues as the come up rather than concentrate on writing large and complete articles, if you're interested please checkout the BASH tags for more articles.
