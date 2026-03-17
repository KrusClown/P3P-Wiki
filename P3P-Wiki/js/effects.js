/* ═══════════════════════════════════════════
   P3P ARCHIVE — effects.js
   GLSL Shader · Custom Cursor · Idle Overlay
═══════════════════════════════════════════ */

/* ──────────────────────────────────────────
   1. GLSL WEBGL SHADER BACKGROUND
────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('glsl-canvas');
  const gl     = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) { console.warn('WebGL not supported — shader disabled'); return; }

  const vertSrc = `
    attribute vec2 a_position;
    varying   vec2 v_uv;
    void main() {
      v_uv        = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragSrc = `
    precision mediump float;
    uniform float u_time;
    uniform vec2  u_resolution;
    varying vec2  v_uv;

    vec2 hash2(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = dot(hash2(i + vec2(0,0)), f - vec2(0,0));
      float b = dot(hash2(i + vec2(1,0)), f - vec2(1,0));
      float c = dot(hash2(i + vec2(0,1)), f - vec2(0,1));
      float d = dot(hash2(i + vec2(1,1)), f - vec2(1,1));
      return mix(mix(a,b,u.x), mix(c,d,u.x), u.y) * 0.5 + 0.5;
    }

    float fbm(vec2 p) {
      float value = 0.0; float amp = 0.5; float freq = 1.0;
      for (int i = 0; i < 6; i++) {
        value += amp * noise(p * freq);
        freq  *= 2.1; amp *= 0.48; p += vec2(0.4, 0.7);
      }
      return value;
    }

    void main() {
      vec2 uv = v_uv;
      uv.x   *= u_resolution.x / u_resolution.y;
      float t = u_time * 0.0004;

      vec2 warp1 = vec2(
        fbm(uv + vec2(t * 0.8,  t * 0.3)),
        fbm(uv + vec2(t * 0.5, -t * 0.6))
      );
      vec2 warp2 = vec2(
        fbm(uv + 3.5 * warp1 + vec2(1.7, 9.2) + t * 0.4),
        fbm(uv + 3.5 * warp1 + vec2(8.3, 2.8) - t * 0.3)
      );
      float f = fbm(uv + 3.8 * warp2);

      vec3 col = mix(vec3(0.04, 0.01, 0.03), vec3(0.55, 0.06, 0.15), clamp(f * 1.8 - 0.2, 0.0, 1.0));
      col = mix(col, vec3(0.90, 0.25, 0.12), clamp(f * 2.2 - 1.1, 0.0, 1.0));
      col = mix(col, vec3(0.85, 0.65, 0.10), clamp(f * 3.0 - 2.2, 0.0, 1.0));

      vec2  center = v_uv - 0.5;
      float vign   = 1.0 - dot(center, center) * 2.2;
      col *= clamp(vign, 0.0, 1.0);
      col *= smoothstep(1.0, 0.3, v_uv.y);

      gl_FragColor = vec4(col, 0.9);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(s)); return null;
    }
    return s;
  }

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER,   vertSrc));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragSrc));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program error:', gl.getProgramInfoLog(program)); return;
  }
  gl.useProgram(program);

  const verts = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
  const buf   = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(program, 'u_time');
  const uRes  = gl.getUniformLocation(program, 'u_resolution');

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = canvas.offsetWidth  * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  const startTime = performance.now();
  function render() {
    if (!document.hidden) {
      gl.uniform1f(uTime, performance.now() - startTime);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    requestAnimationFrame(render);
  }
  render();
})();


/* ──────────────────────────────────────────
   2. CUSTOM CURSOR — trail + ring + dot
────────────────────────────────────────── */
(function () {
  const dot    = document.getElementById('cursor-dot');
  const ring   = document.getElementById('cursor-ring');
  const canvas = document.getElementById('cursor-trail-canvas');
  const ctx    = canvas.getContext('2d');

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let trail  = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    trail.push({ x: mouseX, y: mouseY, age: 0 });
    if (trail.length > 28) trail.shift();
  });

  const hoverSel = 'a, button, .char-card, .ftag, .nav-link, .modal-close, .btn-primary, .btn-ghost, #search, #idle-dismiss';
  document.addEventListener('mouseover', e => { if (e.target.closest(hoverSel)) document.body.classList.add('hovering'); });
  document.addEventListener('mouseout',  e => { if (e.target.closest(hoverSel)) document.body.classList.remove('hovering'); });
  document.addEventListener('mousedown', () => document.body.classList.add('clicking'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('clicking'));

  function loop() {
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    trail.forEach((p, i) => {
      p.age++;
      const progress = i / trail.length;
      const alpha    = progress * 0.55;
      const radius   = progress * 4.5;
      const hue      = progress > 0.6 ? '212,168,75' : '232,64,96';
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hue}, ${alpha})`;
      ctx.fill();
    });
    trail = trail.filter(p => p.age < 35);
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ──────────────────────────────────────────
   3. IDLE DARK HOUR OVERLAY
────────────────────────────────────────── */
(function () {
  const overlay  = document.getElementById('idle-overlay');
  const timeEl   = document.getElementById('idle-time');
  const dismiss  = document.getElementById('idle-dismiss');
  const hHand    = document.getElementById('hour-hand');
  const mHand    = document.getElementById('minute-hand');
  const sHand    = document.getElementById('second-hand');
  const marksG   = document.getElementById('hour-marks');

  // Draw clock hour marks
  for (let i = 0; i < 12; i++) {
    const isMain = i % 3 === 0;
    const len    = isMain ? 12 : 7;
    const r1 = 82, r2 = r1 - len;
    const rad = ((i / 12) * 360 - 90) * (Math.PI / 180);
    const x1 = 100 + r1 * Math.cos(rad), y1 = 100 + r1 * Math.sin(rad);
    const x2 = 100 + r2 * Math.cos(rad), y2 = 100 + r2 * Math.sin(rad);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke', isMain ? 'rgba(240,230,216,0.6)' : 'rgba(240,230,216,0.25)');
    line.setAttribute('stroke-width', isMain ? '1.5' : '0.8');
    marksG.appendChild(line);
  }

  function setHand(el, deg) {
    el.setAttribute('transform', `rotate(${deg}, 100, 100)`);
  }

  let clockSecs = 0;
  let clockInterval = null;

  function startClock() {
    clockSecs = 0;
    clockInterval = setInterval(() => {
      clockSecs++;
      const total = (23 * 3600 + 55 * 60) + clockSecs;
      const s = total % 60;
      const m = Math.floor(total / 60) % 60;
      const h = Math.floor(total / 3600) % 12;
      setHand(sHand, s * 6);
      setHand(mHand, m * 6 + s * 0.1);
      setHand(hHand, h * 30 + m * 0.5);
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }, 1000);
  }

  function stopClock() { clearInterval(clockInterval); }

  const IDLE_MS = 30000;
  let idleTimer = null;
  let isIdle    = false;

  function resetIdle() {
    if (isIdle) return;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(activateIdle, IDLE_MS);
  }

  function activateIdle() {
    isIdle = true;
    overlay.classList.add('active');
    startClock();
  }

  function deactivateIdle() {
    isIdle = false;
    overlay.classList.remove('active');
    stopClock();
    resetIdle();
  }

  ['mousemove','keydown','scroll','click','touchstart'].forEach(ev => {
    document.addEventListener(ev, resetIdle, { passive: true });
  });

  dismiss.addEventListener('click', deactivateIdle);
  document.addEventListener('keydown', e => { if (isIdle) deactivateIdle(); });

  resetIdle();
})();
