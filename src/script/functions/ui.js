/**
 * ============================================================================
 * UI.JS - FUNCIONES DE INTERFAZ DE USUARIO
 * ============================================================================
 * Proposito: Manipulacion del DOM, eventos y navegacion.
 * 
 * Contiene:
 * - Navegacion desktop (scroll + typewriter)
 * - Navegacion mobile/tablet (menu hamburguesa)
 * - Navegacion suave entre secciones
 * - Detector de seccion activa (neon amarillo)
 * - Ocultar menu en footer
 * - Filtros de proyectos
 * - Inicializacion de animaciones de secciones
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
  initAboutAnimations 
} from './animation.js';

// ============================================================================
// NAVEGACION DESKTOP (XL/2XL)
// ============================================================================

/**
 * Estado de la navegacion desktop
 * @property {Object|null} typewriter - Instancia del typewriter
 * @property {boolean} isScrolled - Indica si se ha hecho scroll
 */
let desktopState = { typewriter: null, isScrolled: false };

/**
 * Inicializa la navegacion desktop
 * - Controla el cambio de estilo al hacer scroll
 * - Activa el typewriter cuando se activa el modo scroll
 * - Muestra/oculta nombre y foto de perfil
 */
export function initDesktopNavigation() {
  const nav = document.getElementById('main-navigation');
  const navName = document.getElementById('nav-name');
  const navProfile = document.getElementById('nav-profile');
  const typewriterText = document.getElementById('typewriter-text');
  
  if (!nav) return;
  
  // Crear instancia del typewriter
  desktopState.typewriter = createTypewriter(typewriterText, "ALEJANDRO AGUILON BUITRAGO", 60);
  
  /**
   * Maneja el evento scroll
   * Activa/desactiva la clase nav-scrolled segun la posicion
   */
  function handleScroll() {
    const hasScrolled = window.scrollY > 10;
    if (hasScrolled === desktopState.isScrolled) return;
    
    desktopState.isScrolled = hasScrolled;
    
    if (hasScrolled) {
      // Modo scroll: expandir menu, mostrar nombre y foto, iniciar typewriter
      nav.classList.add('nav-scrolled');
      navName.classList.add('visible');
      navProfile.classList.add('visible');
      desktopState.typewriter.start();
    } else {
      // Modo top: contraer menu, ocultar nombre y foto, detener typewriter
      nav.classList.remove('nav-scrolled');
      navName.classList.remove('visible');
      navProfile.classList.remove('visible');
      desktopState.typewriter.stop();
      // Quitar clase active de todos los links
      document.querySelectorAll('#nav-links a').forEach(link => link.classList.remove('nav-active'));
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ============================================================================
// NAVEGACION MOBILE/TABLET
// ============================================================================

/**
 * Estado del menu mobile
 * @property {boolean} isMenuOpen - Indica si el menu esta abierto
 */
let mobileState = { isMenuOpen: false };

/**
 * Inicializa el menu hamburguesa para mobile/tablet
 * - Controla la apertura/cierre del menu
 * - Maneja la animacion de entrada/salida
 * - Cierra el menu al hacer click en un enlace
 * - Cierra el menu con la tecla ESC
 */
export function initMobileNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  
  if (!menuToggle || !mobileMenu) return;
  
  /** Abre el menu mobile */
  function openMenu() {
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuIcon.textContent = '✕';
    document.body.style.overflow = 'hidden';
    animateMobileMenu(mobileMenu, true);
    mobileState.isMenuOpen = true;
  }
  
  /** Cierra el menu mobile */
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
  
  // Cerrar menu al hacer click en cualquier enlace
  document.querySelectorAll('.mobile-nav-link, .mobile-contact-btn').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Cerrar menu con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileState.isMenuOpen) closeMenu();
  });
  
  mobileMenu.style.display = 'none';
}

// ============================================================================
// NAVEGACION SUAVE
// ============================================================================

let navigationInitialized = false;

/**
 * Inicializa la navegacion suave entre secciones
 * - Previene el comportamiento por defecto de los enlaces
 * - Hace scroll suave hasta la seccion objetivo
 * - Actualiza la URL sin recargar la pagina
 */
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

/**
 * Inicializa el detector de seccion activa
 * - Aplica la clase nav-active al link correspondiente a la seccion visible
 * - SOLO funciona cuando el menu esta en modo nav-scrolled
 */
export function initActiveSectionDetection() {
  if (activeSectionInitialized) return;
  
  const nav = document.getElementById('main-navigation');
  if (!nav) return;
  
  const sections = document.querySelectorAll('[data-target]');
  if (sections.length === 0) return;
  
  /**
   * Actualiza la seccion activa basada en la posicion del scroll
   */
  function updateActiveSection() {
    // Solo aplicar en modo scroll
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

/**
 * Inicializa el comportamiento de ocultar menu al llegar al footer
 * - El menu desktop se esconde cuando el footer esta visible
 * - Vuelve a aparecer cuando el footer sale del viewport
 */
export function initFooterHide() {
  if (footerHideInitialized) return;
  
  const nav = document.getElementById('main-navigation');
  if (!nav) return;
  
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  let isFooterVisible = false;
  
  /**
   * Verifica la posicion del footer y oculta/muestra el menu
   */
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

/**
 * Filtra los proyectos por categoria
 * @param {string} category - Categoria a filtrar ('all', 'professional', 'landing', 'learning')
 */
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

/**
 * Inicializa los event listeners de los botones de filtro
 */
export function initProjectFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => filterProjects(btn.dataset.filter));
  });
}

// ============================================================================
// INICIALIZAR ANIMACIONES DE SECCIONES
// ============================================================================

/**
 * Inicializa las animaciones de todas las secciones
 * - Hero: animaciones de entrada (menu, imagen, textos)
 * - About: animaciones de entrada (imagen, textos, boton CV)
 * - Services: animaciones de entrada (titulo, linea, cards)
 * - Projects: animaciones de entrada (titulo, filtros, cards)
 * - Contact: animaciones de entrada (panel info, formulario)
 * - Footer: efecto de scroll (aparece/desaparece)
 */
export function initSectionAnimations() {
  // Seccion Hero (introduction)
  const heroSection = document.getElementById('introduction');
  if (heroSection) {
    setTimeout(() => {
      initHeroAnimations();
    }, 50);
  }
  
  // Seccion About
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    initAboutAnimations();
  }

  // Seccion Services 
  const servicesSection = document.getElementById('services');
  if (servicesSection) {
    initServicesAnimations();
  }

  // Seccion Projects 
  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    initProjectsAnimations();
  }

  // Seccion Contact 
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    initContactAnimations();
  }

  // Efecto scroll del footer 
  initFooterScrollEffect();
}