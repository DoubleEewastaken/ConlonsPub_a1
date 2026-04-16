/**
 * Conlon's Pub — Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===========================
  // Navbar scroll effect
  // ===========================
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ===========================
  // Mobile menu toggle
  // ===========================
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when link clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ===========================
  // Scroll animations
  // ===========================
  const animateElements = () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      // Animate section headers
      const header = section.querySelector('.section-header');
      if (header) addFadeClass(header, 'fade-in');

      // Animate cards and content blocks
      section.querySelectorAll('.about-card, .game-card, .drink-item, .review-card, .contact-card, .hours-row').forEach((el, i) => {
        addFadeClass(el, 'fade-in');
        el.style.transitionDelay = `${i * 0.08}s`;
      });

      // Animate images
      section.querySelectorAll('.drinks-image, .games-image').forEach(el => {
        addFadeClass(el, 'fade-in');
      });

      // Drinks content
      const drinksContent = section.querySelector('.drinks-content');
      if (drinksContent) addFadeClass(drinksContent, 'fade-in-right');

      // Games content
      const gamesContent = section.querySelector('.games-content');
      if (gamesContent) addFadeClass(gamesContent, 'fade-in-left');

      // Hours info
      const hoursInfo = section.querySelector('.hours-info');
      if (hoursInfo) addFadeClass(hoursInfo, 'fade-in-left');

      const hoursPopular = section.querySelector('.hours-popular');
      if (hoursPopular) addFadeClass(hoursPopular, 'fade-in-right');

      // Contact layout
      const contactMap = section.querySelector('.contact-map');
      if (contactMap) addFadeClass(contactMap, 'fade-in-left');

      const contactInfo = section.querySelector('.contact-info');
      if (contactInfo) addFadeClass(contactInfo, 'fade-in-right');
    });
  };

  function addFadeClass(el, className) {
    if (!el.classList.contains(className)) {
      el.classList.add(className);
    }
  }

  animateElements();

  // Intersection observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });

  // ===========================
  // Popular times bar chart animation
  // ===========================
  const popularBars = document.querySelectorAll('.popular-bar');
  popularBars.forEach(bar => {
    const height = bar.getAttribute('data-height');
    bar.style.setProperty('--bar-h', height + '%');
  });

  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.popular-bar');
        bars.forEach((bar, i) => {
          setTimeout(() => {
            bar.classList.add('animated');
          }, i * 100);
        });
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const popularChart = document.getElementById('popular-chart');
  if (popularChart) chartObserver.observe(popularChart);

  // ===========================
  // Reviews carousel
  // ===========================
  const carousel = document.getElementById('reviews-carousel');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  const dotsContainer = document.getElementById('reviews-dots');

  if (carousel && prevBtn && nextBtn && dotsContainer) {
    const cards = carousel.querySelectorAll('.review-card');
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();

    function getCardsPerView() {
      const width = window.innerWidth;
      if (width <= 600) return 1;
      if (width <= 900) return 2;
      return 3;
    }

    function getTotalPages() {
      return Math.max(1, cards.length - cardsPerView + 1);
    }

    function createDots() {
      dotsContainer.innerHTML = '';
      const total = getTotalPages();
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(index) {
      const total = getTotalPages();
      currentIndex = Math.max(0, Math.min(index, total - 1));
      
      const card = cards[0];
      const cardWidth = card.offsetWidth + parseInt(getComputedStyle(carousel).gap);
      carousel.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth'
      });

      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    window.addEventListener('resize', () => {
      cardsPerView = getCardsPerView();
      createDots();
      goTo(0);
    });

    createDots();
  }

  // ===========================
  // Smooth scroll for nav links
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===========================
  // Active nav link tracking
  // ===========================
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--color-accent)';
          }
        });
      }
    });
  }, {
    threshold: 0.3
  });

  sections.forEach(section => sectionObserver.observe(section));

  // ===========================
  // Parallax on hero image (subtle)
  // ===========================
  const heroImg = document.querySelector('.hero-bg-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll < window.innerHeight) {
        heroImg.style.transform = `scale(1.05) translateY(${scroll * 0.15}px)`;
      }
    }, { passive: true });
  }

});
