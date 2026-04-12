/**
 * ============================================================================
 * ANIMATION.JS - FUNCIONES DE ANIMACION
 * ============================================================================
 * Proposito: Contiene TODAS las animaciones del sitio web.
 * ============================================================================
 */

// ============================================================================
// 1. TYPEWRITER EFFECT
// ============================================================================

export function createTypewriter(textElement, fullText, speed = 60) {
  let typewriterTimer = null;
  let currentIndex = 0;
  
  function start() {
    if (typewriterTimer) clearTimeout(typewriterTimer);
    currentIndex = 0;
    textElement.textContent = '';
    
    const type = () => {
      if (currentIndex < fullText.length) {
        textElement.textContent += fullText.charAt(currentIndex++);
        typewriterTimer = setTimeout(type, speed);
      } else {
        typewriterTimer = null;
      }
    };
    type();
  }
  
  function stop() {
    if (typewriterTimer) {
      clearTimeout(typewriterTimer);
      typewriterTimer = null;
    }
    textElement.textContent = '';
    currentIndex = 0;
  }
  
  return { start, stop };
}

// ============================================================================
// 2. ANIMACION DE MENU MOBILE
// ============================================================================

export function animateMobileMenu(mobileMenu, isOpening) {
  if (isOpening) {
    mobileMenu.style.display = 'flex';
    requestAnimationFrame(() => {
      mobileMenu.classList.add('menu-open');
      mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    });
  } else {
    mobileMenu.classList.remove('menu-open');
    mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      mobileMenu.style.display = 'none';
    }, 300);
  }
}

// ============================================================================
// 3. CARRUSEL INFINITO DE TECNOLOGIAS
// ============================================================================

export function initInfiniteCarousel() {
  const track = document.getElementById("carousel-track");
  
  if (!track) {
    console.warn("No se encontro el elemento con id='carousel-track'");
    return () => {};
  }

  if (track.hasAttribute('data-carousel-initialized')) {
    console.log("Carrusel ya inicializado");
    return () => {};
  }
  track.setAttribute('data-carousel-initialized', 'true');

  const originalItems = Array.from(track.children);
  
  if (originalItems.length === 0) {
    console.warn("No hay elementos dentro del carrusel");
    return () => {};
  }

  const singleLoopWidth = originalItems.reduce((total, item) => total + item.getBoundingClientRect().width, 0);
  const viewportWidth = window.innerWidth;
  const neededCopies = Math.ceil((viewportWidth * 2) / singleLoopWidth) + 2;

  const originalItemsClone = originalItems.map(item => item.cloneNode(true));
  track.innerHTML = '';
  
  originalItemsClone.forEach(item => track.appendChild(item));
  for (let i = 0; i < neededCopies; i++) {
    originalItemsClone.forEach(item => track.appendChild(item.cloneNode(true)));
  }

  let position = 0;
  const speed = 0.8;
  let animationId = null;
  let isAnimating = true;

  function animate() {
    if (!isAnimating) return;
    position -= speed;
    if (Math.abs(position) >= singleLoopWidth * neededCopies) position = 0;
    track.style.transform = `translateX(${position}px)`;
    animationId = requestAnimationFrame(animate);
  }

  function pauseAnimation() {
    isAnimating = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function resumeAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      animate();
    }
  }

  track.addEventListener('mouseenter', pauseAnimation);
  track.addEventListener('mouseleave', resumeAnimation);
  animate();

  const cleanup = () => {
    pauseAnimation();
    track.removeAttribute('data-carousel-initialized');
    track.removeEventListener('mouseenter', pauseAnimation);
    track.removeEventListener('mouseleave', resumeAnimation);
  };

  return cleanup;
}

// ============================================================================
// 4. ANIMACIONES DE ENTRADA - SECCION HERO
// ============================================================================

let heroAnimationsInitialized = false;

