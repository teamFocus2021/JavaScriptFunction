// 영상업로드하면 자동으로 음악 입혀져 나오는 기능
const fs = require('fs');
const shell = require('shelljs');

// 업로드하면 얻는 파일 이름을 fime_name 초기화, 파일이름 설정하면 new_name 초기화
const file_name = 'test.mp4';
const new_name = 'new_video.mp4';

toFrame(file_name);
setTimeout(() => faceApi(), 10);
setTimeout(() => makeVideo(), 10);

function makeVideo(){
    const data = JSON.parse(fs.readFileSync('emotions.json', 'utf8'));

    keys = Object.keys(data)
    
    // 첫 번째 값에 대한 처리
    var k = 0;
    if (keys[0] == "0001"){ 
        current_image = keys[0];
        current_emotion = data[current_image];   
    }else{ 
        current_image = "0001";
        current_emotion = data[keys[0]];
        k += 1;
    }
    
    // 오디오 시간 계산
    time = 0;
    var new_image, new_emotion;
    for(var i = k; i < keys.length - 1; i++){
        new_image = keys[i];
        new_emotion = data[new_image];
        time = (new_image - current_image) * 0.5;
        if(current_emotion != new_emotion){
            cutAudio(current_emotion, time, current_image);
            current_image = new_image;
            current_emotion = new_emotion;
            time = 0;
        }
    }
    
    // 마지막 오디오 처리
    time = (new_image - current_image) * 0.5;
    cutAudio(current_emotion, time, current_image);
    
    //함수 동기 실행
    setTimeout(() => concatAudio(), 10);
    setTimeout(() => mergeVideo(file_name, new_name), 10);
}

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
    if (shell.exec(`ffmpeg -i ${video} -i new/output.mp3 -c:v copy -c:a aac -shortest -strict experimental -map 0:v:0 -map 1:a:0 ${new_name}`).code !== 0) {
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
            //mylist.txt 삭제
            fs.unlink('mylist.txt', function(err){
                if( err ) throw err;
            });
            //emotions.json 삭제
            fs.unlink('emotions.json', function(err){
                if( err ) throw err;
            });
            //new directory 삭제
            fs.rmdir("new", () => { 
            });                          
            //save directory 삭제
            fs.rmdir("save_img", () => { 
              });                  
        }
    })
    console.log("---The End---");

};

// 0.5초 간격으로 영상 이미지 처리
function toFrame(file_name){
    !fs.existsSync('save_img') && fs.mkdirSync('save_img');
    if (shell.exec(`ffmpeg -i ${file_name} -vf fps=2 save_img/%04d.jpg`).code !== 0) {
        shell.echo('Error: cut frame failed')
        shell.exit(1)
    }
}

// 감정추출
function faceApi(){
    console.log("---loading---");
    if (shell.exec('python FaceApi.py').code !== 0) {
        shell.echo('Error: python FaceApi failed')
        shell.exit(1)
    }
    console.log("---complete !---");
}
