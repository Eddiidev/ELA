# Eddii's Little Additions

A small addon meant to contain the small things I wanted to add to the game~.

**DISCLAIMER :** Currently in very early stage of development, crashes, errors and bugs are to be expected. **USE AT YOUR OWN RISK**

**Will not work properly if not also using LSCG : https://github.com/littlesera/LSCG**

### Tampermonkey:
https://github.com/eddiidev/ELA/raw/main/elaLoader.user.js

Or

### Bookmark: 
```
javascript:(()=>{fetch('https://eddiidev.github.io/ELA/script.js').then(r=>r.text()).then(r=>eval(r));})();
```

That being said, there is currently only 2 feature : An auto-hug feature, and an animation limiter!
Jump on your desired targets and grab them for a big hug when they enter the room!
Futuristic Crates turns your game into a 5 fps slideshow? Here comes the animation limiter! 

List of commands :
- /hugadd (Member Number): Add the specified member to be hugged on sight.
- /hugremove (Member Number): Remove the specified member from the auto-hug list.
- /hugduration (Duration): Set the approximate time between grab and release (in milliseconds). Cannot be shorter than a second. Setting negative numbers disables auto-release.
- /hugstatus: Provides the current auto-hug list and duration.
- /animationlimit enabled/limited/disabled: When enabled, disables animations from restraints almost completely. Limited allows for 2 updates/second, Disabled is normal behavior.

Credits and thanks to Littlesera (LSCG), bananarama92 (MBS), tetris245 (ULTRAbc) for making wonderful addons with readable code that greatly helped me make this one! (Have yoinked some code from these 3 addons to make this all work!)
  
