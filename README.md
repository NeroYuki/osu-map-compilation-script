# osu-map-compilation-script
A small script that help you merge multiple .osu file into 1 map
basically a semi-automated version of this https://osu.ppy.sh/community/forums/topics/49257

### What can it do?
Well, it can merge a bunch of osu standard maps (idk about other modes lol) into one single .osu file with correct timing and slider multiplier (as long as you provide a correct timestamp and the map is not buggy)

### How to install
- Download the script and dependencies
- If you want to use the audio merging feature, please install required component for [node-lame](https://github.com/devowlio/node-lame) and [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) before using this mode

### How to use?
- You put a bunch of maps (.osu file) into the input folder, name them 1.osu - 2.osu - etc. to determine the position of them in the output map (1-2-3-4-...)
- After that run the main.js script (whether `node main.js` or `npm run`), type the number of map you want to merge, the length of each map's audio file in miliseconds , some metadata stuff and you are done, the result map is ready in the output folder
#### Auto Audio Merging Mode:
- Put all map's audio file (also labeled 1.mp3, 2.mp3, etc. like map file) into the input folder
- When running the script, type -1 as any map's song length and it will skip all song length input. After finishing all metadata input, wait for the script to reencode all mp3 file to the same bitrate and sample frequency, merge all audio files into one, the output audio will be labeled 'audio.mp3' and created in the output folder, after that the .osu file will be created as normal

### What will be added?
- ~~I don't know, i tried to also merge audio but mp3 is finicky and wacky with all those sample rate and frequency. But i might try it again in the future~~ I guess it's a thing now
- Maybe some bug fixes and backward compatibility, but feel free to modify it to your liking and make a pr, i wouldn't mind :D

### Changelog
- **v0.2**: Add Experimental Auto Audio Merging Mode
- **v0.1**: Initial Release
