(function () {
  const audio = document.querySelector("audio");

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

  NUM_OF_BARS = 60;

  function initializeVisualizer() {
    // 기존 막대 제거 후 다시 생성
    visualizerContainer.innerHTML = "";
    for (let i = 0; i < NUM_OF_BARS; i++) {
      const bar = document.createElement("DIV");
      bar.setAttribute("id", `bar${i}`);
      bar.classList.add("visualizer-container__bar");
      visualizerContainer.appendChild(bar);
    }
  }

  // 화면 크기 변경 감지하여 막대 개수 조정
  const mediaQuery = matchMedia("screen and (min-width: 480px)");
  mediaQuery.addEventListener("change", (e) => {
    NUM_OF_BARS = e.matches ? 80 : 50;
    initializeVisualizer();
  });

  initializeVisualizer(); // 초기 시각화 초기화

  function renderFrame() {
    analyzer.getByteFrequencyData(frequencyData);

    for (let i = 0; i < NUM_OF_BARS; i++) {
      const fd = frequencyData[(i + 10) * 2];
      const bar = document.querySelector(`#bar${i}`);
      if (bar) {
        const barHeight = fd || 0;
        bar.style.height = mediaQuery.matches ? `${barHeight}px` : `${barHeight / 1.5}px`;
      }
    }

    requestAnimationFrame(renderFrame);
  }

  renderFrame();

  // 사용자 상호작용이 있어야 오디오 재생이 가능
  document.addEventListener("click", () => {
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    audio.play();
  });
})();
