# Notes For Sunday, October 24th 2021

* \#Jetbrains #IDE #IdeaVim 
  * On a new install there are a lot of bell for actions that do no work, and since I have such a sloppy use of VIM it is really annoying. To disable:

 > 
 > Basically, IdeaVIM reads your `~/.ideavimrc` (`~/.vimrc` pre-v0.35) file and silently ignores any settings it does not understand. Of the bell-related settings, it does not understand `:set noerrorbells`, but it *does* understand `:set visualbell`. And since it has no implementation for a visual bell, it will do nothing and achieve the desired effect. So in your `~/.ideavimrc`, you can use the following:

````
set visualbell
set noerrorbells
````

 > 
 > This will set the (non-functional) visual bell for IdeaVIM while disabling the bell completely for VIM itself.

Curtosy of https://superuser.com/questions/622898/how-to-turn-off-the-bell-sound-in-intellij
