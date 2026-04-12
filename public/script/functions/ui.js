/**
 * ============================================================================
 * UI.JS - FUNCIONES DE INTERFAZ DE USUARIO
 * ============================================================================
 */

import { 
  initContactAnimations, 
  initFooterScrollEffect, 
  createTypewriter,
  initProjectsAnimations, 
  initServicesAnimations, 
  animateMobileMenu, 
  initHeroAnimations, 
  initAboutAnimations,
  showToast
} from './animation.js';

// ============================================================================
// NAVEGACION DESKTOP (XL/2XL)
// ============================================================================

let desktopState = { typewriter: null, isScrolled: false };

export function initDesktopNavigation() {
  const nav = document.getElementById('main-navigation');
  const navName = document.getElementById('nav-name');
  const navProfile = document.getElementById('nav-profile');
  const typewriterText = document.getElementById('typewriter-text');
  
  if (!nav) return;
  
  desktopState.typewriter = createTypewriter(typewriterText, "ALEJANDRO AGUILON BUITRAGO", 60);
  
  function handleScroll() {
    const hasScrolled = window.scrollY > 10;
    if (hasScrolled === desktopState.isScrolled) return;
    
    desktopState.isScrolled = hasScrolled;
    
    if (hasScrolled) {
      nav.classList.add('nav-scrolled');
      navName.classList.add('visible');
      navProfile.classList.add('visible');
      desktopState.typewriter.start();
    } else {
      nav.classList.remove('nav-scrolled');
      navName.classList.remove('visible');
      navProfile.classList.remove('visible');
      desktopState.typewriter.stop();
      document.querySelectorAll('#nav-links a').forEach(link => link.classList.remove('nav-active'));
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ============================================================================
// NAVEGACION MOBILE/TABLET
// ============================================================================

let mobileState = { isMenuOpen: false };

export function initMobileNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  
  if (!menuToggle || !mobileMenu) return;
  
  function openMenu() {
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuIcon.textContent = '✕';
    document.body.style.overflow = 'hidden';
    animateMobileMenu(mobileMenu, true);
    mobileState.isMenuOpen = true;
  }
  
  function closeMenu() {
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuIcon.textContent = '☰';
    document.body.style.overflow = '';
    animateMobileMenu(mobileMenu, false);
    mobileState.isMenuOpen = false;
  }
  
  menuToggle.addEventListener('click', () => mobileState.isMenuOpen ? closeMenu() : openMenu());
  menuClose?.addEventListener('click', closeMenu);
  
  document.querySelectorAll('.mobile-nav-link, .mobile-contact-btn').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileState.isMenuOpen) closeMenu();
  });
  
  mobileMenu.style.display = 'none';
}

// ============================================================================
// NAVEGACION SUAVE
// ============================================================================

let navigationInitialized = false;

export function initSmoothNavigation() {
  if (navigationInitialized) return;
  
  document.querySelectorAll('#nav-links a, .mobile-nav-link, .mobile-contact-btn').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      
      const targetId = href.replace('#', '');
      const targetSection = document.querySelector(`[data-target="${targetId}"]`) || document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, href);
      }
    });
  });
  
  navigationInitialized = true;
}

// ============================================================================
// DETECTOR DE SECCION ACTIVA
// ============================================================================

let activeSectionInitialized = false;

export function initActiveSectionDetection() {
  if (activeSectionInitialized) return;
  
  const nav = document.getElementById('main-navigation');
  if (!nav) return;
  
  const sections = document.querySelectorAll('[data-target]');
  if (sections.length === 0) return;
  
  function updateActiveSection() {
    if (!nav.classList.contains('nav-scrolled')) {
      document.querySelectorAll('#nav-links a').forEach(link => link.classList.remove('nav-active'));
      return;
    }
    
    const scrollPosition = window.scrollY + 100;
    let activeId = null;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeId = section.getAttribute('data-target') || section.id;
      }
    });
    
    if (activeId) {
      document.querySelectorAll('#nav-links a').forEach(link => {
        const href = link.getAttribute('href')?.replace('#', '');
        link.classList.toggle('nav-active', href === activeId);
      });
    }
  }
  
  window.addEventListener('scroll', updateActiveSection, { passive: true });
  updateActiveSection();
  activeSectionInitialized = true;
}