export function initHeroAnimations() {
  if (heroAnimationsInitialized) return;
  
  const heroMain = document.querySelector('#introduction main');
  if (!heroMain) return;
  
  const nav = document.getElementById('main-navigation');
  const aside = document.querySelector('#introduction aside');
  const figure = document.querySelector('#introduction figure');
  
  if (!aside || !figure) return;
  
  const asideElements = [
    aside.querySelector('p.text-gray-secondary'),
    aside.querySelector('h2'),
    aside.querySelector('p.text-yellow-primary'),
    aside.querySelector('p.text-gray-secondary\\/70'),
    aside.querySelector('.bg-yellow-primary'),
    aside.querySelector('footer')
  ].filter(el => el);
  
  if (nav) {
    nav.style.opacity = '0';
    nav.style.transform = 'translateX(100%)';
    nav.style.transition = 'opacity 0.8s ease-out, transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  if (figure) {
    figure.style.opacity = '0.4';
    figure.style.transition = 'opacity 1s ease-out';
  }
  
  asideElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-40px)';
    el.style.transition = 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  requestAnimationFrame(() => {
    setTimeout(() => { if (figure) figure.style.opacity = '1'; }, 100);
    setTimeout(() => { if (nav) { nav.style.opacity = '1'; nav.style.transform = 'translateX(0)'; } }, 250);
    asideElements.forEach((el, index) => {
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }, 400 + (index * 150));
    });
  });
  
  heroAnimationsInitialized = true;
}

// ============================================================================
// 5. ANIMACIONES DE ENTRADA - SECCION ABOUT
// ============================================================================

let aboutAnimationsInitialized = false;

