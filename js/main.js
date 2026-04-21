/* =============================================
   NIRAJ CHAUDHARY – 3D PORTFOLIO MAIN JS
   ============================================= */

'use strict';

/* ── INTRO ANIMATION ────────────────────────── */
window.addEventListener('load', () => {
  const introOverlay = document.getElementById('introOverlay');
  if (introOverlay) {
    document.body.classList.add('intro-mode');

    const site = document.getElementById('siteContent');
    if (site) {
      // Use opacity only — NO transform/scale, which breaks position:fixed on descendants
      site.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1) 2.6s';
      site.style.opacity = '0';
      setTimeout(() => { site.style.opacity = '1'; }, 200);
    }

    setTimeout(() => {
      document.body.classList.remove('intro-mode');
      introOverlay.style.display = 'none';
    }, 3500);
  }
});

/* ── CUSTOM CURSOR ──────────────────────────── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
});

(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .bento-card, .memory-card-3d, .asset-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width  = '52px';
    ring.style.height = '52px';
    ring.style.opacity = '0.8';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width  = '32px';
    ring.style.height = '32px';
    ring.style.opacity = '0.5';
  });
});

/* ── THEME TOGGLE ───────────────────────────── */
const themeBtn = document.getElementById('themeToggle');
const body = document.body;

function setTheme(dark) {
  if (dark) {
    body.classList.add('dark');
    themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.remove('dark');
    themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', 'light');
  }
}
setTheme(localStorage.getItem('theme') === 'dark');
themeBtn.addEventListener('click', () => setTheme(!body.classList.contains('dark')));

/* ── MOBILE MENU ────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
window.closeMobile = () => mobileMenu.classList.remove('open');

/* ── NAVBAR SCROLL ──────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 30
    ? '0 4px 24px rgba(0,0,0,0.08)'
    : 'none';
});

/* ── SCROLL REVEAL ──────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ── STAT COUNTER ───────────────────────────── */
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      const nums = e.target.closest('.stats-inner')?.querySelectorAll('.stat-num') || [];
      nums.forEach(n => animateCounter(n, parseInt(n.dataset.target)));
      statObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-block').forEach(el => statObserver.observe(el));

/* ── HERO CANVAS ────────────────────────────── */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = Array.from({ length: 60 }, () => ({
  x:  Math.random() * 2,
  y:  Math.random() * 2,
  vx: (Math.random() - 0.5) * 0.0003,
  vy: (Math.random() - 0.5) * 0.0003,
  r:  Math.random() * 1.8 + 0.4,
  a:  Math.random() * 0.6 + 0.1,
  hue: Math.random() < 0.5 ? 330 : 255
}));

const blobs = [
  { x: 0.15, y: 0.25, r: 0.35, hue: 340, baseX: 0.15, baseY: 0.25 },
  { x: 0.82, y: 0.65, r: 0.28, hue: 260, baseX: 0.82, baseY: 0.65 },
  { x: 0.5,  y: 0.85, r: 0.22, hue: 170, baseX: 0.5,  baseY: 0.85 },
];

let heroT = 0;
let mouseX = 0.5, mouseY = 0.5;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX / window.innerWidth;
  mouseY = e.clientY / window.innerHeight;
});

function drawHero() {
  resizeCanvas();
  ctx.clearRect(0, 0, W, H);
  heroT += 0.008;

  const isDark = body.classList.contains('dark');

  ctx.fillStyle = isDark ? '#0e0e12' : '#f5f4f0';
  ctx.fillRect(0, 0, W, H);

  blobs.forEach((b, i) => {
    b.x = b.baseX + Math.sin(heroT * 0.5 + i * 1.3) * 0.04 + (mouseX - 0.5) * 0.03;
    b.y = b.baseY + Math.cos(heroT * 0.4 + i * 1.1) * 0.03 + (mouseY - 0.5) * 0.02;

    const grd = ctx.createRadialGradient(
      b.x * W, b.y * H, 0,
      b.x * W, b.y * H, b.r * W
    );
    grd.addColorStop(0, `hsla(${b.hue},70%,65%,${isDark ? 0.07 : 0.13})`);
    grd.addColorStop(1, `hsla(${b.hue},70%,65%,0)`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
  });

  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)';
  ctx.lineWidth = 1;
  const gridSize = 60;
  for (let x = 0; x < W; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
    if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue},70%,60%,${p.a * (isDark ? 0.5 : 0.3)})`;
    ctx.fill();
  });

  ctx.strokeStyle = isDark ? 'rgba(200,150,255,0.04)' : 'rgba(234,76,137,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = (particles[i].x - particles[j].x) * W;
      const dy = (particles[i].y - particles[j].y) * H;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.globalAlpha = (1 - dist / 100) * 0.4;
        ctx.beginPath();
        ctx.moveTo(particles[i].x * W, particles[i].y * H);
        ctx.lineTo(particles[j].x * W, particles[j].y * H);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;

  requestAnimationFrame(drawHero);
}
drawHero();

/* ── PROFILE 3D TILT ────────────────────────── */
const profileCard = document.getElementById('profileCard');
if (profileCard) {
  const wrap = profileCard.closest('.profile-3d-wrap');
  wrap.addEventListener('mousemove', e => {
    const r   = wrap.getBoundingClientRect();
    const x   = (e.clientX - r.left) / r.width  - 0.5;
    const y   = (e.clientY - r.top)  / r.height - 0.5;
    profileCard.style.transform = `rotateX(${-y * 14}deg) rotateY(${x * 14}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    profileCard.style.transform = 'rotateX(0) rotateY(0)';
  });
}

