'use strict';

// ===========================
// NAVBAR: Gestión de estado y accesibilidad
// ===========================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Mitigación de carga en el hilo principal mediante passive listeners
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Centralización del cambio de estado para preservar la integridad semántica
const toggleMenu = (isOpen) => {
  navLinks.classList.toggle('open', isOpen);
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
};

hamburger.addEventListener('click', () => {
  const isCurrentlyOpen = navLinks.classList.contains('open');
  toggleMenu(!isCurrentlyOpen);
});

// Cierre de menú al interactuar con un anclaje
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Cierre de menú por evento exterior (Resolución de disonancia Aria)
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    toggleMenu(false);
  }
});

// ===========================
// ANIMACIONES DE INTERSECCIÓN (Despliegue progresivo)
// ===========================
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => observer.observe(el));

// ===========================
// RUTEO INTERNO (Smooth Scroll & URL State)
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return; // Cláusula de guarda contra anclajes vacíos

    const target = document.querySelector(href);
    if (!target) return;
    
    e.preventDefault();
    const offset = 80; // Compensación volumétrica del Navbar
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({ top, behavior: 'smooth' });
    
    // Mutación silenciosa del historial para permitir compartir URLs exactas
    history.pushState(null, null, href);
  });
});

// ===========================
// LÓGICA DE FORMULARIO (Manejo de asincronía simulada)
// ===========================
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMsg = document.getElementById('newsletterMsg');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    if (!input.value) return;

    const btn = newsletterForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Enviando…';
    btn.disabled = true;

    // Simulación de resolución de promesa
    setTimeout(() => {
      newsletterForm.reset();
      newsletterForm.style.display = 'none';
      newsletterMsg.hidden = false;
      // Saneamiento conceptual del estado del botón
      btn.textContent = originalText;
      btn.disabled = false;
    }, 900);
  });
}

// ===========================
// SEGUIMIENTO DE LECTURA (Active Nav Link)
// ===========================
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      
      // Enfoque declarativo: Se asigna una clase, CSS asume el control del renderizado visual
      document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${id}`) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }
  });
}, { 
  threshold: 0.4,
  rootMargin: '-80px 0px 0px 0px' // Calibración espacial para compensar el Navbar
});

sections.forEach(s => navObserver.observe(s));
