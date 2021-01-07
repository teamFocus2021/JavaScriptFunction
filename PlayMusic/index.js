var audio1 = new Audio("./sound1.mp3");
audio1.volume = 0.5; // 음량 설정 

var audio2 = new Audio("./sound2.mp3");
audio2.volume = 0.5; // 음량 설정

// btn1을 눌렀을 때 sound1.mp3 재생
document.querySelector(".btn1").addEventListener("click", function () {
    if(audio1.paused) {
      audio1.play();
    } else {
      audio1.pause();
    }
  });
   
  // btn2를 눌렀을 때 sound2.mp3 재생
  document.querySelector(".btn2").addEventListener("click", function () {
    if(audio2.paused) {
      audio2.play();
    } else {
      audio2.pause();
    }
  });