\#Audio / Video Library Notes

\##BSD CLI wrapper for FFMPEG:
https://github.com/bramp/ffmpeg-cli-wrapper

Seems flexible, Allows for thread pooled conversions, does media probing as well. 

## Code Notes

* LibraryDB seems to be file type agnostic
* LibraryFile seems to have a lot of image specific calls
  * Worth breaking up in to various child classes of LibraryFile, or using enums to distinguish type?
* Need a conversion tool class for keeping the functionality of ffmpeg-cli-wrapper neatly out of other places of the code base
