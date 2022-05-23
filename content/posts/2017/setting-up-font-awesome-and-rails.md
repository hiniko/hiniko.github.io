---
title: Setting up Rails 5 self hosted fonts
description: "You'd think this would have been simpler"
date: 06/07/2017
categories:
  - issues
  - rails
  - ruby
  - assets
tags:
  - ruby
  - reminder
  - fixed
---

[TL-DR; Get to the point](#the_point)

I just started another small side project based on a fresh `rails 5` setup. 

I thought this was a good opportunity to try out a different CSS framework called [Bulma](http://bulma.io/), which I saw mentioned on [Garry's Blog](https://garry.tv/2017/06/16/facepunch-api/). Why not? Small projects are great for trying new things.

`bulma` uses [font-awesome](http://fontawesome.io/) but does not package it in their framework, which is fair. 
They suggest that you use a CDN copy of `font-awesome`. Now, in production I may do such a thing, but:

1. I want to be able to develop offline. There is nothing worse than refreshing a page and it looks like crap because you are in a tunnel on the train.

1. This side project needs to be self hosted so I want to vendor the library rather than rely on CDN's

1. A weak reason, but I remember reading an article I can't find about just how much meta-data is sniffed and compiled about users of CDN's. You can't escape it normally, but why add to it. **Looks for tin hat**

OK! Download `Bulma` and `Font-Awesome` extract them into the relevant `app/assets` in my `rails` app, and start writing the layout template.

It was at this point that I hit the issue that I couldn't see any fonts from `font-awesome`. The inspector told me that the resources were getting 404 and rails told me no such routes existed.

Alright then I must be doing something wrong. Actually as `rails` has a complex assets system using `sprockets` there are a couple more steps that involve editing the `.css` files of font awesome.

<a name="the_point"></a>

1. Create the folder `app/assets/fonts` and place your fonts in there.

1. Edit `config/application.rb` and add `config.assets.paths << Rails.root.join("app", "assets", "fonts")`. This will add the new fonts folder to the assets system, which will allow them to be served.

1. Rename `font-awesome.css` to `font-awesome.css.erb`. This will allow the file to be processed for `erb` snippets.

1. Edit the `css` file, changing all paths to the fonts to `erb` snippets using rails helpers to inject the correct path there: (or just copy and paste this below:

````
src: url('<%= asset_path("fontawesome-webfont.eot") %>');
src: url('<%= asset_path("fontawesome-webfont.eot") + "?#iefix" %>') format('embedded-opentype'), url('<%= asset_path("fontawesome-webfont.woff2") %>') format  ('woff2'), url('<%= asset_path("fontawesome-webfont.woff") %>') format('woff'),
  url('<%= asset_path("fontawesome-webfont.ttf") %>') format('truetype'), url('<%=   asset_path("fontawesome-webfont.svg") + "#fontawesomeregular" %>') format('svg');
````

5. Restart your `rails` server and hey, you should have font. And if you don't well.... Happy hunting.
