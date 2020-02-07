# osu-map-compilation-script
A small script that help you merge multiple .osu file into 1 map
basically a semi-automated version of this https://osu.ppy.sh/community/forums/topics/49257

### What can it do?
Well, it can merge a bunch of osu standard maps (idk about other modes lol) into one single .osu file with correct timing and slider multiplier (as long as you provide a correct timestamp and the map is not buggy)

### How to use?
You put a bunch of maps (.osu file) into the input folder, name them 1.osu - 2.osu - etc. to determine the position of them in the output map (1-2-3-4-...)
After that run the main.js script, type the number of map you want to merge, the length of each map's audio file in miliseconds, some metadata stuff and you are done, the result map is ready in the output folder

### What will be added?
I don't know, i tried to also merge audio but mp3 is finicky and wacky with all those sample rate and frequency. But i might try it again in the future
Maybe some bug fixes and backward compatibility, but feel free to modify it to your liking and make a pr, i wouldn't mind :D
