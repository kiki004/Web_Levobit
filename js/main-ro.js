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
  
});


//cookes
  // Cookie Consent 
(function() {
  const CONSENT_COOKIE = 'cookie_consent';
  const ANALYTICS_CONSENT = 'ga_consent';
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Înlocuiți cu ID-ul dvs. Google Analytics

  // Funcții ajutătoare
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Google Analytics
  let gaLoaded = false;
  function initGoogleAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
  }

  function disableGoogleAnalytics() {
    if (window.gtag) {
      window['ga-disable-' + GA_MEASUREMENT_ID] = true;
    }
    gaLoaded = false;
  }

  function setConsent(allowAnalytics) {
    setCookie(CONSENT_COOKIE, 'true', 365);
    if (allowAnalytics) {
      setCookie(ANALYTICS_CONSENT, 'true', 365);
      initGoogleAnalytics();
    } else {
      setCookie(ANALYTICS_CONSENT, 'false', 365);
      disableGoogleAnalytics();
    }
    const banner = document.getElementById('cookieBanner');
    const floatingIcon = document.getElementById('cookieFloatingIcon');
    if (banner) banner.style.display = 'none';
    if (floatingIcon) floatingIcon.style.display = 'flex';
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Verificăm consimțământul existent
    const hasConsented = getCookie(CONSENT_COOKIE);
    const banner = document.getElementById('cookieBanner');
    const floatingIcon = document.getElementById('cookieFloatingIcon');

    if (hasConsented) {
      if (banner) banner.style.display = 'none';
      if (floatingIcon) floatingIcon.style.display = 'flex';
      const gaConsent = getCookie(ANALYTICS_CONSENT);
      if (gaConsent === 'true') initGoogleAnalytics();
      else disableGoogleAnalytics();
    } else {
      if (banner) banner.style.display = 'block';
      if (floatingIcon) floatingIcon.style.display = 'none';
    }

    const acceptBtn = document.getElementById('acceptCookiesBtn');
    const declineBtn = document.getElementById('declineCookiesBtn');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() { setConsent(true); });
    }
    if (declineBtn) {
      declineBtn.addEventListener('click', function() { setConsent(false); });
    }

    const modal = document.getElementById('cookieModal');
    const modalBody = document.getElementById('cookieModalBody');
    let loadedContent = {};

    window.loadTab = function(tabId) {
      if (tabId === 'settings') {
        const currentGaConsent = getCookie(ANALYTICS_CONSENT);
        const isAnalyticsEnabled = (currentGaConsent === 'true');
        const statusText = isAnalyticsEnabled ? 'Activate' : 'Dezactivate';
        const settingsHtml = `
          <div class="cookie-settings-panel">
            <h3>Setări cookie</h3>
            <p>Puteți modifica oricând preferința pentru cookie-urile de analiză (Google Analytics).</p>
            <div class="current-status">Starea curentă: <strong>${statusText}</strong></div>
            <button id="settingsAcceptBtn" class="cookie-settings-btn accept">Accept analiză</button>
            <button id="settingsDeclineBtn" class="cookie-settings-btn decline">Refuz analiză</button>
          </div>
        `;
        modalBody.innerHTML = settingsHtml;
        const settingsAccept = document.getElementById('settingsAcceptBtn');
        const settingsDecline = document.getElementById('settingsDeclineBtn');
        if (settingsAccept) {
          settingsAccept.addEventListener('click', function() {
            setConsent(true);
            if (document.querySelector('.cookie-tab-btn.active')?.getAttribute('data-tab') === 'settings') {
              window.loadTab('settings');
            }
          });
        }
        if (settingsDecline) {
          settingsDecline.addEventListener('click', function() {
            setConsent(false);
            if (document.querySelector('.cookie-tab-btn.active')?.getAttribute('data-tab') === 'settings') {
              window.loadTab('settings');
            }
          });
        }
        return;
      }

      const fileMap = {
        privacy: '../ro/privacy-policy.html',
        cookie: '../ro/cookie-policy.html',
        terms: '../ro/terms-of-service.html'
      };
      if (loadedContent[tabId]) {
        modalBody.innerHTML = loadedContent[tabId];
        return;
      }
      modalBody.innerHTML = '<div class="cookie-tab-loader">Se încarcă...</div>';
      fetch(fileMap[tabId])
        .then(response => {
          if (!response.ok) throw new Error('Not found');
          return response.text();
        })
        .then(html => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          let content = tempDiv.querySelector('main') || tempDiv.querySelector('.legal-content') || tempDiv.querySelector('body');
          const innerHtml = content ? content.innerHTML : html;
          loadedContent[tabId] = innerHtml;
          modalBody.innerHTML = innerHtml;
        })
        .catch(function() {
          modalBody.innerHTML = '<div class="cookie-tab-loader">Nu s-a putut încărca conținutul. Încercați din nou mai târziu.</div>';
        });
    };

    // Iconița plutitoare - deschide modal
    if (floatingIcon) {
      floatingIcon.addEventListener('click', function() {
        if (modal) modal.style.display = 'flex';
        const activeTabBtn = document.querySelector('.cookie-tab-btn.active');
        if (activeTabBtn) window.loadTab(activeTabBtn.getAttribute('data-tab'));
        else window.loadTab('privacy');
      });
    }

    // Închiderea modalei
    const closeModalBtn = document.querySelector('.cookie-modal-close');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', function() {
        if (modal) modal.style.display = 'none';
      });
    }
    window.addEventListener('click', function(event) {
      if (event.target === modal) modal.style.display = 'none';
    });

    // Comutare fileuri
    const tabBtns = document.querySelectorAll('.cookie-tab-btn');
    tabBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const tab = this.getAttribute('data-tab');
        tabBtns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        window.loadTab(tab);
      });
    });

    // Încărcare filă activă inițială
    const activeTab = document.querySelector('.cookie-tab-btn.active');
    if (activeTab) window.loadTab(activeTab.getAttribute('data-tab'));
  });
})();
