const ffmpeg = require("fluent-ffmpeg")
const audioconcat = require("audioconcat-security-patched")
const mp3duration = require("mp3-duration")
const Lame = require("node-lame").Lame

var songs = []
var isDone = false;

function audio_merge(n = 1, cb) {
    getComponentDuration(1, n, () => {
        if (isDone) {
            cb(songs)
            return
        }
    })
}

function audio_concatenate(songs, cb) {
    var file_list = []
    for (i in songs) {file_list.push(songs[i].file)}
    audioconcat(file_list)
        .concat('output/audio.mp3')
        .on('start', function (command) {
            console.log('ffmpeg process started:', command)
        })
        .on('error', function (err, stdout, stderr) {
            console.error('Error:', err)
            console.error('ffmpeg stderr:', stderr)
        })
        .on('end', function (output) {
            console.error('Audio created in:', output)
            getDuration('output/audio.mp3', () => {
                isDone = true
            })
        })
    cb()
}

function getComponentDuration(i, n, cb) {
    if (i > n) {
        audio_concatenate(songs, () => {
            isDone = true
        })
        cb()
        return
    } 
    else {
        var filename = 'input/' + i + '.mp3' 
        var dest_filename = "input/" + i + "-use.mp3"
        mp3duration(filename, (err, duration) => {
            if (err) return console.log(err.message);
            console.log(filename + ' is ' + duration * 1000 + ' ms long');
            const encoder = new Lame({
                output: dest_filename,
                bitrate: 128,
                resample: 44.1
            }).setFile(filename);

            encoder.encode()
                .then(() => {
                    // Encoding finished
                    getDuration(dest_filename, (length) => {
                        songs.push({
                            file: dest_filename,
                            length: length
                        });
                        getComponentDuration(i + 1, n, cb)
                    })
                })
                .catch(error => {
                    throw error
                });
            })
        cb()
    }
}

function getDuration(filename, cb) {
    mp3duration(filename, (err, duration) => {
        if (err) cb(-1);
        console.log(filename + ' is ' + duration * 1000 + ' ms long');
        cb(duration * 1000)
        //return duration * 1000
    })
}

module.exports.audio_merge = audio_merge
// return;