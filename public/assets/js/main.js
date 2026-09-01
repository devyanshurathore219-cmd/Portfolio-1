/**
 * DigiWebNow | Custom Web Engineering - Award-Winning JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initThemeToggle();
  initCursorSpotlight();
  initParticleCanvas();
  initScrollReveals();
  initObjectivesShowcase();
  initProjectModals();
  initWebEstimator();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Header Navigation & Active Links
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let current = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. Theme Switcher
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  const currentTheme = localStorage.getItem('digi_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('digi_theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  const icon = themeBtn.querySelector('i');
  if (icon) {
    icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
}

/* --------------------------------------------------------------------------
   3. Custom Mouse Glow Spotlight
   -------------------------------------------------------------------------- */
function initCursorSpotlight() {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-glow';
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* --------------------------------------------------------------------------
   4. Background Particles Canvas
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(255, 107, 0, ' : 'rgba(0, 242, 254, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  const count = Math.min(Math.floor(window.innerWidth / 22), 50);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 107, 0, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   5. Scroll-Triggered Reveal Animations
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   6. Objectives Section Showcase Tab Switcher
   -------------------------------------------------------------------------- */
function initObjectivesShowcase() {
  const tabBtns = document.querySelectorAll('.showcase-tab-btn');
  const slides = document.querySelectorAll('.showcase-slide');
  const titleDisplay = document.getElementById('showcase-title-display');
  const urlDisplay = document.getElementById('showcase-url-display');

  if (!tabBtns.length || !slides.length) return;

  const metaData = {
    'showcase-slide-iyou': {
      title: "iYOU Global Corporate Platform",
      url: "https://iyouglobal.com/"
    },
    'showcase-slide-gaur': {
      title: "Gaur Furniture E-Commerce Store",
      url: "https://www.gaurfurniture.com/"
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSlideId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      slides.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const activeSlide = document.getElementById(targetSlideId);
      if (activeSlide) activeSlide.classList.add('active');

      if (metaData[targetSlideId]) {
        if (titleDisplay) titleDisplay.textContent = metaData[targetSlideId].title;
        if (urlDisplay) {
          urlDisplay.textContent = metaData[targetSlideId].url;
          urlDisplay.href = metaData[targetSlideId].url;
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Featured Project Case Study Modals
   -------------------------------------------------------------------------- */
const customWebProjects = {
  iyou: {
    title: "iYOU Global - International Enterprise Platform",
    url: "https://iyouglobal.com/",
    category: "Custom Web Engineering",
    image: "assets/images/iyouglobal.jpg",
    client: "iYOU Global",
    stack: ["HTML5 / CSS3 Custom Architecture", "JavaScript ES6+", "Responsive Grid", "Core Web Vitals Optimized"],
    overview: "iYOU Global requested a bespoke, highly responsive enterprise platform. Built from scratch with clean typography, dynamic layout structures, and fast client-side performance.",
    highlights: ["Global Brand Positioning", "Sub-second Page Load", "Tailored Custom UI"]
  },
  gaur: {
    title: "Gaur Furniture - Luxury E-Commerce & Interior Store",
    url: "https://www.gaurfurniture.com/",
    category: "Custom E-Commerce Storefront",
    image: "assets/images/gaur_furniture.jpg",
    client: "Gaur Furniture",
    stack: ["Tailored E-Commerce System", "Product Catalog UI", "Mobile First UX", "Conversion Architecture"],
    overview: "A custom e-commerce solution engineered for Gaur Furniture. Designed to showcase high-end wooden craftsmanship with elegant visual catalogs, frictionless product exploration, and high conversion flow.",
    highlights: ["High-End Visual Layout", "Responsive Catalog System", "Seamless Purchasing UI"]
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-content-area');

  if (!modalOverlay || !modalBody) return;

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-project');
      const data = customWebProjects[projectKey];

      if (data) {
        modalBody.innerHTML = `
          <div class="modal-img-wrapper">
            <img src="${data.image}" alt="${data.title}">
          </div>
          <div class="portfolio-tags" style="margin-bottom:1rem;">
            <span class="tag">${data.category}</span>
            <span class="tag">Client: ${data.client}</span>
          </div>
          <h2 style="font-family:var(--font-heading); font-size:1.85rem; font-weight:800; margin-bottom:1rem;">${data.title}</h2>
          <p style="color:var(--text-muted); font-size:1rem; margin-bottom:1.5rem; line-height:1.7;">${data.overview}</p>
          
          <h4 style="font-family:var(--font-heading); font-size:1.15rem; font-weight:700; margin-bottom:0.75rem;">Technology & Architectural Highlights:</h4>
          <ul style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.5rem; margin-bottom:1.5rem;">
            ${data.stack.map(s => `<li style="font-size:0.9rem; color:var(--text-main);"><i class="fa-solid fa-check-circle" style="color:var(--accent-orange); margin-right:0.5rem;"></i> ${s}</li>`).join('')}
          </ul>

          <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-top:2rem;">
            <a href="${data.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Live Production Website
            </a>
            <button onclick="closeModal()" class="btn btn-secondary">Close Window</button>
          </div>
        `;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

function closeModal() {
  const modalOverlay = document.getElementById('project-modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

/* --------------------------------------------------------------------------
   8. Exclusive Custom Web Scope Estimator
   -------------------------------------------------------------------------- */
function initWebEstimator() {
  const webInputs = document.querySelectorAll('.estimator-web-input');
  const speedInputs = document.querySelectorAll('input[name="turnaround"]');
  const priceDisplay = document.getElementById('estimated-price');
  const selectedList = document.getElementById('selected-services-list');
  const inquiryBtn = document.getElementById('estimator-inquiry-btn');

  if (!priceDisplay || !selectedList) return;

  function calculateTotal() {
    let total = 0;
    let selectedItemsHTML = '';
    let count = 0;

    webInputs.forEach(input => {
      const parentLabel = input.closest('.option-card-label');
      if (input.checked) {
        const cost = parseInt(input.getAttribute('data-cost') || '0', 10);
        const name = input.getAttribute('data-name');
        total += cost;
        count++;
        if (parentLabel) parentLabel.classList.add('selected');
        selectedItemsHTML += `<li><span>${name}</span> <strong>$${cost}</strong></li>`;
      } else {
        if (parentLabel) parentLabel.classList.remove('selected');
      }
    });

    let multiplier = 1.0;
    speedInputs.forEach(speed => {
      const parentLabel = speed.closest('.option-card-label');
      if (speed.checked) {
        multiplier = parseFloat(speed.getAttribute('data-multiplier') || '1.0');
        if (parentLabel) parentLabel.classList.add('selected');
      } else {
        if (parentLabel) parentLabel.classList.remove('selected');
      }
    });

    const finalTotal = Math.round(total * multiplier);

    if (count === 0) {
      priceDisplay.textContent = '$0';
      selectedList.innerHTML = `<li style="font-style:italic;">No custom features selected yet. Choose from options on the left.</li>`;
    } else {
      priceDisplay.textContent = `$${finalTotal.toLocaleString()}`;
      selectedList.innerHTML = selectedItemsHTML;
    }
  }

  webInputs.forEach(input => input.addEventListener('change', calculateTotal));
  speedInputs.forEach(input => input.addEventListener('change', calculateTotal));

  if (inquiryBtn) {
    inquiryBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const messageBox = document.getElementById('contact-message');
        const price = priceDisplay.textContent;
        if (messageBox) {
          messageBox.value = `Hi DigiWebNow Team, I used your Custom Web Estimator and would like to build a tailored website with my selection (Estimated budget around ${price}). Let's discuss details!`;
        }
      }
    });
  }

  calculateTotal();
}

/* --------------------------------------------------------------------------
   9. Contact Form Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('digi-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const phone = document.getElementById('contact-phone').value;
    const webType = document.getElementById('contact-web-type').value;

    const alertArea = document.getElementById('form-alert-area');
    if (alertArea) {
      alertArea.innerHTML = `
        <div style="padding:1.25rem; background:rgba(255, 107, 0, 0.15); border:1px solid var(--accent-orange); border-radius:var(--radius-md); color:var(--text-main); margin-bottom:1.5rem;">
          <h4 style="font-family:var(--font-heading); font-size:1.1rem; color:var(--accent-orange); margin-bottom:0.25rem;">
            <i class="fa-solid fa-paper-plane" style="margin-right:0.5rem;"></i> Thank You, ${name}!
          </h4>
          <p style="font-size:0.9rem; color:var(--text-muted);">
            Your inquiry for <strong>${webType}</strong> has been received by DigiWebNow. DigiWebNow team will get back to you within 24 hours at <strong>${email}</strong> / <strong>${phone}</strong>.
          </p>
        </div>
      `;
    }
    form.reset();
  });
}
