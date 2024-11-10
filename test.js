const MUSIC_ARR = ["dori", "pateco", "QWER"];
let isPlay = false;

// 오디오 선언
const audio = document.querySelector(".audio");
let index = 0;

// 현재 인덱스 실행
function musicStart(idx) {
  audio.src = `./assets/music/${MUSIC_ARR[idx]}.mp3`;
  audio.load();
}

// 플레이 버튼 선언
const mainBtn = document.querySelector(".mainBtn");

// 이전, 다음 버튼 선언
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

// 노래 시작

function pauseMusic() {
  mainBtn.classList.remove("play");
  audio.pause();
  console.log("pause");
  isPlay = false;
  mainBtn.style.backgroundImage = "url(./assets/images/svg/play.svg)";
}

// 노래 끝

function playMusic() {
  mainBtn.classList.add("play");
  audio.play();
  mainBtn.style.backgroundImage = "url(./assets/images/svg/pause.svg)";
  mainBtn.style.backgroundRepeat = "no-repeat";
  mainBtn.style.backgroundSize = "contain";
  mainBtn.style.backgroundPosition = "center center";
  console.log("play");
  isPlay = true;
}

// 재생 & 일시정지 이벤트리스너

mainBtn.addEventListener("click", () => {
  console.log(isPlay);

  //pause
  if (isPlay) {
    pauseMusic();
  }

  //play
  else {
    playMusic();
  }
});

// 음악이 끝났다면 자동 다음 곡

audio.addEventListener("ended", () => {
  index += 1;
  if (index >= MUSIC_ARR.length) {
    index = 0;
  }
  musicStart(index);
  albumImg(index);
  playMusic();
});

// 이전 다음 인덱스 설정
nextBtn.addEventListener("click", () => {
  index += 1;
  if (index >= MUSIC_ARR.length) {
    index = 0;
  }
  musicStart(index);
  albumImg(index);
  if (isPlay) {
    playMusic();
  }
});

prevBtn.addEventListener("click", () => {
  index -= 1;
  if (index < 0) {
    index = MUSIC_ARR.length - 1;
  }
  musicStart(index);
  albumImg(index);
  if (isPlay) {
    playMusic();
  }
});

// 앫범 이미지 변경
const album = document.querySelector(".album");

function albumImg(idx) {
  console.log(index);

  const style = document.createElement("style");
  style.textContent = `
    body::before {
      transition: .3s;
      background-image: url('./assets/images/${MUSIC_ARR[idx]}.jpg');
    }
  `;
  document.head.appendChild(style);
  album.style.transition = ".3s";
  album.style.backgroundImage = `url('./assets/images/${MUSIC_ARR[idx]}.jpg')`;
}

window.addEventListener("load", () => {
  albumImg(index);

  musicStart(index);
});
