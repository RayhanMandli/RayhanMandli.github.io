/* ============================
   script.js — Portfolio Interactions
   ============================ */

document.addEventListener('DOMContentLoaded', () => {
  triggerHeroEntrance();
  initNavbar();
  initParticles();
  initRotatingText();
  initScrollAnimations();
  initSkillsAssemble();
  initMobileMenu();
  initDownloadTooltip();
  initPortraitTilt();
  initProjectTilt();
  initProjectMobile();
  initTimelineScroll();
  initMusicPlayer();
});

/* ============================
   HERO ENTRANCE
   ============================ */
function triggerHeroEntrance() {
  const heroElements = document.querySelectorAll('.anim-hero');
  heroElements.forEach((el, idx) => {
    setTimeout(() => {
      el.classList.add('animate-in');
    }, idx * 150);
  });
}

/* ============================
   NAVBAR
   ============================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }, { passive: true });
}

/* ============================
   MOBILE MENU
   ============================ */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const links = document.querySelector('.navbar__links');

  function openMenu() {
    links.classList.add('open');
    toggle.classList.add('active');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    links.classList.remove('open');
    toggle.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', () => {
    if (links.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on click outside (clicking overlay background)
  links.addEventListener('click', (e) => {
    if (e.target === links) closeMenu();
  });
}

/* ============================
   DOWNLOAD BUTTON TOOLTIP
   ============================ */
function initDownloadTooltip() {
  const btn = document.querySelector('.btn-download');
  if (!btn) return;

  const tooltip = document.createElement('span');
  tooltip.className = 'btn-tooltip';
  tooltip.textContent = 'Download Resume';
  btn.appendChild(tooltip);

  const isMobile = window.innerWidth < 768;

  if (!isMobile) {
    btn.addEventListener('mouseenter', () => {
      tooltip.classList.add('tooltip-visible');
    });
    btn.addEventListener('mouseleave', () => {
      tooltip.classList.remove('tooltip-visible');
    });
  } else {
    btn.addEventListener('click', () => {
      tooltip.classList.add('tooltip-visible');
      setTimeout(() => tooltip.classList.remove('tooltip-visible'), 2000);
    });
  }
}

/* ============================
   PORTRAIT TILT + PULSE (Desktop)
   ============================ */
function initPortraitTilt() {
  if (window.innerWidth <= 1024) return;

  const portrait = document.querySelector('.hero__portrait');
  const frame = document.querySelector('.hero__portrait-frame');
  const glow = document.querySelector('.hero__portrait-glow');
  if (!portrait || !frame) return;

  let rafId = null;
  let isTilting = false;

  portrait.addEventListener('mouseenter', () => {
    isTilting = true;
    frame.classList.add('tilt-active');

    // Trigger accent pulse (once per enter)
    portrait.classList.remove('portrait-hovered');
    void portrait.offsetWidth;
    portrait.classList.add('portrait-hovered');

    // Particle attraction boost
    if (window.particlesContainer) {
      try {
        const opts = window.particlesContainer.options.interactivity.modes;
        opts.attract.distance = 200;
      } catch(e) {}
    }
  });

  portrait.addEventListener('mousemove', (e) => {
    if (!isTilting) return;
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      const rect = portrait.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 2;
      const rotateX = ((centerY - y) / centerY) * 2;

      frame.style.transition = 'none';
      frame.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      if (glow) {
        glow.style.transition = 'none';
        glow.style.transform = `translateX(-10px) perspective(800px) rotateX(${rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg)`;
      }
    });
  });

  portrait.addEventListener('mouseleave', () => {
    isTilting = false;
    if (rafId) cancelAnimationFrame(rafId);

    // Smooth reset
    frame.style.transition = 'transform 0.4s ease-out';
    frame.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    if (glow) {
      glow.style.transition = 'transform 0.4s ease-out';
      glow.style.transform = 'translateX(-10px)';
    }

    // After transition, restore float animation
    setTimeout(() => {
      frame.classList.remove('tilt-active');
      frame.style.transition = '';
      frame.style.transform = '';
      if (glow) {
        glow.style.transition = '';
      }
    }, 420);

    // Reset particle attraction
    if (window.particlesContainer) {
      try {
        const opts = window.particlesContainer.options.interactivity.modes;
        opts.attract.distance = 150;
      } catch(e) {}
    }
  });
}