// ============================================================================
// OCULTAR MENU EN FOOTER
// ============================================================================

let footerHideInitialized = false;

export function initFooterHide() {
  if (footerHideInitialized) return;
  
  const nav = document.getElementById('main-navigation');
  if (!nav) return;
  
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  let isFooterVisible = false;
  
  function checkFooterPosition() {
    const footerTop = footer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    const footerIsVisible = footerTop < windowHeight && footerTop > -footer.offsetHeight;
    
    if (footerIsVisible && !isFooterVisible) {
      nav.style.transform = 'translateY(-100%)';
      nav.style.transition = 'transform 0.3s ease-out';
      isFooterVisible = true;
    } else if (!footerIsVisible && isFooterVisible) {
      nav.style.transform = 'translateY(0)';
      isFooterVisible = false;
    }
  }
  
  window.addEventListener('scroll', checkFooterPosition, { passive: true });
  checkFooterPosition();
  footerHideInitialized = true;
}

// ============================================================================
// FILTROS DE PROYECTOS
// ============================================================================

export function filterProjects(category) {
  document.querySelectorAll('.project-card').forEach(card => {
    const cardCategory = card.dataset.category;
    card.style.display = (category === 'all' || cardCategory === category) ? 'flex' : 'none';
  });
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const btnFilter = btn.dataset.filter;
    const isActive = btnFilter === category;
    btn.classList.toggle('active', isActive);
    btn.classList.toggle('bg-yellow-primary', isActive);
    btn.classList.toggle('text-white-primary', isActive);
    btn.classList.toggle('border-gray-primary', !isActive);
    btn.classList.toggle('text-black-tertiary', !isActive);
  });
}

export function initProjectFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => filterProjects(btn.dataset.filter));
  });
}

// ============================================================================
// FORMULARIO DE CONTACTO CON RESEND DIRECTO
// ============================================================================

let contactFormInitialized = false;

export function initContactForm() {
  if (contactFormInitialized) return;
  
  const form = document.querySelector('form[aria-label="Formulario de contacto"]');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };
    
    if (!data.name || !data.email || !data.message) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    const button = form.querySelector('button[type="submit"]');
    const buttonText = button.querySelector('span');
    const originalText = buttonText.textContent;
    buttonText.textContent = 'SENDING...';
    button.disabled = true;
    
    try {
      // Usar Resend directamente con fetch a su API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_ay8bAUiJ_DBJZKj6t1dM7QiVVwUmVc3PD',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: ['aguilondevelopsoft@gmail.com'],
          subject: `Nuevo mensaje de ${data.name} desde el portafolio`,
          reply_to: data.email,
          html: `
            <h2>📬 Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${data.message}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Enviado desde el portafolio de Alejandro Aguilon</p>
          `
        })
      });
      
      if (response.ok) {
        showToast('Message sent successfully! Thank you for contacting me.', 'success');
        form.reset();
      } else {
        const error = await response.json();
        console.error('Resend error:', error);
        showToast('Error sending message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showToast('Connection error. Please try again later.', 'error');
    } finally {
      buttonText.textContent = originalText;
      button.disabled = false;
    }
  });
  
  contactFormInitialized = true;
}

// ============================================================================
// INICIALIZAR ANIMACIONES DE SECCIONES
// ============================================================================

export function initSectionAnimations() {
  const heroSection = document.getElementById('introduction');
  if (heroSection) {
    setTimeout(() => initHeroAnimations(), 50);
  }
  
  const aboutSection = document.getElementById('about');
  if (aboutSection) initAboutAnimations();
  
  const servicesSection = document.getElementById('services');
  if (servicesSection) initServicesAnimations();
  
  const projectsSection = document.getElementById('projects');
  if (projectsSection) initProjectsAnimations();
  
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    initContactAnimations();
  }
  
  initFooterScrollEffect();
}