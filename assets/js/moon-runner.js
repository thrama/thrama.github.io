/* Moon Runner - endless runner su HTML5 Canvas
 * Versione per Hugo: si auto-inizializza su ogni elemento [data-moon-runner].
 * Nessuna dipendenza esterna. Vedi layouts/shortcodes/moon-runner.html
 */
(function () {
  "use strict";

  function boot(root) {
    const cv = root.querySelector(".mr-canvas"),
      ctx = cv.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const W = 384,
      H = 200,
      GROUND = 166;

    // ============ AUDIO CHIPTUNE (Web Audio, oscillatori 8-bit) ============
    let AC = null,
      muted = false;
    function audio() {
      if (!AC) {
        try {
          AC = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {}
      }
      if (AC && AC.state === "suspended") AC.resume();
      return AC;
    }
    function beep(freq, dur, type = "square", vol = 0.08, slide = 0) {
      const ac = audio();
      if (!ac || muted) return;
      const o = ac.createOscillator(),
        g = ac.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, ac.currentTime);
      if (slide)
        o.frequency.exponentialRampToValueAtTime(
          Math.max(30, freq + slide),
          ac.currentTime + dur,
        );
      g.gain.setValueAtTime(vol, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
      o.connect(g);
      g.connect(ac.destination);
      o.start();
      o.stop(ac.currentTime + dur);
    }
    function noise(dur, vol = 0.06) {
      const ac = audio();
      if (!ac || muted) return;
      const n = (ac.sampleRate * dur) | 0,
        buf = ac.createBuffer(1, n, ac.sampleRate),
        d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const s = ac.createBufferSource(),
        g = ac.createGain();
      s.buffer = buf;
      g.gain.value = vol;
      s.connect(g);
      g.connect(ac.destination);
      s.start();
    }
    const SFX = {
      jump: () => beep(220, 0.12, "square", 0.07, 300),
      djump: () => beep(330, 0.12, "square", 0.07, 260),
      shoot: () => {
        beep(880, 0.06, "square", 0.05, -500);
        noise(0.04, 0.03);
      },
      splash: () => {
        noise(0.12, 0.08);
        beep(200, 0.1, "triangle", 0.06, -120);
      },
      stomp: () => {
        beep(160, 0.08, "square", 0.09, -80);
        beep(440, 0.1, "square", 0.06, 200);
      },
      pickup: () => {
        beep(523, 0.08, "square", 0.07);
        setTimeout(() => beep(659, 0.08, "square", 0.07), 70);
        setTimeout(() => beep(784, 0.14, "square", 0.07), 140);
      },
      egg: () => {
        beep(392, 0.1, "triangle", 0.06);
        setTimeout(() => beep(523, 0.14, "triangle", 0.06), 100);
      },
      ufo: () => {
        beep(300, 0.25, "sawtooth", 0.05, -200);
        noise(0.2, 0.05);
      },
      over: () => {
        beep(330, 0.18, "square", 0.08, -100);
        setTimeout(() => beep(262, 0.18, "square", 0.08, -80), 160);
        setTimeout(() => beep(196, 0.4, "square", 0.08, -100), 320);
      },
      warp: () => {
        beep(200, 0.4, "sawtooth", 0.06, 900);
        setTimeout(() => noise(0.25, 0.07), 200);
      },
    };

    // ============ PALETTE ============
    const PAL = {
      space: "#08081a",
      star: "#e8e8ff",
      star2: "#7a7a96",
      moon: "#9a9ab2",
      moonD: "#5c5c74",
      moonL: "#c4c4d8",
      moonFar: "#3a3a52",
      moonMid: "#4c4c66",
      suit: "#e8e8ff",
      visor: "#4de3ff",
      suitD: "#9a9ab5",
      pack: "#ff9d3c",
      alien: "#7dff5e",
      alienEye: "#0b0b1e",
      water: "#4de3ff",
      waterL: "#c2f4ff",
      rock: "#6e6e88",
      rockD: "#44445c",
      ufo: "#c0c0d8",
      ufoDome: "#7dff5e",
      earth1: "#3c6fd9",
      earth2: "#5ecf6e",
      gold: "#ffd700",
    };

    // ============ SPRITES ============
    const SPR_RUN1 = [
      "..WWWW..",
      ".WVVVW..",
      ".WVVVW..",
      "PWWWWW..",
      "PWWWWWW.",
      "PWWWWW..",
      ".WW.WW..",
      ".WW..WW.",
      "DD....DD",
    ];
    const SPR_RUN2 = [
      "..WWWW..",
      ".WVVVW..",
      ".WVVVW..",
      "PWWWWW..",
      "PWWWWWW.",
      "PWWWWW..",
      ".WWWW...",
      "..WW.WW.",
      ".DD...DD",
    ];
    const SPR_JUMP = [
      "..WWWW..",
      ".WVVVW..",
      ".WVVVW..",
      "PWWWWWW.",
      "PWWWWWWW",
      "PWWWWW..",
      ".WW.WW..",
      "WW....WW",
      "........",
    ];
    const SPR_ALIEN1 = [
      "..A..A..",
      "...AA...",
      ".AAAAAA.",
      "AAEAAEAA",
      "AAAAAAAA",
      ".AADDAA.",
      "..A..A..",
      ".A....A.",
    ];
    const SPR_ALIEN2 = [
      "..A..A..",
      "...AA...",
      ".AAAAAA.",
      "AAEAAEAA",
      "AAAAAAAA",
      ".AADDAA.",
      ".A....A.",
      "..A..A..",
    ];
    const SPR_UFO = [
      "...GGG...",
      "..GGGGG..",
      ".UUUUUUU.",
      "UUUUUUUUU",
      ".U.U.U.U.",
    ];

    // Oggetti sfondo normali
    const BG_BASE = [
      "......f.........",
      "......f.........",
      ".....ddd........",
      "....duuud.......",
      "...duuuuud..mmm.",
      "..duuuuuuud.mwm.",
      ".ssssssssssssss.",
      ".ssssssssssssss.",
    ];
    const BG_LANDER = [
      ".....ss.....",
      "....ssss....",
      "....suus....",
      "...oooooo...",
      "..oooooooo..",
      "..o.oooo.o..",
      ".o..o..o..o.",
      "o...o..o...o",
    ];
    const BG_DISH = [
      "..ccc...",
      ".cCCCc..",
      "cCCCCCc.",
      ".cCCCc..",
      "...s....",
      "...s....",
      "..sss...",
    ];
    const BG_ROVER = [
      "..mm.mm..",
      ".mmmmmmm.",
      ".m.....m.",
      "tt.....tt",
      ".t.....t.",
    ];
    const BG_ROCKET = [
      "...r...",
      "..rrr..",
      "..rwr..",
      "..rrr..",
      "..rrr..",
      ".rrrrr.",
      "r.rrr.r",
      "..fff..",
    ];

    // Easter egg
    const BG_MONKEY = [
      "...kkkkkk...",
      "..kKKKKKKk..",
      ".kKKKKKKKKk.",
      ".kKeKKKKeKk.",
      ".kKKKnnKKKk.",
      ".kKKnKKnKKk.",
      "..kKKKKKKk..",
      "..kKmmmmKk..",
      "...kkkkkk...",
      "...k....k...",
    ];
    const BG_VAN = [
      "bbbbbbbbbb..",
      "bwwbbbbbwb..",
      "bwwbbbbbwb..",
      "rrrrrrrrrr..",
      "bbbbbbbbbbb.",
      ".tt.....tt..",
    ];
    const BG_KITT = [
      "....bbbb....",
      "..bbbwwbbb..",
      ".bbbbbbbbbb.",
      "bRbbbbbbbbb.",
      ".t........t.",
    ];
    const BG_WINNIE = [
      "a..........a",
      "aa.wwwwwww.a",
      "aawwywywywaa",
      ".awwwwwwwwa.",
      ".awwwwwwwwa.",
      "..ff..ff..f.",
    ];
    const BG_TARDIS = [
      ".l....",
      "pppppp",
      "pwpwpp",
      "pppppp",
      "pwpwpp",
      "pppppp",
      "pppppp",
    ];

    // Icone power-up (pickup a terra, 7x7)
    const PK_SHIELD = [
      "..hhh..",
      ".h...h.",
      "h..h..h",
      "h.hhh.h",
      "h..h..h",
      ".h...h.",
      "..hhh..",
    ];
    const PK_TRIPLE = [
      "...h...",
      "..hhh..",
      ".h.h.h.",
      "h..h..h",
      ".h.h.h.",
      "..hhh..",
      "...h...",
    ];
    const PK_TURBO = [
      "....h..",
      "...hh..",
      "..hhh..",
      ".hhhh..",
      "..hh...",
      "..h....",
      ".h.....",
    ];
    const PK_JET = [
      "..h.h..",
      "..hhh..",
      "..hhh..",
      "..hhh..",
      ".hhhhh.",
      "..f.f..",
      ".f...f.",
    ];
    const PK_WARP = [
      ".hhhhh.",
      "h.....h",
      "h.hhh.h",
      "h.h.h.h",
      "h.hhh.h",
      "h.....h",
      ".hhhhh.",
    ];

    const CMAP = {
      W: PAL.suit,
      V: PAL.visor,
      D: PAL.suitD,
      P: PAL.pack,
      A: PAL.alien,
      E: PAL.alienEye,
      G: PAL.ufoDome,
      U: PAL.ufo,
      u: "#aab",
      d: "#667",
      s: "#556",
      f: "#dd4444",
      m: "#889",
      w: "#e8e8ff",
      o: "#d4a017",
      c: "#99a",
      C: "#ccd",
      t: "#333",
      r: "#ccc",
      k: "#6b5a3e",
      K: "#8a765a",
      e: "#1a1408",
      n: "#5a4a30",
      b: "#181820",
      R: "#ff2020",
      y: "#ffd700",
      a: "#b0b0c0",
      p: "#2040a0",
      l: "#ffe080",
      h: "#ffd700",
    };

    function drawSprite(map, x, y, s = 2, tint = null) {
      for (let r = 0; r < map.length; r++) {
        const row = map[r];
        for (let c = 0; c < row.length; c++) {
          const ch = row[c];
          if (ch === ".") continue;
          ctx.fillStyle = tint || CMAP[ch] || ch;
          ctx.fillRect(x + c * s, y + r * s, s, s);
        }
      }
    }

    // ============ PAESAGGIO ============
    function makeRidge(n, base, amp) {
      const pts = [];
      let y = base;
      for (let i = 0; i <= n; i++) {
        y += (Math.random() - 0.5) * amp;
        y = Math.max(base - amp, Math.min(base + amp * 0.4, y));
        pts.push(y);
      }
      return pts;
    }
    const ridgeFar = makeRidge(24, 120, 26),
      ridgeMid = makeRidge(24, 145, 16);
    let farOff = 0,
      midOff = 0;
    function drawRidge(pts, off, color) {
      const seg = (W / (pts.length - 1)) * 1.6,
        total = seg * (pts.length - 1);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-10, H);
      for (let px = -10; px <= W + 10; px += 4) {
        let t = (((px + off) % total) + total) % total;
        const i = Math.floor(t / seg),
          f = (t % seg) / seg;
        ctx.lineTo(px, (pts[i] * (1 - f) + pts[(i + 1) % pts.length] * f) | 0);
      }
      ctx.lineTo(W + 10, H);
      ctx.closePath();
      ctx.fill();
    }

    // ============ STATO ============
    let state = "title",
      paused = false;
    let score = 0,
      best = 0,
      frame = 0,
      speed = 2.2,
      shake = 0,
      toast = null;

    const player = {
      x: 52,
      y: GROUND - 18,
      vy: 0,
      onGround: true,
      jumps: 0,
      w: 14,
      h: 18,
    };
    let obstacles = [],
      aliens = [],
      ufos = [],
      shots = [],
      splashes = [],
      stars = [],
      bgObjs = [],
      rocksFG = [],
      pickups = [];
    let spawnTimer = 0,
      alienTimer = 0,
      ufoTimer = 0,
      bgTimer = 0;

    // power-up attivi (contatori in frame; ~60fps → 480 = 8s)
    const power = { shield: 0, triple: 0, turbo: 0, jet: 0 };
    const PDUR = 480;

    for (let i = 0; i < 50; i++)
      stars.push({
        x: Math.random() * W,
        y: Math.random() * 100,
        b: Math.random() > 0.75,
      });
    for (let i = 0; i < 8; i++)
      rocksFG.push({
        x: Math.random() * W,
        y: GROUND + 6 + Math.random() * 20,
        w: (3 + Math.random() * 5) | 0,
      });

    // ============ BEST SCORE PERSISTENTE ============
    async function loadBest() {
      try {
        const v = localStorage.getItem("moonrunner-best");
        if (v) best = parseInt(v) || 0;
      } catch (e) {
        /* nessun salvataggio precedente / storage non disponibile */
      }
    }
    async function saveBest() {
      try {
        localStorage.setItem("moonrunner-best", String(best));
      } catch (e) {}
    }
    loadBest();

    // ============ EASTER EGG → POWER-UP ============
    const BG_NORMAL = [
      { spr: BG_BASE, s: 2 },
      { spr: BG_LANDER, s: 2 },
      { spr: BG_DISH, s: 2 },
      { spr: BG_ROVER, s: 2 },
      { spr: BG_ROCKET, s: 2 },
    ];
    const BG_EGGS = [
      {
        spr: BG_MONKEY,
        s: 2,
        name: "Una gigantesca testa di scimmia?!",
        pk: "triple",
      },
      {
        spr: BG_VAN,
        s: 2,
        name: "Se avete un problema... quel furgone!",
        pk: "shield",
      },
      {
        spr: BG_KITT,
        s: 2,
        name: "Una supercar che parla da sola…",
        pk: "turbo",
      },
      { spr: BG_WINNIE, s: 2, name: "Un camper... con le ali?!", pk: "jet" },
      {
        spr: BG_TARDIS,
        s: 2,
        name: "Quella cabina non era lì un attimo fa.",
        pk: "warp",
      },
    ];
    const PK_INFO = {
      shield: { spr: PK_SHIELD, label: "SCUDO!", desc: "invulnerabile 8s" },
      triple: {
        spr: PK_TRIPLE,
        label: "TRIPLO SPRUZZO!",
        desc: "3 getti d\u2019acqua",
      },
      turbo: { spr: PK_TURBO, label: "TURBO x2!", desc: "punti doppi 8s" },
      jet: { spr: PK_JET, label: "JETPACK!", desc: "triplo salto fluttuante" },
      warp: {
        spr: PK_WARP,
        label: "WARP TEMPORALE!",
        desc: "schermo ripulito",
      },
    };

    let raf = null,
      inView = true;

    function reset() {
      score = 0;
      speed = 2.2;
      frame = 0;
      toast = null;
      player.y = GROUND - 18;
      player.vy = 0;
      player.onGround = true;
      player.jumps = 0;
      obstacles = [];
      aliens = [];
      ufos = [];
      shots = [];
      splashes = [];
      bgObjs = [];
      pickups = [];
      power.shield = 0;
      power.triple = 0;
      power.turbo = 0;
      power.jet = 0;
      spawnTimer = 60;
      alienTimer = 180;
      ufoTimer = 600;
      bgTimer = 140;
    }

    // ============ INPUT ============
    function jump() {
      audio();
      if (paused) {
        paused = false;
        return;
      }
      if (state !== "play") {
        state = "play";
        reset();
        return;
      }
      const maxJ = power.jet > 0 ? 3 : 2;
      if (player.onGround) {
        player.vy = power.jet > 0 ? -5.0 : -5.6;
        player.onGround = false;
        player.jumps = 1;
        SFX.jump();
      } else if (player.jumps < maxJ) {
        player.vy = power.jet > 0 ? -4.2 : -4.9;
        player.jumps++;
        SFX.djump();
      }
    }
    function shoot() {
      audio();
      if (paused) {
        paused = false;
        return;
      }
      if (state !== "play") {
        jump();
        return;
      }
      const max = power.triple > 0 ? 6 : 3;
      if (shots.length < max) {
        if (power.triple > 0) {
          shots.push({ x: player.x + 14, y: player.y + 6, vx: 5.5, vy: 0.15 });
          shots.push({ x: player.x + 14, y: player.y + 6, vx: 5.2, vy: -0.6 });
          shots.push({ x: player.x + 14, y: player.y + 6, vx: 5.2, vy: 0.9 });
        } else
          shots.push({ x: player.x + 14, y: player.y + 6, vx: 5.5, vy: 0.15 });
        SFX.shoot();
      }
    }
    // La tastiera e' agganciata al container, non a window: i tasti vengono
    // intercettati solo quando il gioco ha il focus, cosi' SPAZIO e le frecce
    // continuano a scorrere normalmente il resto della pagina.
    root.addEventListener("keydown", (e) => {
      if (
        e.code === "Space" ||
        e.code === "ArrowUp" ||
        e.code === "ArrowRight"
      ) {
        e.preventDefault();
      }
      if (e.code === "Space" || e.code === "ArrowUp") {
        jump();
      }
      if (e.code === "KeyX" || e.code === "ArrowRight") {
        shoot();
      }
      if (e.code === "KeyM") {
        muted = !muted;
        toast = { text: muted ? "AUDIO OFF" : "AUDIO ON", timer: 60 };
      }
    });
    root.addEventListener("pointerdown", () => {
      try {
        root.focus({ preventScroll: true });
      } catch (e) {
        root.focus();
      }
    });
    root.addEventListener("blur", () => {
      pause();
    });
    cv.addEventListener("pointerdown", (e) => {
      const r = cv.getBoundingClientRect();
      (e.clientX - r.left) / r.width < 0.5 ? jump() : shoot();
    });
    root.querySelector(".mr-jump").addEventListener("pointerdown", (e) => {
      e.preventDefault();
      jump();
    });
    root.querySelector(".mr-shoot").addEventListener("pointerdown", (e) => {
      e.preventDefault();
      shoot();
    });
    root.querySelector(".mr-audio").addEventListener("pointerdown", (e) => {
      e.preventDefault();
      muted = !muted;
      toast = { text: muted ? "AUDIO OFF" : "AUDIO ON", timer: 60 };
      e.currentTarget.textContent = muted ? "AUDIO OFF" : "AUDIO ON";
    });

    // ============ SPAWN ============
    function spawnObstacle() {
      if (Math.random() < 0.6) {
        const h = (8 + Math.random() * 10) | 0;
        obstacles.push({
          x: W + 10,
          y: GROUND - h,
          w: (10 + Math.random() * 8) | 0,
          h,
          kind: "rock",
        });
      } else
        obstacles.push({
          x: W + 10,
          y: GROUND,
          w: (22 + Math.random() * 14) | 0,
          h: 10,
          kind: "crater",
        });
    }
    function spawnAlien() {
      aliens.push({ x: W + 10, y: GROUND - 16, w: 16, h: 16, hp: 1, t: 0 });
    }
    function spawnUfo() {
      ufos.push({
        x: W + 20,
        y: 36 + Math.random() * 30,
        w: 18,
        h: 10,
        t: 0,
        drop: (90 + Math.random() * 60) | 0,
      });
      SFX.ufo();
    }
    function spawnBg() {
      const egg = Math.random() < 0.22;
      const cat = egg ? BG_EGGS : BG_NORMAL;
      const o = cat[(Math.random() * cat.length) | 0];
      const h = o.spr.length * o.s;
      bgObjs.push({
        spr: o.spr,
        s: o.s,
        x: W + 30,
        y: GROUND - h - ((Math.random() * 6) | 0),
        name: o.name,
        pk: o.pk,
        seen: false,
      });
    }

    function killAlien(a, pts) {
      a.hp = 0;
      score += pts * (power.turbo > 0 ? 2 : 1);
      shake = 4;
      for (let i = 0; i < 8; i++)
        splashes.push({
          x: a.x + 8,
          y: a.y + 8,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 2.5,
          l: 20,
        });
    }
    function activate(kind) {
      SFX.pickup();
      const info = PK_INFO[kind];
      toast = { text: info.label + " — " + info.desc, timer: 140 };
      if (kind === "warp") {
        SFX.warp();
        shake = 10;
        aliens.forEach((a) => killAlien(a, 25));
        ufos.forEach((u) => {
          score += 50 * (power.turbo > 0 ? 2 : 1);
        });
        ufos = [];
        obstacles = [];
        for (let i = 0; i < 20; i++)
          splashes.push({
            x: Math.random() * W,
            y: Math.random() * GROUND,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 2,
            l: 30,
          });
      } else power[kind] = PDUR;
    }

    // ============ UPDATE ============
    function update() {
      frame++;
      speed = 2.2 + Math.min(3.4, score / 400);
      farOff += speed * 0.15;
      midOff += speed * 0.35;

      const grav = power.jet > 0 ? 0.17 : 0.24;
      player.vy += grav;
      player.y += player.vy;
      if (player.y >= GROUND - player.h) {
        player.y = GROUND - player.h;
        player.vy = 0;
        player.onGround = true;
        player.jumps = 0;
      }

      for (const k in power) if (power[k] > 0) power[k]--;

      if (--spawnTimer <= 0) {
        spawnObstacle();
        spawnTimer = 70 + Math.random() * 60 - Math.min(30, score / 50);
      }
      if (--alienTimer <= 0) {
        spawnAlien();
        alienTimer = 200 + Math.random() * 160 - Math.min(80, score / 30);
      }
      if (score > 150 && --ufoTimer <= 0) {
        spawnUfo();
        ufoTimer = 500 + Math.random() * 300;
      }
      if (--bgTimer <= 0) {
        spawnBg();
        bgTimer = 220 + Math.random() * 260;
      }

      bgObjs.forEach((o) => {
        o.x -= speed * 0.6;
        if (o.name && !o.seen && o.x < W - 60) {
          o.seen = true;
          toast = { text: o.name, timer: 130 };
          SFX.egg();
          // l'oggetto misterioso lascia un power-up sul terreno di gioco
          pickups.push({ x: W + 10, y: GROUND - 16, kind: o.pk, t: 0 });
        }
      });
      bgObjs = bgObjs.filter((o) => o.x > -80);
      rocksFG.forEach((r) => {
        r.x -= speed * 1.15;
        if (r.x < -10) {
          r.x = W + Math.random() * 30;
          r.y = GROUND + 6 + Math.random() * 20;
        }
      });

      pickups.forEach((p) => {
        p.x -= speed;
        p.t++;
      });
      pickups = pickups.filter((p) => p.x > -20);

      obstacles.forEach((o) => (o.x -= speed));
      obstacles = obstacles.filter((o) => o.x > -60);

      aliens.forEach((a) => {
        a.x -= speed + 0.7;
        a.t++;
      });
      aliens = aliens.filter((a) => a.x > -30 && a.hp > 0);

      ufos.forEach((u) => {
        u.x -= speed * 0.8;
        u.t++;
        u.y += Math.sin(u.t / 15) * 0.4;
        if (u.t === u.drop && u.x < W - 20 && u.x > 60)
          aliens.push({
            x: u.x,
            y: u.y + 10,
            w: 16,
            h: 16,
            hp: 1,
            t: 0,
            fall: true,
          });
      });
      ufos = ufos.filter((u) => u.x > -40);
      aliens.forEach((a) => {
        if (a.fall && a.y < GROUND - 16) a.y += 2;
        else a.fall = false;
      });

      shots.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.02;
      });
      shots = shots.filter((s) => s.x < W + 10 && s.y < GROUND + 4);

      shots.forEach((s) => {
        aliens.forEach((a) => {
          if (
            a.hp > 0 &&
            s.x > a.x &&
            s.x < a.x + a.w &&
            s.y > a.y &&
            s.y < a.y + a.h
          ) {
            killAlien(a, 25);
            SFX.splash();
            s.x = W + 99;
          }
        });
        ufos.forEach((u) => {
          if (s.x > u.x && s.x < u.x + u.w && s.y > u.y && s.y < u.y + u.h) {
            u.x = -99;
            s.x = W + 99;
            score += 50 * (power.turbo > 0 ? 2 : 1);
            shake = 6;
            SFX.splash();
            for (let i = 0; i < 12; i++)
              splashes.push({
                x: u.x + 9,
                y: u.y + 5,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 3,
                l: 25,
              });
          }
        });
      });

      splashes.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.l--;
      });
      splashes = splashes.filter((p) => p.l > 0);

      // ---- Collisioni giocatore ----
      const px = player.x + 2,
        pw = player.w - 4,
        py = player.y,
        ph = player.h;
      let hit = false;

      pickups.forEach((p) => {
        if (px < p.x + 14 && px + pw > p.x && py < p.y + 14 && py + ph > p.y) {
          activate(p.kind);
          p.x = -99;
        }
      });

      aliens.forEach((a) => {
        if (a.hp <= 0) return;
        const overlap =
          px < a.x + a.w && px + pw > a.x && py < a.y + a.h && py + ph > a.y;
        if (!overlap) return;
        const falling = player.vy > 0,
          fromAbove = py + ph - a.y < 9;
        if (falling && fromAbove) {
          killAlien(a, 25);
          SFX.stomp();
          player.vy = -4.6;
          player.jumps = 1;
        } else if (power.shield > 0) {
          killAlien(a, 25);
          SFX.splash();
        } else hit = true;
      });

      obstacles.forEach((o) => {
        if (power.shield > 0) return; // lo scudo protegge anche dagli ostacoli
        if (o.kind === "rock") {
          if (px < o.x + o.w && px + pw > o.x && py + ph > o.y) hit = true;
        } else {
          if (player.onGround && px + pw > o.x + 4 && px < o.x + o.w - 4)
            hit = true;
        }
      });

      if (hit) {
        state = "over";
        shake = 10;
        SFX.over();
        if (score > best) {
          best = score | 0;
          saveBest();
        }
      }

      score += 0.15 * (power.turbo > 0 ? 2 : 1);
      if (shake > 0) shake--;
      if (toast && --toast.timer <= 0) toast = null;
    }

    // ============ DRAW ============
    function drawBG() {
      ctx.fillStyle = PAL.space;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#0d0d24";
      ctx.fillRect(0, 70, W, 50);
      ctx.fillStyle = "#11112c";
      ctx.fillRect(0, 110, W, 60);

      stars.forEach((s) => {
        ctx.fillStyle = s.b ? PAL.star : PAL.star2;
        if (!(s.b && frame % 40 < 4)) ctx.fillRect(s.x | 0, s.y | 0, 1, 1);
      });

      ctx.fillStyle = PAL.earth1;
      ctx.beginPath();
      ctx.arc(316, 34, 15, 0, 7);
      ctx.fill();
      ctx.fillStyle = PAL.earth2;
      ctx.fillRect(310, 27, 7, 4);
      ctx.fillRect(318, 36, 8, 4);
      ctx.fillRect(312, 41, 5, 3);
      ctx.fillStyle = "rgba(8,8,26,.4)";
      ctx.beginPath();
      ctx.arc(321, 31, 15, 0, 7);
      ctx.fill();

      drawRidge(ridgeFar, farOff, PAL.moonFar);
      drawRidge(ridgeMid, midOff, PAL.moonMid);
      bgObjs.forEach((o) => drawSprite(o.spr, o.x | 0, o.y | 0, o.s));

      ctx.fillStyle = PAL.moon;
      ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.fillStyle = PAL.moonL;
      ctx.fillRect(0, GROUND, W, 2);
      rocksFG.forEach((r) => {
        ctx.fillStyle = PAL.moonD;
        ctx.fillRect(r.x | 0, r.y | 0, r.w, 2);
        ctx.fillStyle = PAL.moonL;
        ctx.fillRect(r.x | 0, (r.y - 1) | 0, r.w - 1, 1);
      });
    }

    function drawObstacles() {
      obstacles.forEach((o) => {
        if (o.kind === "rock") {
          ctx.fillStyle = PAL.rock;
          ctx.fillRect(o.x | 0, o.y, o.w, o.h);
          ctx.fillStyle = PAL.rockD;
          ctx.fillRect(o.x | 0, o.y + o.h - 3, o.w, 3);
          ctx.fillStyle = PAL.moonL;
          ctx.fillRect((o.x + 2) | 0, o.y, 3, 2);
        } else {
          ctx.fillStyle = PAL.space;
          ctx.fillRect(o.x | 0, GROUND, o.w, H - GROUND);
          ctx.fillStyle = PAL.moonD;
          ctx.fillRect(o.x | 0, GROUND, 2, H - GROUND);
          ctx.fillRect((o.x + o.w - 2) | 0, GROUND, 2, H - GROUND);
        }
      });
    }

    function drawPickups() {
      pickups.forEach((p) => {
        const bob = Math.sin(p.t / 10) * 2;
        if (p.t % 40 < 30) {
          // lampeggio dorato
          drawSprite(PK_INFO[p.kind].spr, p.x | 0, (p.y + bob) | 0, 2);
          ctx.fillStyle = "rgba(255,215,0,.15)";
          ctx.fillRect((p.x - 2) | 0, (p.y + bob - 2) | 0, 18, 18);
        } else
          drawSprite(PK_INFO[p.kind].spr, p.x | 0, (p.y + bob) | 0, 2, "#fff");
      });
    }

    function drawPlayer() {
      if (state === "over" && frame % 8 < 4) return;
      const spr = !player.onGround
        ? SPR_JUMP
        : frame % 16 < 8
          ? SPR_RUN1
          : SPR_RUN2;
      // scudo: bolla lampeggiante
      if (power.shield > 0 && (power.shield > 120 || frame % 10 < 6)) {
        ctx.strokeStyle = "rgba(77,227,255,.7)";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          player.x - 3,
          (player.y - 3) | 0,
          player.w + 7,
          player.h + 6,
        );
      }
      // jetpack: fiammelle
      if (power.jet > 0 && !player.onGround) {
        ctx.fillStyle = frame % 6 < 3 ? "#ff9d3c" : "#ffd700";
        ctx.fillRect(
          player.x,
          (player.y + 16) | 0,
          2,
          (3 + Math.random() * 3) | 0,
        );
      }
      drawSprite(spr, player.x, player.y | 0, 2);
      ctx.fillStyle = PAL.water;
      ctx.fillRect(player.x + 13, (player.y + 8) | 0, 5, 3);
      ctx.fillStyle = PAL.waterL;
      ctx.fillRect(player.x + 16, (player.y + 7) | 0, 2, 2);
    }

    function drawEnemies() {
      aliens.forEach((a) => {
        if (a.hp > 0)
          drawSprite(
            a.t % 20 < 10 ? SPR_ALIEN1 : SPR_ALIEN2,
            a.x | 0,
            a.y | 0,
            2,
          );
      });
      ufos.forEach((u) => {
        drawSprite(SPR_UFO, u.x | 0, u.y | 0, 2);
        if (u.t % 30 < 15) {
          ctx.fillStyle = "rgba(125,255,94,.25)";
          ctx.fillRect((u.x + 4) | 0, (u.y + 10) | 0, 10, GROUND - u.y - 10);
        }
      });
    }

    function drawShots() {
      shots.forEach((s) => {
        ctx.fillStyle = PAL.water;
        ctx.fillRect(s.x | 0, s.y | 0, 4, 2);
        ctx.fillStyle = PAL.waterL;
        ctx.fillRect(s.x | 0, s.y | 0, 2, 1);
      });
      splashes.forEach((p) => {
        ctx.fillStyle = p.l > 10 ? PAL.waterL : PAL.water;
        ctx.fillRect(p.x | 0, p.y | 0, 2, 2);
      });
    }

    function drawUI() {
      ctx.fillStyle = PAL.ui;
      ctx.font = 'bold 10px "Courier New"';
      ctx.textAlign = "left";
      ctx.fillText("SCORE " + (score | 0), 8, 14);
      ctx.fillText("BEST " + (best | 0), 8, 26);
      // barre power-up attivi
      let bx = 8,
        by = 34;
      const pks = [
        ["shield", PK_SHIELD],
        ["triple", PK_TRIPLE],
        ["turbo", PK_TURBO],
        ["jet", PK_JET],
      ];
      pks.forEach(([k, spr]) => {
        if (power[k] > 0) {
          drawSprite(spr, bx, by, 1);
          ctx.fillStyle = "rgba(255,215,0,.4)";
          ctx.fillRect(bx + 9, by + 2, 20, 3);
          ctx.fillStyle = PAL.gold;
          ctx.fillRect(bx + 9, by + 2, ((20 * power[k]) / PDUR) | 0, 3);
          by += 11;
        }
      });
      if (power.turbo > 0) {
        ctx.fillStyle = PAL.gold;
        ctx.fillText("x2", 44, 20);
      }
      if (toast) {
        ctx.textAlign = "center";
        ctx.fillStyle =
          toast.timer > 110
            ? "rgba(255,215,0," + (140 - toast.timer) / 30 + ")"
            : PAL.gold;
        ctx.font = 'bold 9px "Courier New"';
        ctx.fillText(toast.text, W / 2, 44);
        ctx.textAlign = "left";
      }
    }

    function drawCenter(lines) {
      ctx.fillStyle = "rgba(8,8,26,.78)";
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = "center";
      lines.forEach((l) => {
        ctx.fillStyle = l.c || PAL.ui;
        ctx.font = (l.big ? "bold 20px" : "bold 9px") + ' "Courier New"';
        ctx.fillText(l.t, W / 2, l.y);
      });
      ctx.textAlign = "left";
    }

    function loop() {
      raf = requestAnimationFrame(loop);
      if (state === "play" && !paused) update();
      else frame++;

      ctx.save();
      if (shake > 0)
        ctx.translate(
          (Math.random() - 0.5) * shake,
          (Math.random() - 0.5) * shake,
        );
      drawBG();
      drawObstacles();
      drawPickups();
      drawEnemies();
      drawShots();
      drawPlayer();
      ctx.restore();
      drawUI();

      if (state === "title") {
        drawCenter([
          { t: "MOON RUNNER", y: 64, big: true, c: PAL.visor },
          { t: "ASTRONAUTA vs ALIENI LUNARI", y: 84 },
          { t: "SPAZIO / sinistra = SALTA (doppio!)", y: 106, c: PAL.moonL },
          {
            t: "X / destra = PISTOLA AD ACQUA · M = audio",
            y: 118,
            c: PAL.moonL,
          },
          {
            t: "Stomp sugli alieni + power-up misteriosi!",
            y: 130,
            c: PAL.alien,
          },
          {
            t: frame % 60 < 40 ? "— PREMI PER INIZIARE —" : "",
            y: 156,
            c: PAL.gold,
          },
        ]);
      }
      if (state === "over") {
        drawCenter([
          { t: "GAME OVER", y: 80, big: true, c: "#ff5e5e" },
          { t: "SCORE " + (score | 0) + "   ·   BEST " + (best | 0), y: 104 },
          {
            t: frame % 60 < 40 ? "— PREMI PER RIPROVARE —" : "",
            y: 132,
            c: PAL.gold,
          },
        ]);
      }
      if (paused && state === "play") {
        drawCenter([
          { t: "PAUSA", y: 84, big: true, c: PAL.visor },
          {
            t: frame % 60 < 40 ? "\u2014 PREMI PER CONTINUARE \u2014" : "",
            y: 118,
            c: PAL.gold,
          },
        ]);
      }
    }

    // ============ CICLO LEGATO ALLA VISIBILITA' ============
    // Fuori schermo o a tab nascosta il requestAnimationFrame viene fermato:
    // niente CPU/batteria bruciata mentre si legge il resto della pagina.
    function start() {
      if (raf === null) raf = requestAnimationFrame(loop);
    }
    function stop() {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }
    function pause() {
      if (state === "play") paused = true;
    }
    function sync() {
      if (inView && !document.hidden) start();
      else {
        pause();
        stop();
      }
    }

    document.addEventListener("visibilitychange", sync);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (es) => {
          es.forEach((e) => {
            inView = e.isIntersecting;
            sync();
          });
        },
        { threshold: 0.01 },
      ).observe(root);
    } else start();
  }

  function init() {
    document.querySelectorAll("[data-moon-runner]").forEach(function (el) {
      if (el.dataset.mrBooted) return;
      el.dataset.mrBooted = "1";
      boot(el);
    });
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
