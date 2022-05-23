---
title: "JRuby is making my VIM startup unbearable "
description: One of those face palm moments
date: 22/04/2017
categories:
  - issues
  - vim
tags:
  - vim
  - ruby
  - jruby
  - lazy
  - fixed
---

TLDR: If you use `vim-ruby` and `jruby` you're going to have a bad time. 2.5~ seconds to open or save a file kinda bad time. If you want to have your code properly checked on the version of `ruby` you are working with, tough. Other wise you can add `let g:ruby_path` in your `.vimrc` to configure which `ruby` build you use. Remember that `rvm` can change your `ruby` automatically. so be careful.

I run a VIM run-time like most probably do these days. Lots of plugins to make life a joy in my favourite terminal based text editor. I had it set up real nice. Airplane theme, nice modded power-line fonts, syntax checkers, file browsing, better tab and buffer bars, a really nice status bar, lovely colours. The works!

You don't want to have to think about your text editor when you trying to work, to the point where it gets aggravating to me really quickly to have to do so. So when opening and saving a file is visibly really, really slow, like multiple seconds slow. It really starts to tick me off. 

This starting happening to me a few months ago, and oddly it wasn't consistent. I was *busy* though, so I put off looking at it in depth, again and again. Sometimes it would happen others times it wouldn't. I had started to think it was one of the plugins so this morning I thought I would finally look at it, as it was working on porting a Ruby app from `MRI` to `jruby` and it was getting very annoying to wait so long to edit a gem file repeatedly.

Thanks to a quick google, I found that `vim` has an option `--startuptime <file>` to dump it's startup timings in to a file! Great!

First let try no file:

````
$ vim --startuptime /tmp/vimstartup
<snip>
132.137  000.010: --- VIM STARTED ---
````

Oh, sub second loading? That is how it should be!

Now with a ruby file from this project:

````
$ vim --startuptime /tmp/vimstartup config/routes.rb
$ cat /tmp/vimstartup
<snip>
070.780  000.332: reading viminfo
070.807  000.027: setting raw mode
070.829  000.022: start termcap
070.895  000.066: clearing screen
2351.422  2278.069  2278.069: sourcing /usr/share/vim/vim74/ftplugin/ruby.vim
2352.217  000.456  000.456: sourcing /usr/share/vim/vim74/indent/ruby.vim
2354.229  001.773  001.773: sourcing /usr/share/vim/vim74/syntax/ruby.vim
````

"Bloody hell, 2 seconds to clear the screen? That can't be right." I thought. No, it isn't right you buffoon, read it properly:

`2351.422  2278.069  2278.069: sourcing /usr/share/vim/vim74/ftplugin/ruby.vim`

Oh right, the plugin that runs ruby code to check it's validity. [`vim-ruby`](https://github.com/vim-ruby/vim-ruby)

And then the penny drops. I'm using `RVM`! It switches the version of `ruby` in the environment depending on which project folder I am in. I am working on a `jruby` project now. THE JVM TAKES RELATIVELY EONS TO LOAD UP and I am doing it for each open and save.

Lets prove this I ran:

````
$ rvm use default (ruby-2.3.3 btw)
$ vim --startuptime /tmp/vimstartup
$ cat /tmp/vimstartup
<snip>
131.720  060.401  060.401: sourcing /usr/share/vim/vim74/ftplugin/ruby.vim
<snip>
200.410  000.002: --- VIM STARTED ---
````

Great! 

Whist nice to prove, this doesn't solve the problem. I want my startup times back.
I can add `let g:ruby_path <path>` to my `.vimrc` in order to load a different `ruby`, but I lose the ability to check code on the version of `ruby` I am writing for. Unsure what to do about this right now. I could force the `ruby` to default before starting `vim` I guess? Yuk

D:\<
