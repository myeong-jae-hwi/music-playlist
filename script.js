const MUSIC_ARR = ["dori", "pateco", "QWER", "HAPPY"];
const TITLE = ["헤어지자", "너를 떠올리는 중이야", "내이름 맑음", "HAPPY"];
let isPlay = false;

// 오디오 선언
const audio = document.querySelector(".audio");
let index = 0;

(function () {
  // 스펙트럼 막대 개수
  let NUM_OF_BARS = 40;
  let bottomMargin = 20;

  // 오디오 컨텍스트와 분석기 생성
  const ctx = new AudioContext();
  const audioSource = ctx.createMediaElementSource(audio);
  const analyzer = ctx.createAnalyser();
  audioSource.connect(analyzer);
  audioSource.connect(ctx.destination);

  // 주파수 데이터를 담을 배열 초기화
  const frequencyData = new Uint8Array(analyzer.frequencyBinCount);

  // 시각화 컨테이너
  const visualizerContainer = document.querySelector(".visualizer-container");

  // 막대 초기화 함수
  function initializeVisualizer() {
    visualizerContainer.innerHTML = "";

    for (let i = 0; i < NUM_OF_BARS; i++) {
      const bar = document.createElement("DIV");
      bar.setAttribute("id", "bar" + i);
      bar.setAttribute("class", "visualizer-container__bar");
      visualizerContainer.appendChild(bar);
    }
  }

  // 초기 막대 생성
  initializeVisualizer();

  // 화면 크기 변경 감지하여 막대 개수 조정
  const mediaQuery = matchMedia("screen and (min-width: 480px)");

  // 미디어 쿼리 변경 이벤트 핸들러
  function handleResize(e) {
    NUM_OF_BARS = e.matches ? 40 : 30;
    bottomMargin = e.matches ? 0 : 20;

    visualizerContainer.style.bottom = `${bottomMargin}px`;

    initializeVisualizer();
  }

  // 이벤트 리스너 추가
  mediaQuery.addEventListener("change", handleResize);

  // 초기 상태 설정
  handleResize(mediaQuery);

  function renderFrame() {
    analyzer.getByteFrequencyData(frequencyData);

    for (let i = 0; i < NUM_OF_BARS; i++) {
      const fd = frequencyData[i * 10];
      const bar = document.querySelector(`#bar${i}`);
      if (bar) {
        const barHeight = fd || 0;
        bar.style.height = `${barHeight / 5}px`;
      }
    }
    requestAnimationFrame(renderFrame);
  }

  renderFrame();
})();

// 현재 인덱스 실행
function musicStart(idx) {
  audio.src = `/music_spectrum/assets/music/${MUSIC_ARR[idx]}.mp3`;
  audio.load();
}

// 플레이 버튼 선언
const mainBtn = document.querySelector(".mainBtn");

// 이전, 다음 버튼 선언
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

// 일시정지

function pauseMusic() {
  mainBtn.classList.remove("play");
  audio.pause();
  console.log("pause");
  isPlay = false;
  mainBtn.style.backgroundImage = "url(./assets/images/svg/play.svg)";
}

// 노래 시작

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

// 타이틀 변경

// 앫범 이미지 변경
const album = document.querySelector(".album");
const title = document.querySelector(".title");

function albumImg(idx) {
  console.log(`${TITLE[idx]}`);
  title.innerHTML = `${TITLE[idx]}`;

  const style = document.createElement("style");
  style.textContent = `
    body::before {
      transition: .3s;
      background-image: url('./assets/images/${MUSIC_ARR[idx]}.webp');
    }
  `;
  document.head.appendChild(style);
  album.style.transition = ".3s";
  album.style.backgroundImage = `url('./assets/images/${MUSIC_ARR[idx]}.webp')`;
}

window.addEventListener("load", () => {
  albumImg(index);

  musicStart(index);
});