/* ── BENTO CARD GLOW ON MOUSE ───────────────── */
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ── MEMORY CARD 3D TILT ────────────────────── */
document.querySelectorAll('.memory-card-3d').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── GALLERY MODAL ──────────────────────────── */
const modal = document.getElementById('gallery-modal');
const galleryScroll = modal ? modal.querySelector('.gallery-scroll') : null;

/* ── VIDEO PLAYER SETUP ─────────────────────── */
function setupVideoItem(video) {
  if (video.dataset.setup) return;
  video.dataset.setup = 'true';

  const item = video.closest('.video-item');
  if (!item) return;

  // Always use metadata preload so browser can seek to first frame
  video.preload = 'metadata';
  // Remove controls — we handle everything ourselves
  video.removeAttribute('controls');

  // Build custom overlay
  const overlay = document.createElement('div');
  overlay.className = 'vid-overlay';
  overlay.innerHTML = `
    <div class="vid-play-btn">
      <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </div>
    <div class="vid-pause-btn" style="display:none">
      <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      </svg>
    </div>
    <div class="vid-progress">
      <div class="vid-progress-bar"></div>
    </div>
    <div class="vid-time">0:00</div>
  `;
  item.appendChild(overlay);

  const playBtn  = overlay.querySelector('.vid-play-btn');
  const pauseBtn = overlay.querySelector('.vid-pause-btn');
  const bar      = overlay.querySelector('.vid-progress-bar');
  const timeEl   = overlay.querySelector('.vid-time');

  // Seek to first frame for thumbnail
  video.addEventListener('loadedmetadata', () => {
    video.currentTime = Math.min(1, video.duration * 0.03);
  }, { once: true });

  video.addEventListener('seeked', () => {
    if (!video.dataset.thumbDone) {
      video.dataset.thumbDone = 'true';
      item.classList.add('thumb-ready');
    }
  }, { once: true });

  video.load();

  // Format seconds → m:ss
  function fmt(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  // Update progress bar and time
  video.addEventListener('timeupdate', () => {
    if (video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      bar.style.width = pct + '%';
      timeEl.textContent = fmt(video.currentTime) + ' / ' + fmt(video.duration);
    }
  });

  // Play/pause state
  function onPlay() {
    item.classList.add('playing');
    playBtn.style.display  = 'none';
    pauseBtn.style.display = 'flex';
  }
  function onPause() {
    item.classList.remove('playing');
    playBtn.style.display  = 'flex';
    pauseBtn.style.display = 'none';
  }
  video.addEventListener('play',  onPlay);
  video.addEventListener('pause', onPause);
  video.addEventListener('ended', () => { onPause(); video.currentTime = 0; });

  // Tap/click anywhere on item = toggle play/pause
  // But clicking the progress bar scrubs instead
  overlay.querySelector('.vid-progress').addEventListener('click', (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  });

  item.addEventListener('click', (e) => {
    if (e.target.closest('.vid-progress')) return;
    if (video.paused) {
      // Pause all other videos first
      document.querySelectorAll('#gallery5 video').forEach(v => {
        if (v !== video && !v.paused) v.pause();
      });
      video.play();
    } else {
      video.pause();
    }
  });
}

window.openGallery = function(id) {
  document.querySelectorAll('.gallery-pane').forEach(p => p.classList.remove('active'));

  const pane = document.getElementById(id);
  if (pane) {
    pane.classList.add('active');
    modal.classList.add('open');

    if (galleryScroll) galleryScroll.scrollTop = 0;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollbarWidth + 'px';

    // Setup all videos in the video gallery
    if (id === 'gallery5') {
      pane.querySelectorAll('video').forEach(v => setupVideoItem(v));
    }
  }
};


window.closeGallery = function() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  // Pause all videos when closing
  modal.querySelectorAll('video').forEach(v => { v.pause(); v.currentTime = 0; });
};

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeGallery();
});

/* ── CONTACT FORM ───────────────────────────── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.innerHTML = 'Sent! ✓';
        btn.style.background = '#00c9a7';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Network error');
      }
    } catch {
      btn.innerHTML = 'Failed – try email directly';
      btn.style.background = '#ff4444';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}

/* ── SMOOTH ANCHOR SCROLL ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      closeMobile();
    }
  });
});

/* ── SCROLL-DRIVEN PARALLAX FOR HERO ────────── */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const heroInner = document.querySelector('.hero-inner');
  if (heroInner) {
    // Only transform hero-inner, never siteContent (breaks fixed positioning)
    heroInner.style.transform = `translateY(${sy * 0.25}px)`;
    heroInner.style.opacity   = Math.max(0, 1 - sy / 500);
  }
});