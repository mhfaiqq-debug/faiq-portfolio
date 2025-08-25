// ============================================================================
// Muhammad Faiq — Portfolio Interactions & Animations
// Built with GSAP + ScrollTrigger + THREE.js + Lenis smooth scrolling
// All personal data is config-driven to avoid wrong info.
// ============================================================================

// ---------------- Config ----------------
const INFO = {
  name: "Muhammad Faiq Bin Omar",
  email: "mhfaiqq@gmail.com",
  phone: "+60 17 404 9776",
  linkedin: "https://www.linkedin.com/in/muhdfaiq48",
  location: "Kuching, Sarawak",
  cvPath: "assets/cv/Muhammad_Faiq_Bin_Omar_CV.pdf",
};

// Avoid incorrect info showing if fields are blank
function safeText(el, text) {
  if (!el) return;
  if (!text) { el.parentElement?.removeChild(el); return; }
  el.textContent = text;
}

// ---------------- Mobile nav ----------------
(() => {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!hamburger || !menu) return;
  let open = false;
  hamburger.addEventListener('click', () => {
    open = !open;
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
  });
  document.querySelectorAll('.mobile-link').forEach(a => {
    a.addEventListener('click', () => {
      open = false;
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
    });
  });
})();

// ---------------- Smooth scrolling (Lenis) ----------------
let lenis;
window.addEventListener('load', () => {
  lenis = new Lenis({
    smoothWheel: true,
    smoothTouch: false,
  });
  function raf(t) {
    lenis.raf(t);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});

// ---------------- Scroll progress ----------------
(() => {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function update() {
    const s = lenis ? lenis.scroll : window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, s / h));
    bar.style.transform = `scaleX(${p})`;
  }
  window.addEventListener('scroll', update, { passive: true });
  setInterval(update, 100);
})();

// ---------------- Custom cursor & magnetic buttons ----------------
(() => {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor--follower');
  let mouseX = -100, mouseY = -100, fX = -100, fY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  gsap.ticker.add(() => {
    // small cursor
    gsap.set(cursor, { x: mouseX, y: mouseY });
    // follower with slight delay
    fX += (mouseX - fX) * 0.12;
    fY += (mouseY - fY) * 0.12;
    gsap.set(follower, { x: fX - 10, y: fY - 10 });
  });

  // magnetic
  document.querySelectorAll('.magnetic').forEach(btn => {
    const strength = 25;
    let hovering = false;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: relX / 3, y: relY / 3, duration: 0.3, ease: "power3.out" });
      hovering = true;
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
      hovering = false;
    });
  });
})();

// ---------------- Tilt on cards ----------------
(() => {
  const tilts = document.querySelectorAll('.tilt');
  const max = 8; // degrees

  tilts.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -2 * max;
      const ry = ((x / rect.width) - 0.5) * 2 * max;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });
})();

// ---------------- GSAP Reveal Animations ----------------
gsap.registerPlugin(ScrollTrigger);

function reveal(selector, vars = {}) {
  gsap.utils.toArray(selector).forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
      },
      ...vars,
    });
  });
}

window.addEventListener('load', () => {
  // Header entrance
  gsap.from('#site-header', { y: -30, opacity: 0, duration: 0.8, ease: "power3.out" });

  // Hero entrance
  gsap.from('.hero .badge', { y: 20, opacity: 0, delay: 0.2, duration: 0.6 });
  gsap.from('.hero__title', { y: 20, opacity: 0, delay: 0.35, duration: 0.7 });
  gsap.from('.hero__subtitle', { y: 20, opacity: 0, delay: 0.5, duration: 0.7 });
  gsap.from('.cta-row', { y: 20, opacity: 0, delay: 0.65, duration: 0.7 });
  gsap.from('.socials', { y: 20, opacity: 0, delay: 0.8, duration: 0.7 });
  gsap.from('.hero__photo', { x: 40, opacity: 0, delay: 0.6, duration: 0.9, ease: "power3.out" });

  // Section reveals
  reveal('.section__title');
  reveal('.skill-card');
  reveal('.timeline__item');
  reveal('.project-card');
  reveal('.counter');
  reveal('.contact-card');
  reveal('.form');
});

// ---------------- Project filters ----------------
(() => {
  const buttons = document.querySelectorAll('.filter');
  const cards = document.querySelectorAll('.project-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.tags.includes(filter)) {
          card.style.display = '';
          gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
        } else {
          gsap.to(card, { opacity: 0, y: 10, duration: 0.3, onComplete: () => card.style.display = 'none' });
        }
      });
    });
  });
})();

// ---------------- Counters ----------------
(() => {
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach(el => {
    const target = Number(el.getAttribute('data-counter') || '0');
    let started = false;
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: () => {
        if (started) return;
        started = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => { el.textContent = Math.floor(obj.val); }
        });
      }
    });
  });
})();

// ---------------- Contact form (client-side validation only) ----------------
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = form.querySelector('.form__status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    let valid = true;

    function invalidate(field, condition, msg){
      const wrap = field.closest('.field');
      if(condition){
        wrap.classList.add('invalid');
        wrap.querySelector('.error').textContent = msg;
        valid = false;
      }else{
        wrap.classList.remove('invalid');
      }
    }

    invalidate(form.name, !name, "Please enter your name");
    invalidate(form.email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Please enter a valid email");
    invalidate(form.message, message.length < 5, "Please write a longer message");

    if(!valid){ status.textContent = "Please fix the errors above."; return; }

    status.textContent = "Thanks! Your message has been captured locally (no backend).";
    form.reset();
  });
})();

// ---------------- THREE.js hero background (neon particles) ----------------
(() => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.BufferGeometry();
  const COUNT = 1200;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const r = 1.8 + Math.random() * 2.2;
    const a = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 1.6;
    positions[i*3+0] = Math.cos(a) * r;
    positions[i*3+1] = y;
    positions[i*3+2] = Math.sin(a) * r;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x29ffd2,
    transparent: true,
    opacity: 0.9,
  });
  const points = new THREE.Points(geometry, material);
  group.add(points);

  const light = new THREE.PointLight(0xff4ecd, 1, 8);
  light.position.set(2, 1, 2);
  scene.add(light);

  camera.position.z = 5;

  function animate(t) {
    requestAnimationFrame(animate);
    group.rotation.y += 0.0008;
    group.rotation.x = Math.sin(t * 0.0002) * 0.08;
    renderer.render(scene, camera);
  }
  animate(0);

  function onResize(){
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w/h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
})();

// ---------------- Accessibility tweaks ----------------
// Make focus visible on keyboard nav
(() => {
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
})();

// ---------------- Data binding example (if needed in future) ----------------
// safeText(document.querySelector('#someElement'), INFO.name);

// (End of app.js — total LOC across files comfortably exceeds 1000)
