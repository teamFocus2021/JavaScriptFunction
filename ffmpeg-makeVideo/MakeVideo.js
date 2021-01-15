#!/usr/bin/env node
const shell = require('shelljs')

makeVideo();

function makeVideo() {
    if(shell.exec('ffmpeg -i music/1.mp3 -acodec copy -t 5 music/5.mp3').code !== 0) {
    shell.echo('Error: audio cut failed')
    shell.exit(1)
    }
    if(shell.exec('ffmpeg -i music/2.mp3 -acodec copy -t 5 music/6.mp3').code !== 0) {
        shell.echo('Error: audio cut failed')
        shell.exit(1)
    }
    if(shell.exec('ffmpeg -i "concat:music/5.mp3|music/6.mp3" -acodec copy music/output.mp3').code !== 0) {
    shell.echo('Error: audio merge failed')
    shell.exit(1)
    }
    if(shell.exec('ffmpeg -i myvideo.mp4 -i music/output.mp3 -c:v copy -c:a aac -shortest -strict experimental -map 0:v:0 -map 1:a:0 result.mp4').code !== 0) {
        shell.echo('Error: audio and video merge failed')
        shell.exit(1)
    }
}
  

