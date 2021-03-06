/* ******실행방법***** */
// npm install shelljs
// node MakeVideo.js

const shell = require('shelljs')
const fs = require('fs');

// cutAudio(감정정보, 한 프레임 길이, frame 자른 이미지 이름(시작시간))
// 오디오 자르기
function cutAudio(emotion, duration, frame_num) {
    !fs.existsSync('new') && fs.mkdirSync('new');
    randint = Math.ceil(Math.random() * 10);
    if (shell.exec(`ffmpeg -i http://sehwa98.dothome.co.kr/mp3/${emotion}/${emotion}(${randint}).mp3 -acodec copy -t ${duration} new/${frame_num}.mp3`).code !== 0) {
        shell.echo('Error: audio cut failed')
        shell.exit(1)
    }
    if (fs.existsSync('mylist.txt')) {
        console.log('The path exists.');
        fs.appendFile('mylist.txt', `file \'new/${frame_num}.mp3\'\n`, 'utf8', function (err) {
            if (err) throw err;
          });

        }else{
            fs.writeFile('mylist.txt', `file \'new/${frame_num}.mp3\'\n`, 'utf8', function(error){ console.log('write end') });
        }
};

// 자른 오디오끼리 붙이기
function concatAudio() {
    if (shell.exec('ffmpeg -f concat -i mylist.txt -c copy new/output.mp3').code !== 0) {
        shell.echo('Error: audio merge failed');
        shell.exit(1);
    }
};

// 자른 오디오 합친 거랑 영상 합치기
function mergeVideo(video, new_name) {
    if (shell.exec(`ffmpeg -i ${video} -i new/output.mp3 -c:v copy -c:a aac -shortest -strict experimental -map 0:v:0 -map 1:a:0 ${new_name}.mp4`).code !== 0) {
        shell.echo('Error: audio and video merge failed')
        shell.exit(1)
    }
    //new directory 안에 파일 모두 삭제 후
    fs.readdir('new', (err, files) => {
        if(err)
            console.log(err);
        else{
            for(let file of files){
                fs.unlink('./new/' + file, (err) => {
                    if(err)
                        console.log(err);
                    else{
                    }
                })
            }
            //new directory 삭제
            fs.rmdir("new", () => { 
              });             
            //mylist.txt 삭제
            fs.unlink('mylist.txt', function(err){
                if( err ) throw err;
            });
            //emotions.json 삭제
            fs.unlink('emotions.json', function(err){
                if( err ) throw err;
            });      
        }
    })
    fs.readdir('save_img', (err, files) => {
        if(err)
            console.log(err);
        else{
            for(let file of files){
                fs.unlink('./save_img/' + file, (err) => {
                    if(err)
                        console.log(err);
                    else{
                    }
                })
            }
            //save directory 삭제
            fs.rmdir("save_img", () => { 
              });                  
        }
    })

};

// example
cutVideo('surprise', 5, "0000");
cutVideo('surprise', 3, "0005");
cutVideo('surprise', 2, "0008");
setTimeout(() => concatVideo(), 10);
setTimeout(() => mergeVideo(), 10);


module.exports = makeVideo;


