const surfGame = document.querySelector("#contact.v2-footer #surf-game");
const footerSocials = document.querySelector("#contact.v2-footer .social");
const footerDock = document.querySelector("body > .dock-wrap");

if (footerDock && (footerSocials || surfGame)) {
  const updateDockVisibility = () => {
    const dockBottom = footerDock.getBoundingClientRect().bottom;
    const socialsTop = footerSocials?.getBoundingClientRect().top ?? Infinity;
    const playgroundTop = surfGame?.getBoundingClientRect().top ?? Infinity;
    footerDock.classList.toggle("is-hidden-by-footer", Math.min(socialsTop, playgroundTop) <= dockBottom);
  };

  window.addEventListener("scroll", updateDockVisibility, { passive: true });
  window.addEventListener("resize", updateDockVisibility);
  window.addEventListener("pageshow", updateDockVisibility);
  window.addEventListener("portfolio-mode-change", updateDockVisibility);
  updateDockVisibility();
}

if (surfGame) {
  const surfPlayer = surfGame.querySelector("#surf-player");
  const surfObstacleLayer = surfGame.querySelector("#surf-obstacles");
  const surfScore = surfGame.querySelector("#surf-score");
  const surfFinalScore = surfGame.querySelector("#surf-final-score");
  const surfGameOver = surfGame.querySelector("#surf-game-over");
  const surfPlayAgain = surfGame.querySelector("#surf-play-again");
  const surfSoundToggle = surfGame.querySelector("#surf-sound-toggle");
  const surfPointSound = new Audio("quick-mode/assets/surf-point.mp3");
  const surfCrashSound = new Audio("quick-mode/assets/surf-crash.mp3");
  surfPointSound.preload = "auto";
  surfCrashSound.preload = "auto";
  surfPointSound.volume = 0.48;
  surfCrashSound.volume = 0.58;
  let surfState = "ready";
  let surfPoints = 0;
  let surfY = 0;
  let surfVelocity = 0;
  let surfFrame = 0;
  let surfPreviousTime = 0;
  let surfObstacles = [];
  let surfResizeTimer = 0;
  let surfMuted = false;
  let surfGameInView = false;
  const surfDimensions = () => {
    const width = surfGame?.clientWidth || 0;
    const height = surfGame?.clientHeight || 0;
    const playerWidth = surfPlayer?.offsetWidth || 104;
    const playerHeight = surfPlayer?.offsetHeight || 82;
    const playerX = Math.max(34, Math.min(width * 0.22, 270));
    const obstacleWidth = width < 744 ? 50 : 58;
    const gapSize = Math.max(158, Math.min(190, height * 0.37));
    return { width, height, playerWidth, playerHeight, playerX, obstacleWidth, gapSize };
  };
  const surfRandomGap = () => {
    const { height, gapSize } = surfDimensions();
    const topLimit = Math.max(76, height * 0.17);
    const bottomLimit = Math.max(88, height * 0.18);
    return topLimit + Math.random() * Math.max(1, height - topLimit - bottomLimit - gapSize);
  };
  const surfMakeObstacle = (x) => {
    const { gapSize } = surfDimensions();
    const gapTop = surfRandomGap();
    const pair = document.createElement("div");
    pair.className = "surf-obstacle-pair";
    const upper = document.createElement("div");
    upper.className = "surf-obstacle surf-obstacle--top";
    const lower = document.createElement("div");
    lower.className = "surf-obstacle surf-obstacle--bottom";
    const upperBuoy = new Image();
    upperBuoy.src = "quick-mode/assets/buoy.png";
    upperBuoy.alt = "";
    const lowerBuoy = new Image();
    lowerBuoy.src = "quick-mode/assets/buoy.png";
    lowerBuoy.alt = "";
    upper.append(upperBuoy);
    lower.append(lowerBuoy);
    pair.append(upper, lower);
    surfObstacleLayer?.append(pair);
    const obstacle = { element: pair, x, gapTop, gapBottom: gapTop + gapSize, passed: false };
    surfRenderObstacle(obstacle);
    return obstacle;
  };
  const surfRenderObstacle = (obstacle) => {
    obstacle.element.style.transform = `translate3d(${obstacle.x}px,0,0)`;
    obstacle.element.style.setProperty("--gap-top", `${obstacle.gapTop}px`);
    obstacle.element.style.setProperty("--gap-bottom", `${obstacle.gapBottom}px`);
  };
  const surfClearObstacles = () => {
    surfObstacles.forEach((obstacle) => obstacle.element.remove());
    surfObstacles = [];
  };
  const surfRenderPlayer = () => {
    if (!surfPlayer) return;
    const { playerX } = surfDimensions();
    const angle = Math.max(-9, Math.min(12, surfVelocity * 0.032));
    surfPlayer.style.transform = `translate3d(${playerX}px,${surfY}px,0) rotate(${angle}deg)`;
  };
  const surfPlaySound = (sound) => {
    if (surfMuted) return;
    sound.currentTime = 0;
    void sound.play().catch(() => {
    });
  };
  const surfSetMuted = (muted) => {
    surfMuted = muted;
    surfPointSound.muted = muted;
    surfCrashSound.muted = muted;
    if (!surfSoundToggle) return;
    surfSoundToggle.textContent = muted ? "Sound off" : "Sound on";
    surfSoundToggle.setAttribute("aria-pressed", String(muted));
    surfSoundToggle.setAttribute("aria-label", muted ? "Turn game sounds on" : "Mute game sounds");
  };
  const surfSetPoints = (points, pulse = false) => {
    surfPoints = points;
    if (surfScore) surfScore.textContent = String(points);
    if (surfFinalScore) surfFinalScore.textContent = String(points);
    if (pulse) {
      surfPlaySound(surfPointSound);
      if (surfScore) {
        surfScore.classList.remove("is-pulsing");
        void surfScore.offsetWidth;
        surfScore.classList.add("is-pulsing");
        window.setTimeout(() => surfScore.classList.remove("is-pulsing"), 190);
      }
    }
  };
  const surfSetState = (state) => {
    surfState = state;
    surfGame?.classList.toggle("is-ready", state === "ready");
    surfGame?.classList.toggle("is-playing", state === "playing");
    surfGame?.classList.toggle("is-over", state === "over");
    surfGame?.setAttribute("aria-label", state === "ready" ? "Surfboard buoy game. Tap or press space to play." : state === "playing" ? `Surfboard buoy game. Score ${surfPoints}.` : `Surfboard buoy game. Game over. Score ${surfPoints}.`);
    if (surfGameOver) surfGameOver.hidden = state !== "over";
  };
  const surfReset = () => {
    cancelAnimationFrame(surfFrame);
    surfPreviousTime = 0;
    surfVelocity = 0;
    surfSetPoints(0);
    surfClearObstacles();
    const { height, playerHeight } = surfDimensions();
    surfY = Math.max(70, height * 0.52 - playerHeight * 0.5);
    surfRenderPlayer();
    surfSetState("ready");
  };
  const surfBoost = () => {
    surfVelocity = surfGame?.clientWidth && surfGame.clientWidth < 744 ? -218 : -232;
  };
  const surfEnd = () => {
    if (surfState !== "playing") return;
    cancelAnimationFrame(surfFrame);
    surfSetState("over");
    surfPlaySound(surfCrashSound);
    window.setTimeout(() => surfPlayAgain?.focus({ preventScroll: true }), 80);
  };
  const surfCollided = (obstacle) => {
    const { playerX, playerWidth, playerHeight, obstacleWidth } = surfDimensions();
    const insetX = Math.max(9, playerWidth * 0.13);
    const insetY = Math.max(7, playerHeight * 0.12);
    const playerLeft = playerX + insetX;
    const playerRight = playerX + playerWidth - insetX;
    const playerTop = surfY + insetY;
    const playerBottom = surfY + playerHeight - insetY;
    const overlapsX = playerRight > obstacle.x + 6 && playerLeft < obstacle.x + obstacleWidth - 6;
    return overlapsX && (playerTop < obstacle.gapTop || playerBottom > obstacle.gapBottom);
  };
  const surfTick = (time) => {
    if (surfState !== "playing") return;
    const elapsed = Math.min(0.032, Math.max(1e-3, (time - surfPreviousTime) / 1e3 || 0.016));
    surfPreviousTime = time;
    const dimensions = surfDimensions();
    const gravity = dimensions.width < 744 ? 410 : 430;
    const speed = dimensions.width < 744 ? 132 : 158;
    surfVelocity += gravity * elapsed;
    surfY += surfVelocity * elapsed;
    surfRenderPlayer();
    const spacing = Math.max(290, Math.min(410, dimensions.width * 0.31));
    for (const obstacle of surfObstacles) {
      obstacle.x -= speed * elapsed;
      if (!obstacle.passed && obstacle.x + dimensions.obstacleWidth < dimensions.playerX) {
        obstacle.passed = true;
        surfSetPoints(surfPoints + 1, true);
      }
      surfRenderObstacle(obstacle);
    }
    const rightmost = Math.max(...surfObstacles.map((obstacle) => obstacle.x), dimensions.width);
    for (const obstacle of surfObstacles) {
      if (obstacle.x + dimensions.obstacleWidth < -16) {
        obstacle.x = rightmost + spacing;
        obstacle.gapTop = surfRandomGap();
        obstacle.gapBottom = obstacle.gapTop + dimensions.gapSize;
        obstacle.passed = false;
        surfRenderObstacle(obstacle);
      }
    }
    const hitEdge = surfY < 0 || surfY + dimensions.playerHeight > dimensions.height;
    if (hitEdge || surfObstacles.some(surfCollided)) {
      surfEnd();
      return;
    }
    surfFrame = requestAnimationFrame(surfTick);
  };
  const surfStart = () => {
    if (!surfGame || surfState === "playing") return;
    surfClearObstacles();
    const { width } = surfDimensions();
    const spacing = Math.max(290, Math.min(410, width * 0.31));
    surfObstacles = [0, 1, 2].map((index) => surfMakeObstacle(width + 120 + index * spacing));
    surfSetPoints(0);
    surfSetState("playing");
    surfBoost();
    surfPreviousTime = performance.now();
    surfFrame = requestAnimationFrame(surfTick);
  };
  const surfAction = () => {
    if (surfState === "ready") surfStart();
    else if (surfState === "playing") surfBoost();
  };
  surfGame?.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    surfGame.focus({ preventScroll: true });
    surfAction();
  });
  surfGame?.addEventListener("keydown", (event) => {
    if (event.target !== surfGame || event.key !== " " && event.code !== "Space") return;
    event.preventDefault();
    surfAction();
  });
  surfPlayAgain?.addEventListener("click", (event) => {
    event.stopPropagation();
    surfReset();
    surfGame?.focus({ preventScroll: true });
  });
  surfSoundToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    surfSetMuted(!surfMuted);
    surfGame?.focus({ preventScroll: true });
  });
  const surfIsInteractiveTarget = (target) => target instanceof HTMLElement && Boolean(target.closest("a,button,input,textarea,select,[contenteditable],dialog"));
  const surfWindowKeydown = (event) => {
    if (event.defaultPrevented || !surfGameInView || surfState === "over" || document.querySelector("dialog[open]") || surfIsInteractiveTarget(event.target) || event.key !== " " && event.code !== "Space") return;
    event.preventDefault();
    surfGame?.focus({ preventScroll: true });
    surfAction();
  };
  window.addEventListener("keydown", surfWindowKeydown);
  const surfViewObserver = new IntersectionObserver((entries) => {
    surfGameInView = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.2);
  }, { threshold: [0, 0.2, 0.5] });
  if (surfGame) surfViewObserver.observe(surfGame);
  window.addEventListener("resize", () => {
    window.clearTimeout(surfResizeTimer);
    surfResizeTimer = window.setTimeout(() => {
      if (surfState === "playing") {
        surfY = Math.min(surfY, surfDimensions().height - surfDimensions().playerHeight);
        surfRenderPlayer();
      } else surfReset();
    }, 120);
  });
  surfSetMuted(false);
  surfReset();
  window.addEventListener("pagehide", () => {
    if (surfState === "playing") surfReset();
    surfPointSound.pause();
    surfCrashSound.pause();
  });
}
