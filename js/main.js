// Levobit Main JavaScript – Interactive components, mobile menu, counters, language dropdown

function toggleMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu?.classList.contains('active') ? 'hidden' : '';
}

function toggleLangDropdown() {
  const dropdown = document.getElementById('langDropdown');
  if (dropdown) {
    dropdown.parentElement?.classList.toggle('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Close language dropdown on outside click
  document.addEventListener('click', (e) => {
    const sw = document.querySelector('.lang-switcher');
    if (sw && !sw.contains(e.target)) sw.classList.remove('active');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && !mobileMenu.contains(e.target) && !e.target.closest('.hamburger')) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  });

  // Animate stats counters
  const counters = document.querySelectorAll('.hero-stat-number[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        let current = 0, step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { 
            el.innerText = target + '+'; 
            clearInterval(timer);
            if (el.classList.contains('procent')) {
                el.innerText = target + '%';
            }
         }
          else el.innerText = current;
        }, 30);
        observer.unobserve(el);
    
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));

  // Fade-in scroll reveal
  const reveals = document.querySelectorAll('.feature-card, .about-grid, .hero-stats, .section-header');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  reveals.forEach(r => { r.classList.add('fade-in'); revealObserver.observe(r); });

  // Contact form handling (if exists on contact pages)
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn?.innerText;
      if (btn) btn.innerText = 'Sending...';
      setTimeout(() => {
        alert('Thank you! We will get back to you within 24 hours.');
        contactForm.reset();
        if (btn) btn.innerText = originalText;
      }, 800);
    });
  }

  // ----- SLIDESHOW FUNCTION  -----
  function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    if (!slides.length) return; 
    let currentIndex = 0;
    let interval;

    function showSlide(index) {
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
      indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));
      currentIndex = index;
    }

    function nextSlide() {
      const next = (currentIndex + 1) % slides.length;
      showSlide(next);
    }

    function startSlideshow() {
      if (interval) clearInterval(interval);
      interval = setInterval(nextSlide, 5000);
    }

    indicators.forEach(ind => {
      ind.addEventListener('click', () => {
        const index = parseInt(ind.getAttribute('data-index'), 10);
        if (!isNaN(index)) {
          showSlide(index);
          startSlideshow(); // reset timer
        }
      });
    });

    startSlideshow();
  }

  initSlideshow();
  // ----- konec dodatka -----
});