export function initAboutAnimations() {
  if (aboutAnimationsInitialized) return;
  
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;
  
  const figure = aboutSection.querySelector('figure');
  const header = aboutSection.querySelector('header');
  const title = header?.querySelector('div');
  const paragraphs = header?.querySelectorAll('p');
  const button = header?.querySelector('footer a');
  const yellowLine = header?.querySelector('h2 span:last-child');
  
  if (!header) return;
  
  const textElements = [
    title?.querySelector('p'),
    title?.querySelector('h2 span:first-child'),
    paragraphs?.[0],
    paragraphs?.[1]
  ].filter(el => el);
  
  if (figure) {
    figure.style.opacity = '0';
    figure.style.transform = 'translateX(-60px)';
    figure.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  textElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(40px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  if (yellowLine) {
    yellowLine.style.width = '0';
    yellowLine.style.transition = 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  if (button) {
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px)';
    button.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !aboutAnimationsInitialized) {
        setTimeout(() => { if (figure) { figure.style.opacity = '1'; figure.style.transform = 'translateX(0)'; } }, 100);
        textElements.forEach((el, index) => {
          setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateX(0)'; }, 250 + (index * 150));
        });
        setTimeout(() => { if (yellowLine) yellowLine.style.width = '100%'; }, 400);
        setTimeout(() => { if (button) { button.style.opacity = '1'; button.style.transform = 'translateY(0)'; } }, 850);
        aboutAnimationsInitialized = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  observer.observe(aboutSection);
}

// ============================================================================
// 6. ANIMACIONES DE ENTRADA - SECCION SERVICES
// ============================================================================

let servicesAnimationsInitialized = false;

export function initServicesAnimations() {
  if (servicesAnimationsInitialized) return;
  
  const servicesSection = document.getElementById('services');
  if (!servicesSection) return;
  
  const header = servicesSection.querySelector('header');
  const title = header?.querySelector('h2 span');
  const line = header?.querySelector('span[class*="bg-black-primary"]');
  const description = header?.querySelector('p');
  const cards = servicesSection.querySelectorAll('.service-card');
  
  if (!header) return;
  
  if (title) {
    title.style.opacity = '0';
    title.style.transform = 'translateY(-40px)';
    title.style.transition = 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  if (line) {
    line.style.width = '0';
    line.style.transition = 'width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  if (description) {
    description.style.opacity = '0';
    description.style.transform = 'translateY(20px)';
    description.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !servicesAnimationsInitialized) {
        setTimeout(() => { if (title) { title.style.opacity = '1'; title.style.transform = 'translateY(0)'; } }, 100);
        setTimeout(() => { if (line) line.style.width = '100%'; }, 250);
        setTimeout(() => { if (description) { description.style.opacity = '1'; description.style.transform = 'translateY(0)'; } }, 400);
        cards.forEach((card, index) => {
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 500 + (index * 120));
        });
        servicesAnimationsInitialized = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(servicesSection);
}

// ============================================================================
// 7. ANIMACIONES DE ENTRADA - SECCION PROJECTS
// ============================================================================

let projectsAnimationsInitialized = false;

export function initProjectsAnimations() {
  if (projectsAnimationsInitialized) return;
  
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) return;
  
  const header = projectsSection.querySelector('header');
  const title = header?.querySelector('h2');
  const line = header?.querySelector('span[class*="bg-black-primary"]');
  const filterButtons = projectsSection.querySelectorAll('.filter-btn');
  const cards = projectsSection.querySelectorAll('.project-card');
  
  if (!header) return;
  
  if (title) {
    title.style.opacity = '0';
    title.style.transform = 'translateX(-50px)';
    title.style.transition = 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  if (line) {
    line.style.width = '0';
    line.style.transition = 'width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  filterButtons.forEach(btn => {
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(-30px)';
    btn.style.transition = 'opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.85) translateY(30px)';
    card.style.transition = 'opacity 0.5s ease-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !projectsAnimationsInitialized) {
        setTimeout(() => { if (title) { title.style.opacity = '1'; title.style.transform = 'translateX(0)'; } }, 100);
        setTimeout(() => { if (line) line.style.width = '100%'; }, 250);
        filterButtons.forEach((btn, index) => {
          setTimeout(() => { btn.style.opacity = '1'; btn.style.transform = 'translateY(0)'; }, 350 + (index * 60));
        });
        cards.forEach((card, index) => {
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1) translateY(0)'; }, 550 + (index * 100));
        });
        projectsAnimationsInitialized = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(projectsSection);
}

// ============================================================================
// 8. ANIMACIONES DE ENTRADA - SECCION CONTACT
// ============================================================================

let contactAnimationsInitialized = false;

export function initContactAnimations() {
  if (contactAnimationsInitialized) return;
  
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;
  
  const aside = contactSection.querySelector('aside');
  const form = contactSection.querySelector('form');
  const title = form?.querySelector('h2');
  const description = form?.querySelector('p');
  const fieldsets = form?.querySelectorAll('fieldset');
  const button = form?.querySelector('button[type="submit"]');
  
  if (!form || !aside) return;
  
  aside.style.opacity = '0';
  aside.style.transform = 'translateX(80px)';
  aside.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  
  if (title) {
    title.style.opacity = '0';
    title.style.transform = 'translateY(-30px)';
    title.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  if (description) {
    description.style.opacity = '0';
    description.style.transform = 'translateX(-30px)';
    description.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  fieldsets?.forEach(fieldset => {
    fieldset.style.opacity = '0';
    fieldset.style.transform = 'translateX(-40px)';
    fieldset.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  if (button) {
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px)';
    button.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !contactAnimationsInitialized) {
        setTimeout(() => { aside.style.opacity = '1'; aside.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => { if (title) { title.style.opacity = '1'; title.style.transform = 'translateY(0)'; } }, 200);
        setTimeout(() => { if (description) { description.style.opacity = '1'; description.style.transform = 'translateX(0)'; } }, 300);
        fieldsets?.forEach((fieldset, index) => {
          setTimeout(() => { fieldset.style.opacity = '1'; fieldset.style.transform = 'translateX(0)'; }, 400 + (index * 100));
        });
        setTimeout(() => { if (button) { button.style.opacity = '1'; button.style.transform = 'translateY(0)'; } }, 750);
        contactAnimationsInitialized = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(contactSection);
}

// ============================================================================
// 9. EFECTO SCROLL DEL FOOTER
// ============================================================================

let footerEffectInitialized = false;
let lastScrollY = 0;
let footerVisible = true;
let ticking = false;

export function initFooterScrollEffect() {
  if (footerEffectInitialized) return;
  
  const footer = document.querySelector('footer');
  const contactSection = document.getElementById('contact');
  
  if (!footer || !contactSection) return;
  
  footer.style.transform = 'translateY(0)';
  footer.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  footerVisible = true;
  
  function handleFooterScroll() {
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    const contactRect = contactSection.getBoundingClientRect();
    const contactTop = contactRect.top + window.scrollY;
    const contactHeight = contactRect.height;
    const triggerPoint = contactTop + (contactHeight * 0.9);
    
    const isNearBottom = currentScrollY + windowHeight >= triggerPoint;
    
    if (!isNearBottom) {
      if (!footerVisible) {
        footer.style.transform = 'translateY(0)';
        footerVisible = true;
      }
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }
    
    if (currentScrollY > lastScrollY) {
      if (footerVisible) {
        footer.style.transform = 'translateY(100%)';
        footerVisible = false;
      }
    } else {
      if (!footerVisible) {
        footer.style.transform = 'translateY(0)';
        footerVisible = true;
      }
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  }
  
  function scrollListener() {
    if (!ticking) {
      requestAnimationFrame(handleFooterScroll);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', scrollListener, { passive: true });
  handleFooterScroll();
  
  footerEffectInitialized = true;
}

// ============================================================================
// 10. SISTEMA DE TOASTS
// ============================================================================

export function showToast(message, type = 'success', duration = 4000) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-45 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none';
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} pointer-events-auto transform -translate-y-full opacity-0`;
  toast.setAttribute('role', 'alert');
  
  const icon = type === 'success' 
    ? '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
    : '<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
  
  toast.innerHTML = `
    <div class="relative overflow-hidden rounded-lg shadow-xl backdrop-blur-md mx-4 sm:mx-0
      ${type === 'success' 
        ? 'bg-yellow-primary/95 text-black-primary border border-yellow-primary' 
        : 'bg-red-500/95 text-white border border-red-400'}">
      <div class="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3">
        ${icon}
        <span class="text-sm font-medium whitespace-nowrap">${message}</span>
        <button class="toast-close shrink-0 text-white/80 hover:text-white transition-colors ml-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="toast-progress absolute bottom-0 left-0 h-1 bg-white/30 w-full">
        <div class="toast-progress-bar h-full bg-white/80" style="width: 100%;"></div>
      </div>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  const progressBar = toast.querySelector('.toast-progress-bar');
  
  requestAnimationFrame(() => {
    toast.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-out';
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });
  
  let startTime = Date.now();
  let animationFrame = null;
  
  function updateProgressBar() {
    const elapsed = Date.now() - startTime;
    const progress = Math.max(0, 1 - (elapsed / duration));
    progressBar.style.width = `${progress * 100}%`;
    
    if (elapsed < duration) {
      animationFrame = requestAnimationFrame(updateProgressBar);
    }
  }
  
  animationFrame = requestAnimationFrame(updateProgressBar);
  
  const closeToast = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    
    toast.style.transform = 'translateY(-100%)';
    toast.style.opacity = '0';
    
    setTimeout(() => {
      toast.remove();
      if (toastContainer.children.length === 0) {
        toastContainer.remove();
      }
    }, 400);
  };
  
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', closeToast);
  
  let paused = false;
  let pauseStartTime = 0;
  
  toast.addEventListener('mouseenter', () => {
    if (!paused && animationFrame) {
      paused = true;
      pauseStartTime = Date.now();
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  });
  
  toast.addEventListener('mouseleave', () => {
    if (paused) {
      paused = false;
      const pauseDuration = Date.now() - pauseStartTime;
      startTime += pauseDuration;
      animationFrame = requestAnimationFrame(updateProgressBar);
    }
  });
  
  const timer = setTimeout(closeToast, duration);
  
  closeBtn.addEventListener('click', () => {
    clearTimeout(timer);
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }, { once: true });
}