/* ============================
   TSPARTICLES (Hero Only)
   ============================ */
function initParticles() {
  // Disable on mobile
  if (window.innerWidth < 768) return;

  tsParticles.load('tsparticles', {
    fullScreen: { enable: false },
    fpsLimit: 60,
    particles: {
      number: {
        value: 35,
        density: { enable: true, area: 900 }
      },
      color: { value: '#00E5FF' },
      opacity: {
        value: { min: 0.1, max: 0.25 }
      },
      size: {
        value: { min: 1.5, max: 3 }
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: 'none',
        outModes: { default: 'out' }
      },
      links: {
        enable: false
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: ['repulse']
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
          speed: 0.5
        },
        attract: {
          distance: 150,
          duration: 0.8
        }
      }
    },
    detectRetina: true
  }).then(container => {
    window.particlesContainer = container;
  });

  // Disable particles when scrolled past hero
  const hero = document.getElementById('hero');
  let particlesDisabled = false;
  const particlesContainer = document.getElementById('tsparticles');

  window.addEventListener('scroll', () => {
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    if (window.scrollY > heroBottom && !particlesDisabled) {
      particlesDisabled = true;
      particlesContainer.style.opacity = '0';
      particlesContainer.style.transition = 'opacity 0.5s ease';
    } else if (window.scrollY <= heroBottom && particlesDisabled) {
      particlesDisabled = false;
      particlesContainer.style.opacity = '1';
    }
  }, { passive: true });
}

/* ============================
   ROTATING SUBTITLE
   ============================ */
function initRotatingText() {
  const el = document.getElementById('rotating-text');
  const words = ['Builder', 'Thinker', 'Solver', 'Architect', 'Engineer'];
  let index = 0;

  setInterval(() => {
    // Fade out
    el.classList.add('fade-out');

    setTimeout(() => {
      index = (index + 1) % words.length;
      el.textContent = words[index];
      el.classList.remove('fade-out');
    }, 400);
  }, 2500);
}

/* ============================
   SCROLL ANIMATIONS
   ============================ */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.anim-fade').forEach(el => {
    observer.observe(el);
  });
}

/* ============================
   SKILLS ASSEMBLE EFFECT
   ============================ */
