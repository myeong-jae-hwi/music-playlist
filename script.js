(function () {
  const audio = document.querySelector("audio");

  const NUM_OF_BARS = 80;

  // 오디오 컨텍스트 생성
  const ctx = new AudioContext();

  const audioSource = ctx.createMediaElementSource(audio);

  const analayzer = ctx.createAnalyser();

  audioSource.connect(analayzer);
  audioSource.connect(ctx.destination);

  const frequencyData = new Uint8Array(analayzer.frequencyBinCount);
  analayzer.getByteFrequencyData(frequencyData);
  // console.log("frequencyData", frequencyData);

  const visualizerContainer = document.querySelector(".visualizer-container");

  for (let i = 0; i < NUM_OF_BARS; i++) {
    const bar = document.createElement("DIV");
    bar.setAttribute("id", `bar${i}`);
    bar.setAttribute("class", "visualizer-container__bar");
    visualizerContainer.appendChild(bar);
  }

  function randerFrame() {
    analayzer.getByteFrequencyData(frequencyData);

    for (let i = 0; i < NUM_OF_BARS; i++) {
      fd = frequencyData[(i + 10) * 2];

      const bar = document.querySelector(`#bar${i}`);

      if (!bar) {
        continue;
      }

      const barHeight = fd || 0;
      // console.log(barHeight);

      bar.style.height = barHeight + "px";
    }

    window.requestAnimationFrame(randerFrame);
  }

  randerFrame();

  audio.play();
})();
