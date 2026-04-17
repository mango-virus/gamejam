(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const COLORS = ['#c64bff', '#ff4fd8', '#4ff0ff', '#ffd84f', '#4fff9e', '#ffffff'];

  const layer = document.createElement('div');
  layer.id = 'fx-layer';
  document.body.appendChild(layer);

  function spawnConfetti() {
    const el = document.createElement('div');
    el.className = 'confetti';
    if (Math.random() < 0.5) el.classList.add('circle');
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.animationDuration = (7 + Math.random() * 6) + 's';
    el.style.setProperty('--drift', (Math.random() * 220 - 110) + 'px');
    el.style.setProperty('--size', (6 + Math.random() * 8) + 'px');
    layer.appendChild(el);
    setTimeout(() => el.remove(), 15000);
  }

  function spawnRocket() {
    const el = document.createElement('div');
    el.className = 'rocket';
    el.textContent = '\u{1F680}';
    el.style.top = (15 + Math.random() * 60) + 'vh';
    el.style.animationDuration = (4.5 + Math.random() * 2.5) + 's';
    layer.appendChild(el);
    setTimeout(() => el.remove(), 8000);
  }

  function spawnSparkle() {
    const el = document.createElement('div');
    el.className = 'sparkle';
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.top = (Math.random() * 100) + 'vh';
    el.style.animationDelay = (Math.random() * 0.5) + 's';
    layer.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }

  for (let i = 0; i < 18; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    if (Math.random() < 0.5) el.classList.add('circle');
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.animationDuration = (7 + Math.random() * 6) + 's';
    el.style.animationDelay = (-Math.random() * 10) + 's';
    el.style.setProperty('--drift', (Math.random() * 220 - 110) + 'px');
    el.style.setProperty('--size', (6 + Math.random() * 8) + 'px');
    layer.appendChild(el);
  }

  setInterval(spawnConfetti, 550);
  setInterval(spawnRocket, 8500);
  setInterval(spawnSparkle, 350);
  setTimeout(spawnRocket, 1500);

  window.jamBurst = function jamBurst() {
    for (let i = 0; i < 140; i++) setTimeout(spawnConfetti, i * 12);
    for (let i = 0; i < 60; i++) setTimeout(spawnSparkle, i * 18);
    setTimeout(spawnRocket, 300);
    setTimeout(spawnRocket, 900);
  };
})();
