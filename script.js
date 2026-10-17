(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Dot field that pushes away from the pointer ---------- */
  const canvas = document.getElementById("field");
  const ctx = canvas.getContext("2d");
  const GAP = 28;
  const RADIUS = 170;
  const pointer = { x: -9999, y: -9999 };
  let width = 0;
  let height = 0;
  let dots = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    dots = [];
    for (let y = GAP / 2; y < height; y += GAP) {
      for (let x = GAP / 2; x < width; x += GAP) {
        dots.push({ x, y });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const d of dots) {
      const dx = d.x - pointer.x;
      const dy = d.y - pointer.y;
      const dist = Math.hypot(dx, dy);
      const t = Math.max(0, 1 - dist / RADIUS);
      const nx = dist ? dx / dist : 0;
      const ny = dist ? dy / dist : 0;

      ctx.beginPath();
      ctx.arc(d.x + nx * t * 8, d.y + ny * t * 8, 1 + t * 2.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(17, 24, 39, ${0.12 + t * 0.7})`;
      ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  function setPointer(x, y) {
    pointer.x = x;
    pointer.y = y;
    document.body.style.setProperty("--mx", `${x}px`);
    document.body.style.setProperty("--my", `${y}px`);
  }

  window.addEventListener("pointermove", (e) => setPointer(e.clientX, e.clientY));
  window.addEventListener("pointerleave", () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });
  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) draw();
  });

  resize();
  draw();

  /* ---------- Count-up numbers ---------- */
  const counters = document.querySelectorAll("[data-count]");

  function countUp(el) {
    const target = Number(el.dataset.count);
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1600;
    const start = performance.now() + 900;
    function step(now) {
      const p = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  counters.forEach((el) => {
    el.textContent = "0";
    countUp(el);
  });
})();
