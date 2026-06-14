/* ============================================================
   THIÊN HỔ TECHNOLOGY — script.js
   ============================================================ */

'use strict';

// ─── Accessibility: respect reduced-motion preference ──────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Wait for all deferred libs ────────────────────────────
window.addEventListener('load', init);

function init() {

  /* ──────────────────────────────────────────────────────
     1. GSAP + ScrollTrigger registration
  ────────────────────────────────────────────────────── */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ──────────────────────────────────────────────────────
     2. Scroll Progress Bar
  ────────────────────────────────────────────────────── */
  const progressBar = document.getElementById('scrollProgressBar');
  function updateProgress() {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total * 100) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ──────────────────────────────────────────────────────
     3. Header: sticky + active-section
  ────────────────────────────────────────────────────── */
  const header    = document.getElementById('siteHeader');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('main section[id]');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveNav();
    toggleBackToTop();
  }, { passive: true });

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  /* ──────────────────────────────────────────────────────
     4. Mobile Menu
  ────────────────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const primaryNav = document.getElementById('primaryNav');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    primaryNav.classList.toggle('open', open);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('open');
    });
  });

  /* ──────────────────────────────────────────────────────
     5. Smooth Scroll
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ──────────────────────────────────────────────────────
     6. Hero Canvas — Blueprint Particle Network
  ────────────────────────────────────────────────────── */
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas && !prefersReducedMotion) {
    const ctx = heroCanvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 55;
    const MAX_DIST = 130;

    function resizeCanvas() {
      heroCanvas.width  = heroCanvas.offsetWidth;
      heroCanvas.height = heroCanvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * heroCanvas.width;
        this.y  = Math.random() * heroCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r  = Math.random() * 1.8 + 0.8;
        this.isNode = Math.random() < 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > heroCanvas.width)  this.vx *= -1;
        if (this.y < 0 || this.y > heroCanvas.height)  this.vy *= -1;
      }
      draw() {
        if (this.isNode) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r + 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(249,115,22,0.35)';
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.isNode ? 'rgba(249,115,22,0.7)' : 'rgba(37,99,235,0.5)';
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    let rafId;
    function drawParticles() {
      ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      particles.forEach(p => { p.update(); p.draw(); });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(drawParticles);
    }
    drawParticles();

    // Pause when off-screen
    const heroSection = document.getElementById('home');
    const canvasObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (!rafId) drawParticles();
      } else {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
    canvasObserver.observe(heroSection);
  }

  /* ──────────────────────────────────────────────────────
     7. Hero GSAP Entrance Animation
  ────────────────────────────────────────────────────── */
  if (window.gsap && !prefersReducedMotion) {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to('.h1-line', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power4.out'
      }, '-=0.3')
      .to('#heroSub', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .to('#heroCtas', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .to('#heroStats', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3');
  } else {
    // No animation fallback — make visible immediately
    document.querySelectorAll('.hero-eyebrow, .h1-line, #heroSub, #heroCtas, #heroStats')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  /* ──────────────────────────────────────────────────────
     8. GSAP Parallax — Hero Gears on Scroll
  ────────────────────────────────────────────────────── */
  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    gsap.to('.layer-blueprint', {
      y: '-20%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    gsap.to('.layer-gears', {
      y: '-30%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    gsap.to('.hero-content-wrap', {
      y: '15%',
      opacity: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: '60% top',
        scrub: 1,
      }
    });
  }

  /* ──────────────────────────────────────────────────────
     9. Mouse Parallax — hero elements follow cursor
  ────────────────────────────────────────────────────── */
  if (!prefersReducedMotion) {
    const heroSection = document.getElementById('home');
    heroSection && heroSection.addEventListener('mousemove', e => {
      if (window.innerWidth < 768) return;
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      const gears = document.querySelector('.layer-gears');
      if (gears) gears.style.transform = `translate(${dx * -12}px, ${dy * -8}px)`;
    });
  }

  /* ──────────────────────────────────────────────────────
     10. AOS Init
  ────────────────────────────────────────────────────── */
  if (window.AOS) {
    AOS.init({
      duration: prefersReducedMotion ? 0 : 700,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic',
    });
  }

  /* ──────────────────────────────────────────────────────
     11. Counter Animation (IntersectionObserver)
  ────────────────────────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target || el.dataset.count, 10);
    const duration = prefersReducedMotion ? 0 : 2000;
    if (duration === 0) { el.textContent = target; return; }
    const start  = performance.now();
    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else              el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter, .hstat-num').forEach(el => counterObserver.observe(el));

  /* ──────────────────────────────────────────────────────
     12. Magnetic Buttons
  ────────────────────────────────────────────────────── */
  if (window.gsap && !prefersReducedMotion) {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        if (window.innerWidth < 768) return;
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width  / 2) * 0.28;
        const y = (e.clientY - rect.top  - rect.height / 2) * 0.28;
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ──────────────────────────────────────────────────────
     13. Back to Top
  ────────────────────────────────────────────────────── */
  const btt = document.getElementById('backToTop');
  function toggleBackToTop() {
    btt.classList.toggle('visible', window.scrollY > 500);
  }
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));

  /* ──────────────────────────────────────────────────────
     14. Swiper — Projects Carousel
  ────────────────────────────────────────────────────── */
  if (window.Swiper) {
    new Swiper('.projects-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: {
        640:  { slidesPerView: 1.5 },
        1024: { slidesPerView: 2.5 },
      },
    });
  }

  /* ──────────────────────────────────────────────────────
     15. Vanilla Tilt — 3D Product Cards
  ────────────────────────────────────────────────────── */
  if (window.VanillaTilt && window.innerWidth > 768) {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 8,
      speed: 500,
      glare: true,
      'max-glare': 0.25,
      perspective: 1000,
    });
  }

  /* ──────────────────────────────────────────────────────
     16. Horizontal Product Scroll (drag + GSAP pin)
  ────────────────────────────────────────────────────── */
  const scrollWrap = document.getElementById('productsScrollWrap');
  if (scrollWrap) {
    let isDragging = false, startX = 0, scrollLeft = 0;

    scrollWrap.addEventListener('mousedown', e => {
      isDragging = true;
      scrollWrap.style.cursor = 'grabbing';
      startX = e.pageX - scrollWrap.offsetLeft;
      scrollLeft = scrollWrap.scrollLeft;
    });
    window.addEventListener('mouseup', () => {
      isDragging = false;
      scrollWrap.style.cursor = 'grab';
    });
    scrollWrap.addEventListener('mousemove', e => {
      if (!isDragging) return;
      e.preventDefault();
      const x    = e.pageX - scrollWrap.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollWrap.scrollLeft = scrollLeft - walk;
    });
  }

  /* ──────────────────────────────────────────────────────
     17. Energy Calculator
  ────────────────────────────────────────────────────── */
  const calcBtn  = document.getElementById('calcBtn');
  const calcLoad = document.getElementById('calcLoad');
  const calcLoadVal = document.getElementById('calcLoadVal');

  if (calcLoad) {
    calcLoad.addEventListener('input', () => {
      const v = calcLoad.value;
      calcLoadVal.textContent = v + '%';
      // Update range track fill
      calcLoad.style.setProperty('--value', v + '%');
    });
    // Init
    calcLoad.style.setProperty('--value', calcLoad.value + '%');
  }

  calcBtn && calcBtn.addEventListener('click', runCalculation);

  function runCalculation() {
    const power  = parseFloat(document.getElementById('calcPower').value)  || 7.5;
    const hours  = parseFloat(document.getElementById('calcHours').value)  || 16;
    const days   = parseFloat(document.getElementById('calcDays').value)   || 300;
    const rate   = parseFloat(document.getElementById('calcRate').value)   || 1850;
    const load   = parseFloat(calcLoad.value) / 100 || 0.75;

    const totalHours = hours * days;

    // Without VFD: constant speed → base consumption (adjusted for load factor)
    const kwhBefore = power * totalHours;
    const costBefore = kwhBefore * rate;

    // With VFD: cubic law savings; typical saving = (1 - load^3) * 100% × 0.8 (efficiency factor)
    const savingFactor = (1 - Math.pow(load, 3)) * 0.8;
    const kwhAfter  = kwhBefore * (1 - savingFactor);
    const costAfter = kwhAfter * rate;
    const saving    = costBefore - costAfter;
    const savingPct = Math.round(savingFactor * 100);

    // CO2: 0.6 kg CO2 per kWh (Vietnam grid)
    const co2Saved = Math.round((kwhBefore - kwhAfter) * 0.6);

    // Payback: rough inverter cost estimate = 3M VND per kW
    const investCost  = power * 3_000_000;
    const paybackMonths = saving > 0 ? Math.round((investCost / saving) * 12) : '—';

    function formatVND(n) {
      if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + ' tỷ';
      if (n >= 1_000_000)     return Math.round(n / 1_000_000) + ' triệu';
      return Math.round(n).toLocaleString('vi-VN') + ' đ';
    }

    document.getElementById('resCurrent').textContent = formatVND(costBefore) + ' đ';
    document.getElementById('resAfter').textContent   = formatVND(costAfter)  + ' đ';
    document.getElementById('resSaving').textContent  = formatVND(saving) + ' đ';
    document.getElementById('resSavingPct').textContent = `Tiết kiệm ~${savingPct}% điện năng mỗi năm`;
    document.getElementById('resCO2').textContent     = co2Saved.toLocaleString('vi-VN');
    document.getElementById('resPayback').textContent = paybackMonths;

    const extras = document.getElementById('resultExtras');
    extras.style.display = 'grid';

    // Animate saving number
    if (!prefersReducedMotion) {
      const saveEl = document.getElementById('resSaving');
      saveEl.style.transform = 'scale(1.1)';
      setTimeout(() => { saveEl.style.transform = 'scale(1)'; saveEl.style.transition = 'transform 0.3s ease'; }, 10);
    }
  }

  /* ──────────────────────────────────────────────────────
     18. Before/After Comparison Slider
  ────────────────────────────────────────────────────── */
  const compareSlider = document.getElementById('compareSlider');
  const compareHandle = document.getElementById('compareHandle');
  const beforePanel   = document.querySelector('.compare-before');
  const afterPanel    = document.querySelector('.compare-after');

  if (compareSlider && compareHandle && window.innerWidth > 768) {
    let dragging = false;

    function setPosition(pct) {
      pct = Math.max(10, Math.min(90, pct));
      compareHandle.style.left = pct + '%';
      beforePanel.style.right  = (100 - pct) + '%';
      afterPanel.style.left    = pct + '%';
      compareHandle.setAttribute('aria-valuenow', Math.round(pct));
    }

    setPosition(50);

    compareHandle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
    window.addEventListener('mouseup', () => { dragging = false; });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      const rect = compareSlider.getBoundingClientRect();
      const pct  = ((e.clientX - rect.left) / rect.width) * 100;
      setPosition(pct);
    });

    // Touch
    compareHandle.addEventListener('touchstart', e => { dragging = true; }, { passive: true });
    window.addEventListener('touchend', () => { dragging = false; });
    window.addEventListener('touchmove', e => {
      if (!dragging) return;
      const touch = e.touches[0];
      const rect  = compareSlider.getBoundingClientRect();
      const pct   = ((touch.clientX - rect.left) / rect.width) * 100;
      setPosition(pct);
    }, { passive: true });

    // Keyboard
    compareHandle.addEventListener('keydown', e => {
      const current = parseFloat(compareHandle.getAttribute('aria-valuenow')) || 50;
      if (e.key === 'ArrowLeft')  setPosition(current - 5);
      if (e.key === 'ArrowRight') setPosition(current + 5);
    });
  }

  /* ──────────────────────────────────────────────────────
     19. Digital Twin — Component Info Panel
  ────────────────────────────────────────────────────── */
  const componentData = {
    inverter: {
      title: 'Biến Tần ARINCO AU2',
      specs: [
        '0.75 – 22 kW / 3 pha 380V',
        'Cấp bảo vệ IP20',
        'Điều khiển V/F và vector',
        'Tiết kiệm điện đến 35%',
      ],
    },
    inverter2: {
      title: 'Biến Tần ARINCO AV68',
      specs: [
        '4 – 160 kW / 3 pha 380V',
        'Cấp bảo vệ IP20/IP55',
        'Vector control sensorless',
        'Phù hợp tải nặng, quạt, bơm',
      ],
    },
    motor1: {
      title: 'Motor Điện 3 Pha IE3',
      specs: [
        'Công suất 7.5 kW / 4 cực',
        'Cấp bảo vệ IP55',
        'Hiệu suất IE3 (Premium)',
        'Vận hành 24/7 môi trường công nghiệp',
      ],
    },
    gearmotor: {
      title: 'Motor Giảm Tốc GIMO',
      specs: [
        'Công suất 15 kW',
        'Tỷ số truyền 5–1500:1',
        'Cấp bảo vệ IP65',
        'Vỏ gang đúc, độ bền cao',
      ],
    },
    plc: {
      title: 'PLC Controller',
      specs: [
        'CPU xử lý 32-bit',
        '32 DI / 16 DO',
        'Giao tiếp Modbus, Ethernet',
        'Tích hợp với SCADA/HMI',
      ],
    },
    hmi: {
      title: 'Màn Hình HMI SCADA',
      specs: [
        'Màn hình 7" – 21" cảm ứng',
        'Hiển thị trạng thái thời gian thực',
        'Cảnh báo & ghi nhật ký sự kiện',
        'Kết nối cloud monitoring',
      ],
    },
  };

  const tipTitle   = document.getElementById('tipTitle');
  const tipBody    = document.getElementById('tipBody');
  const tipCta     = document.getElementById('tipCta');
  const components = document.querySelectorAll('.twin-component');

  components.forEach(comp => {
    const handler = () => {
      const data = componentData[comp.dataset.component];
      if (!data) return;
      tipTitle.textContent = data.title;
      tipBody.innerHTML    = '<ul>' + data.specs.map(s => `<li>${s}</li>`).join('') + '</ul>';
      tipCta.style.display = 'flex';
      // Highlight
      components.forEach(c => c.style.opacity = '0.5');
      comp.style.opacity = '1';
    };
    comp.addEventListener('click', handler);
    comp.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') handler(); });
  });

  /* ──────────────────────────────────────────────────────
     20. Vietnam Map Canvas
  ────────────────────────────────────────────────────── */
  const mapCanvas = document.getElementById('vietnamMapCanvas');
  if (mapCanvas) {
    const mctx = mapCanvas.getContext('2d');
    const W = mapCanvas.width, H = mapCanvas.height;

    // Approximate city positions on a 320×520 canvas (Vietnam shape)
    const cities = {
      hcmc:      { x: 165, y: 420, label: 'TP.HCM',     projects: '40+', color: '#F97316' },
      binhduong: { x: 175, y: 400, label: 'Bình Dương', projects: '20+', color: '#3B82F6' },
      dongnai:   { x: 188, y: 415, label: 'Đồng Nai',  projects: '15+', color: '#3B82F6' },
      hanoi:     { x: 155, y: 110, label: 'Hà Nội',     projects: '12+', color: '#F97316' },
      bacninh:   { x: 165, y: 100, label: 'Bắc Ninh',  projects: '8+',  color: '#3B82F6' },
    };

    // Simplified Vietnam outline points (normalized to 320×520)
    const outline = [
      [162,18],[170,30],[175,45],[180,65],[185,80],[178,95],[170,105],
      [165,115],[168,130],[172,145],[175,160],[178,175],[182,190],[178,205],
      [175,220],[180,240],[185,255],[190,270],[195,285],[200,300],[205,310],
      [210,320],[215,330],[210,345],[205,360],[200,375],[205,390],[210,400],
      [205,415],[195,425],[180,430],[165,428],[155,420],[148,408],[145,395],
      [148,380],[152,365],[150,350],[145,335],[140,320],[138,305],[140,290],
      [142,275],[140,260],[138,245],[135,230],[130,215],[128,200],[130,185],
      [132,170],[130,155],[128,140],[125,125],[122,110],[120,95],[122,80],
      [125,65],[128,50],[135,35],[142,22],[150,16],[162,18],
    ];

    let activeCity = 'hcmc';
    let animPulse = 0;

    function drawMap() {
      mctx.clearRect(0, 0, W, H);

      // Draw simplified Vietnam outline
      mctx.beginPath();
      outline.forEach(([x, y], i) => {
        if (i === 0) mctx.moveTo(x, y); else mctx.lineTo(x, y);
      });
      mctx.closePath();
      mctx.fillStyle = 'rgba(37,99,235,0.06)';
      mctx.fill();
      mctx.strokeStyle = 'rgba(37,99,235,0.3)';
      mctx.lineWidth = 1.5;
      mctx.stroke();

      // Grid lines (blueprint style)
      mctx.setLineDash([2, 6]);
      mctx.strokeStyle = 'rgba(37,99,235,0.12)';
      mctx.lineWidth = 0.8;
      for (let x = 0; x < W; x += 40) {
        mctx.beginPath(); mctx.moveTo(x, 0); mctx.lineTo(x, H); mctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        mctx.beginPath(); mctx.moveTo(0, y); mctx.lineTo(W, y); mctx.stroke();
      }
      mctx.setLineDash([]);

      // Draw cities
      Object.entries(cities).forEach(([key, city]) => {
        const isActive = key === activeCity;
        const pulse    = isActive ? Math.sin(animPulse * 0.05) * 4 : 0;

        // Pulse ring
        if (isActive) {
          mctx.beginPath();
          mctx.arc(city.x, city.y, 14 + pulse, 0, Math.PI * 2);
          mctx.fillStyle = 'rgba(249,115,22,0.1)';
          mctx.fill();
          mctx.beginPath();
          mctx.arc(city.x, city.y, 10, 0, Math.PI * 2);
          mctx.fillStyle = 'rgba(249,115,22,0.2)';
          mctx.fill();
        }

        // Dot
        mctx.beginPath();
        mctx.arc(city.x, city.y, isActive ? 6 : 4, 0, Math.PI * 2);
        mctx.fillStyle = isActive ? city.color : 'rgba(37,99,235,0.5)';
        mctx.fill();

        // Label
        mctx.font = `${isActive ? 600 : 400} ${isActive ? '10px' : '9px'} Inter, sans-serif`;
        mctx.fillStyle = isActive ? '#FFFFFF' : 'rgba(255,255,255,0.4)';
        mctx.textAlign = 'left';
        mctx.fillText(city.label, city.x + 10, city.y + 4);
      });

      // Connection lines from HCMC hub
      if (activeCity !== 'hcmc') {
        const hcmc = cities.hcmc;
        const active = cities[activeCity];
        mctx.beginPath();
        mctx.moveTo(hcmc.x, hcmc.y);
        mctx.lineTo(active.x, active.y);
        mctx.setLineDash([4, 3]);
        mctx.strokeStyle = 'rgba(249,115,22,0.35)';
        mctx.lineWidth = 1;
        mctx.stroke();
        mctx.setLineDash([]);
      }

      animPulse++;
      requestAnimationFrame(drawMap);
    }
    drawMap();

    // City selector buttons
    const cityData = {
      hcmc:      { name: 'TP. Hồ Chí Minh', desc: 'Trung tâm hoạt động chính — 40+ dự án trong các KCN Tân Bình, Bình Chánh, Củ Chi.', projects: '40+ dự án' },
      binhduong: { name: 'Bình Dương',       desc: 'KCN VSIP, Sóng Thần, Mỹ Phước — tập trung dệt may, chế biến gỗ, thực phẩm.',           projects: '20+ dự án' },
      dongnai:   { name: 'Đồng Nai',         desc: 'KCN Amata, Long Đức, Nhơn Trạch — ô tô, điện tử, logistics.',                           projects: '15+ dự án' },
      hanoi:     { name: 'Hà Nội',           desc: 'KCN Thăng Long, Nội Bài, Phú Nghĩa — điện tử, cơ khí chế tạo.',                         projects: '12+ dự án' },
      bacninh:   { name: 'Bắc Ninh',         desc: 'KCN Tiên Sơn, Quế Võ — điện tử Samsung, chế biến thực phẩm.',                           projects: '8+ dự án'  },
    };

    document.querySelectorAll('.city-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCity = btn.dataset.city;
        document.querySelectorAll('.city-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const data = cityData[activeCity];
        document.getElementById('cityName').textContent     = data.name;
        document.getElementById('cityDesc').textContent     = data.desc;
        document.getElementById('cityProjects').textContent = data.projects;
      });
    });
  }

  /* ──────────────────────────────────────────────────────
     21. Industrial Network Visualization
  ────────────────────────────────────────────────────── */
  const netCanvas = document.getElementById('networkCanvas');
  if (netCanvas && !prefersReducedMotion) {
    const nctx = netCanvas.getContext('2d');
    netCanvas.width  = netCanvas.offsetWidth;
    netCanvas.height = netCanvas.offsetHeight;
    const NW = netCanvas.width, NH = netCanvas.height;

    window.addEventListener('resize', () => {
      netCanvas.width  = netCanvas.offsetWidth;
      netCanvas.height = netCanvas.offsetHeight;
    }, { passive: true });

    // Nodes representing automation ecosystem
    const nodes = [
      { id: 0, x: NW*0.1,  y: NH*0.5, label: 'Nguồn Điện',  icon: '⚡', color: '#F97316' },
      { id: 1, x: NW*0.28, y: NH*0.25, label: 'Biến Tần',   icon: 'VFD', color: '#2563EB' },
      { id: 2, x: NW*0.28, y: NH*0.75, label: 'PLC',         icon: 'PLC', color: '#2563EB' },
      { id: 3, x: NW*0.5,  y: NH*0.15, label: 'Motor A',     icon: 'M', color: '#3B82F6' },
      { id: 4, x: NW*0.5,  y: NH*0.45, label: 'Motor B',     icon: 'M', color: '#3B82F6' },
      { id: 5, x: NW*0.5,  y: NH*0.75, label: 'Sensor',      icon: '📡', color: '#22C55E' },
      { id: 6, x: NW*0.72, y: NH*0.25, label: 'Băng Tải',    icon: '▶▶', color: '#6366F1' },
      { id: 7, x: NW*0.72, y: NH*0.55, label: 'Đóng Gói',   icon: '📦', color: '#6366F1' },
      { id: 8, x: NW*0.72, y: NH*0.82, label: 'HMI/SCADA',  icon: '🖥', color: '#22C55E' },
      { id: 9, x: NW*0.9,  y: NH*0.5,  label: 'Sản Phẩm',   icon: '✔', color: '#F97316' },
    ];

    const edges = [
      [0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[4,7],[5,8],[6,9],[7,9],[8,9],[2,8],
    ];

    // Animated packets flowing along edges
    const packets = edges.map(([from, to]) => ({
      from, to, t: Math.random(), speed: 0.004 + Math.random() * 0.004,
    }));

    function drawNetwork() {
      nctx.clearRect(0, 0, NW, NH);

      // Draw edges
      edges.forEach(([f, t]) => {
        const n1 = nodes[f], n2 = nodes[t];
        nctx.beginPath();
        nctx.moveTo(n1.x, n1.y);
        nctx.lineTo(n2.x, n2.y);
        nctx.strokeStyle = 'rgba(37,99,235,0.18)';
        nctx.lineWidth = 1.5;
        nctx.setLineDash([4, 4]);
        nctx.stroke();
        nctx.setLineDash([]);
      });

      // Draw animated packets
      packets.forEach(pk => {
        pk.t += pk.speed;
        if (pk.t > 1) pk.t = 0;
        const n1 = nodes[pk.from], n2 = nodes[pk.to];
        const px = n1.x + (n2.x - n1.x) * pk.t;
        const py = n1.y + (n2.y - n1.y) * pk.t;
        nctx.beginPath();
        nctx.arc(px, py, 3, 0, Math.PI * 2);
        nctx.fillStyle = 'rgba(249,115,22,0.8)';
        nctx.fill();
      });

      // Draw nodes
      nodes.forEach(n => {
        // Outer ring
        nctx.beginPath();
        nctx.arc(n.x, n.y, 26, 0, Math.PI * 2);
        nctx.fillStyle = `${n.color}18`;
        nctx.fill();
        nctx.strokeStyle = `${n.color}60`;
        nctx.lineWidth = 1.5;
        nctx.stroke();

        // Inner circle
        nctx.beginPath();
        nctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
        nctx.fillStyle = `${n.color}22`;
        nctx.fill();
        nctx.strokeStyle = n.color;
        nctx.lineWidth = 1.5;
        nctx.stroke();

        // Icon/label inside
        nctx.font = '700 9px Inter, sans-serif';
        nctx.fillStyle = '#FFFFFF';
        nctx.textAlign = 'center';
        nctx.textBaseline = 'middle';
        nctx.fillText(n.icon.length <= 3 ? n.icon : n.icon.charAt(0), n.x, n.y);

        // External label
        nctx.font = '500 8.5px Inter, sans-serif';
        nctx.fillStyle = 'rgba(255,255,255,0.55)';
        nctx.textBaseline = 'top';
        nctx.fillText(n.label, n.x, n.y + 30);
      });

      requestAnimationFrame(drawNetwork);
    }

    const netObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) drawNetwork();
    }, { threshold: 0.2 });
    netObserver.observe(netCanvas);
  }

  /* ──────────────────────────────────────────────────────
     22. FAQ Accordion
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const answer   = document.getElementById(btn.getAttribute('aria-controls'));

      // Close all
      document.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const a = document.getElementById(b.getAttribute('aria-controls'));
        if (a) a.hidden = true;
      });

      // Toggle clicked
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;

        // Smooth height animation
        if (!prefersReducedMotion) {
          answer.style.maxHeight = '0';
          answer.style.overflow  = 'hidden';
          answer.style.transition = 'max-height 0.35s ease';
          requestAnimationFrame(() => {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.addEventListener('transitionend', () => {
              answer.style.maxHeight = '';
              answer.style.overflow  = '';
            }, { once: true });
          });
        }
      }
    });
  });

  /* ──────────────────────────────────────────────────────
     23. Contact Form Validation
  ────────────────────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  form && form.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm()) {
      submitForm();
    }
  });

  function setFieldError(inputId, errorId, msg) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errorId);
    if (!input || !err) return false;
    if (msg) {
      input.classList.add('error');
      err.textContent = msg;
      return false;
    }
    input.classList.remove('error');
    err.textContent = '';
    return true;
  }

  function validateForm() {
    let ok = true;

    const name = document.getElementById('fname').value.trim();
    ok = setFieldError('fname', 'fnameError', name.length < 2 ? 'Vui lòng nhập họ tên (ít nhất 2 ký tự).' : '') && ok;

    const phone = document.getElementById('fphone').value.trim();
    const phoneOk = /^(0[0-9]{9})$/.test(phone.replace(/\s/g, ''));
    ok = setFieldError('fphone', 'fphoneError', !phoneOk ? 'Số điện thoại không hợp lệ (10 số bắt đầu bằng 0).' : '') && ok;

    const email = document.getElementById('femail').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    ok = setFieldError('femail', 'femailError', !emailOk ? 'Địa chỉ email không hợp lệ.' : '') && ok;

    const msg = document.getElementById('fmessage').value.trim();
    ok = setFieldError('fmessage', 'fmessageError', msg.length < 20 ? 'Vui lòng mô tả yêu cầu (ít nhất 20 ký tự).' : '') && ok;

    return ok;
  }

  function submitForm() {
    const btn     = form.querySelector('button[type="submit"]');
    const success = document.getElementById('formSuccess');
    btn.disabled  = true;
    btn.querySelector('span').textContent = 'Đang gửi...';

    // Simulate submission (replace with real API call)
    setTimeout(() => {
      form.reset();
      success.hidden = false;
      btn.disabled   = false;
      btn.querySelector('span').textContent = 'Gửi Yêu Cầu Tư Vấn';
      setTimeout(() => { success.hidden = true; }, 6000);
    }, 1200);
  }

  // Inline validation on blur
  ['fname', 'fphone', 'femail', 'fmessage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => {
      // Trigger individual check
      const errId = id + 'Error';
      if (id === 'fname')    setFieldError(id, errId, el.value.trim().length < 2 ? 'Vui lòng nhập họ tên.' : '');
      if (id === 'fphone')   setFieldError(id, errId, !/^(0[0-9]{9})$/.test(el.value.replace(/\s/g, '')) ? 'Số điện thoại không hợp lệ.' : '');
      if (id === 'femail')   setFieldError(id, errId, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value) ? 'Email không hợp lệ.' : '');
      if (id === 'fmessage') setFieldError(id, errId, el.value.trim().length < 20 ? 'Mô tả ít nhất 20 ký tự.' : '');
    });
  });

  /* ──────────────────────────────────────────────────────
     24. GSAP Section Reveal Animations
  ────────────────────────────────────────────────────── */
  if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
    // Challenge cards stagger
    gsap.from('.challenge-card', {
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.challenges-grid',
        start: 'top 80%',
      }
    });

    // Timeline items
    gsap.from('.tl-item', {
      x: (i) => i % 2 === 0 ? -50 : 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 75%',
      }
    });

    // Success cards
    gsap.from('.success-card', {
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.success-grid',
        start: 'top 80%',
      }
    });

    // Network section heading
    gsap.from('.network-section .section-header', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.network-section',
        start: 'top 80%',
      }
    });
  }

  /* ──────────────────────────────────────────────────────
     25. Section Theme — header changes color on dark/light sections
  ────────────────────────────────────────────────────── */
  const lightSections = ['calculator', 'compare', 'solutions', 'timeline', 'success', 'projects', 'faq'];
  if (window.ScrollTrigger) {
    lightSections.forEach(id => {
      const sec = document.getElementById(id);
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 80px',
        end: 'bottom 80px',
        onEnter: ()     => header.classList.add('on-light'),
        onLeave: ()     => header.classList.remove('on-light'),
        onEnterBack: () => header.classList.add('on-light'),
        onLeaveBack: () => header.classList.remove('on-light'),
      });
    });
  }

} // end init()