function initSkillsAssemble() {
  const skillsSection = document.getElementById('skills');
  const allSkillItems = skillsSection.querySelectorAll('.skill-item');
  let hasAnimated = false;

  // Set initial scatter state
  allSkillItems.forEach(item => {
    const offsetX = (Math.random() * 2 - 1) * (15 + Math.random() * 10);
    const offsetY = (Math.random() * 2 - 1) * (15 + Math.random() * 10);
    item.style.setProperty('--scatter-x', `${offsetX}px`);
    item.style.setProperty('--scatter-y', `${offsetY}px`);
    item.classList.add('scatter');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          allSkillItems.forEach((item, idx) => {
            setTimeout(() => {
              item.classList.remove('scatter');
              item.classList.add('assemble');
            }, idx * 50);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(skillsSection);
}

/* ============================
   PROJECT 3D TILT (Desktop)
   ============================ */
function initProjectTilt() {
  if (window.innerWidth < 768) return;

  const previews = document.querySelectorAll('.project__preview');

  previews.forEach(preview => {
    let rafId = null;
    let currentX = 0;
    let currentY = 0;

    preview.addEventListener('mouseenter', () => {
      preview.style.transition = 'box-shadow 0.3s ease';
    });

    preview.addEventListener('mousemove', (e) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = preview.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 3;
        const rotateX = ((centerY - y) / centerY) * 3;

        preview.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
    });

    preview.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      preview.style.transition = 'transform 0.4s ease-out, box-shadow 0.3s ease';
      preview.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });
}

/* ============================
   PROJECT MOBILE OVERLAY + TOOLTIPS
   ============================ */
let projectInteractionsInitialized = false;

function initProjectMobile() {
  if (projectInteractionsInitialized) return;
  projectInteractionsInitialized = true;

  const previews = document.querySelectorAll('.project__preview');
  const liveButtons = document.querySelectorAll('.btn--live[data-deployed="false"]');
  const isMobile = window.innerWidth < 768;

  // --- Tooltip system for undeployed Live Site buttons ---
  liveButtons.forEach(btn => {
    // Create tooltip element
    const tooltip = document.createElement('span');
    tooltip.className = 'btn-tooltip';
    tooltip.textContent = 'Deployment Temporarily Disabled';
    btn.appendChild(tooltip);

    // Prevent navigation
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Show tooltip on tap (mobile)
      if (isMobile) {
        tooltip.classList.add('tooltip-visible');
        setTimeout(() => tooltip.classList.remove('tooltip-visible'), 2500);
      }
    });

    // Desktop hover tooltip
    if (!isMobile) {
      btn.addEventListener('mouseenter', () => {
        tooltip.classList.add('tooltip-visible');
      });

      btn.addEventListener('mouseleave', () => {
        tooltip.classList.remove('tooltip-visible');
      });
    }
  });

  // --- Mobile overlay toggle ---
  if (isMobile) {
    previews.forEach(preview => {
      preview.addEventListener('click', (e) => {
        const clickedBtn = e.target.closest('.btn');

        // If overlay is active
        if (preview.classList.contains('overlay-active')) {
          // Let GitHub buttons navigate normally
          if (clickedBtn && !clickedBtn.classList.contains('btn--live')) return;
          // Live Site buttons are handled by their own listener above
          if (clickedBtn && clickedBtn.classList.contains('btn--live')) return;
          // Tap on overlay background — close it
          preview.classList.remove('overlay-active');
          return;
        }

        // First tap — show overlay, prevent any navigation
        e.preventDefault();
        previews.forEach(p => p.classList.remove('overlay-active'));
        preview.classList.add('overlay-active');
      });
    });

    // Close overlay on outside tap
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.project__preview')) {
        previews.forEach(p => p.classList.remove('overlay-active'));
      }
    });
  }
}

/* ============================
   TIMELINE AUTO-SCROLL TO ACTIVE
   ============================ */
function initTimelineScroll() {
  const track = document.querySelector('.timeline__track');
  const activeItem = document.querySelector('.timeline__item--active');
  const focusSection = document.getElementById('focus');
  if (!track || !activeItem || !focusSection) return;

  // Only auto-scroll on desktop (horizontal layout)
  if (window.innerWidth < 768) return;

  let hasScrolled = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasScrolled) {
          hasScrolled = true;
          // Wait for fade-in animation to start
          setTimeout(() => {
            const trackRect = track.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();
            const trackScrollLeft = track.scrollLeft;

            // Calculate scroll to center the active item
            const itemCenter = (itemRect.left - trackRect.left) + trackScrollLeft + (itemRect.width / 2);
            const trackCenter = trackRect.width / 2;
            const scrollTo = itemCenter - trackCenter;

            track.scrollTo({ left: Math.max(0, scrollTo), behavior: 'smooth' });
          }, 400);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(focusSection);
}

/* ============================
   FLOATING MUSIC PLAYER
   ============================ */
function initMusicPlayer() {
  if (window.innerWidth < 768) return;

  const player = document.getElementById('music-player');
  const toggle = document.getElementById('music-toggle');
  if (!player || !toggle) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    player.classList.toggle('open');
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!player.contains(e.target)) {
      player.classList.remove('open');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      player.classList.remove('open');
    }
  });
}
