/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMATION.JS - FUNCIONES DE ANIMACIÓN
 * ═══════════════════════════════════════════════════════════════════════════
 * Propósito: Contiene TODAS las animaciones del sitio.
 */

/**
 * TYPEWRITER EFFECT - Para el nombre en desktop
 * @param {HTMLElement} textElement - Elemento donde se escribirá
 * @param {string} fullText - Texto completo
 * @param {number} speed - Velocidad en ms
 * @returns {Object} - Funciones start y stop
 */
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

/**
 * ANIMACIÓN DE MENÚ MOBILE - Apertura y cierre suave
 * @param {HTMLElement} mobileMenu - Elemento del menú
 * @param {boolean} isOpening - true = abrir, false = cerrar
 */
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

/**
 * CARRUSEL INFINITO DE TECNOLOGÍAS
 * @returns {Function} - Función de limpieza
 */
export function initInfiniteCarousel() {
  const track = document.getElementById("carousel-track");
  
  if (!track) {
    console.warn("⚠️ No se encontró el elemento con id='carousel-track'");
    return () => {};
  }

  if (track.hasAttribute('data-carousel-initialized')) {
    console.log("⏭️ Carrusel ya inicializado");
    return () => {};
  }
  track.setAttribute('data-carousel-initialized', 'true');

  const originalItems = Array.from(track.children);
  
  if (originalItems.length === 0) {
    console.warn("⚠️ No hay elementos dentro del carrusel");
    return () => {};
  }

  console.log(`🎠 Carrusel: ${originalItems.length} elementos originales`);

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
    console.log("🧹 Carrusel limpiado");
  };

  console.log("✅ Carrusel infinito inicializado");
  return cleanup;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMACIONES DE ENTRADA - SECCIÓN HERO
 * ═══════════════════════════════════════════════════════════════════════════
 */
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMACIONES DE ENTRADA - SECCIÓN HERO
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMACIONES DE ENTRADA - SECCIÓN HERO
 * ═══════════════════════════════════════════════════════════════════════════
 */

let heroAnimationsInitialized = false;

/**
 * Inicializa las animaciones de la sección Hero
 * - Menú desktop: sale escondido de derecha a izquierda hasta su posición original
 * - Imagen del panel derecho: fade in de 0.4 a 1
 * - Textos del aside: stagger con desplazamiento
 */
export function initHeroAnimations() {
  if (heroAnimationsInitialized) return;
  
  const heroMain = document.querySelector('#introduction main');
  if (!heroMain) return;
  
  const nav = document.getElementById('main-navigation');
  const aside = document.querySelector('#introduction aside');
  const figure = document.querySelector('#introduction figure');
  
  if (!aside || !figure) return;
  
  // Elementos del aside para animar en secuencia
  const asideElements = [
    aside.querySelector('p.text-gray-secondary'),                 // "MY NAME IS"
    aside.querySelector('h2'),                                   // "ALEJANDRO"
    aside.querySelector('p.text-yellow-primary'),                // "AGUILON"
    aside.querySelector('p.text-gray-secondary\\/70'),           // "BUITRAGO"
    aside.querySelector('.bg-yellow-primary'),                   // Botón FRONT END DEVELOPER
    aside.querySelector('footer')                                // Ubicación
  ].filter(el => el);
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ESTADO INICIAL: Elementos ocultos/listos para animar
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Menú: escondido a la derecha (fuera de pantalla)
  if (nav) {
    nav.style.opacity = '0';
    nav.style.transform = 'translateX(100%)';  // Sale de MUY a la derecha
    nav.style.transition = 'opacity 0.8s ease-out, transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  // Imagen: empieza con opacidad 0.4
  if (figure) {
    figure.style.opacity = '0.4';
    figure.style.transition = 'opacity 1s ease-out';
  }
  
  // Textos del aside: desplazados a la izquierda y ocultos
  asideElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-40px)';
    el.style.transition = 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DISPARAR ANIMACIONES - MODO LENTO Y SABROSO
  // ═══════════════════════════════════════════════════════════════════════════
  requestAnimationFrame(() => {
    // 1. Imagen - fade de 0.4 a 1 (lento)
    setTimeout(() => {
      if (figure) {
        figure.style.opacity = '1';
      }
    }, 100);
    
    // 2. Menú - slide de derecha a izquierda hasta su posición original (más lento)
    setTimeout(() => {
      if (nav) {
        nav.style.opacity = '1';
        nav.style.transform = 'translateX(0)';
      }
    }, 250);
    
    // 3. Textos del aside - stagger con más delay entre cada uno
    asideElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      }, 400 + (index * 150)); // 400ms, 550ms, 700ms, 850ms, 1000ms, 1150ms
    });
  });
  
  heroAnimationsInitialized = true;
}

/**
 * Resetea las animaciones de la Hero (útil al cambiar de sección)
 */
export function resetHeroAnimations() {
  heroAnimationsInitialized = false;
  
  const nav = document.getElementById('main-navigation');
  const figure = document.querySelector('#introduction figure');
  const aside = document.querySelector('#introduction aside');
  
  if (nav) {
    nav.style.opacity = '';
    nav.style.transform = '';
  }
  
  if (figure) {
    figure.style.opacity = '';
  }
  
  if (aside) {
    const elements = [
      aside.querySelector('p.text-gray-secondary'),
      aside.querySelector('h2'),
      aside.querySelector('p.text-yellow-primary'),
      aside.querySelector('p.text-gray-secondary\\/70'),
      aside.querySelector('.bg-yellow-primary'),
      aside.querySelector('footer')
    ];
    
    elements.forEach(el => {
      if (el) {
        el.style.opacity = '';
        el.style.transform = '';
      }
    });
  }
}

// ... (tu código existente de Hero, typewriter, etc.)

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMACIONES DE ENTRADA - SECCIÓN ABOUT
 * ═══════════════════════════════════════════════════════════════════════════
 */

let aboutAnimationsInitialized = false;

/**
 * Inicializa las animaciones de la sección About
 * - Imagen: slide desde izquierda + fade in
 * - Textos: stagger desde derecha + fade in
 * - Botón CV: fade in con rebote suave
 * - Línea amarilla: se dibuja de izquierda a derecha
 */
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
  
  // Elementos a animar en secuencia
  const textElements = [
    title?.querySelector('p'),                    // "Who is"
    title?.querySelector('h2 span:first-child'),  // "ALEJANDRO"
    paragraphs?.[0],                              // Primer párrafo
    paragraphs?.[1]                               // Segundo párrafo
  ].filter(el => el);
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ESTADO INICIAL: Elementos ocultos/listos para animar
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Imagen: desplazada a la izquierda y oculta
  if (figure) {
    figure.style.opacity = '0';
    figure.style.transform = 'translateX(-60px)';
    figure.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  // Textos: desplazados a la derecha y ocultos
  textElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(40px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  // Línea amarilla: ancho 0 (se dibujará)
  if (yellowLine) {
    yellowLine.style.width = '0';
    yellowLine.style.transition = 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  // Botón CV: oculto y más abajo
  if (button) {
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px)';
    button.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'; // Rebote
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DISPARAR ANIMACIONES CUANDO LA SECCIÓN ES VISIBLE
  // ═══════════════════════════════════════════════════════════════════════════
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !aboutAnimationsInitialized) {
        
        // 1. Imagen - slide desde izquierda
        setTimeout(() => {
          if (figure) {
            figure.style.opacity = '1';
            figure.style.transform = 'translateX(0)';
          }
        }, 100);
        
        // 2. Textos - stagger desde derecha
        textElements.forEach((el, index) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
          }, 250 + (index * 150)); // 250ms, 400ms, 550ms, 700ms
        });
        
        // 3. Línea amarilla - se dibuja
        setTimeout(() => {
          if (yellowLine) {
            yellowLine.style.width = '100%';
          }
        }, 400);
        
        // 4. Botón CV - fade in con rebote
        setTimeout(() => {
          if (button) {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
          }
        }, 850);
        
        aboutAnimationsInitialized = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 }); // 30% visible
  
  observer.observe(aboutSection);
}

/**
 * Resetea las animaciones de About (útil al cambiar de sección)
 */
export function resetAboutAnimations() {
  aboutAnimationsInitialized = false;
  
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;
  
  const figure = aboutSection.querySelector('figure');
  const header = aboutSection.querySelector('header');
  const title = header?.querySelector('div');
  const paragraphs = header?.querySelectorAll('p');
  const button = header?.querySelector('footer a');
  const yellowLine = header?.querySelector('h2 span:last-child');
  
  if (figure) {
    figure.style.opacity = '';
    figure.style.transform = '';
  }
  
  const textElements = [
    title?.querySelector('p'),
    title?.querySelector('h2 span:first-child'),
    paragraphs?.[0],
    paragraphs?.[1]
  ].filter(el => el);
  
  textElements.forEach(el => {
    if (el) {
      el.style.opacity = '';
      el.style.transform = '';
    }
  });
  
  if (yellowLine) {
    yellowLine.style.width = '';
  }
  
  if (button) {
    button.style.opacity = '';
    button.style.transform = '';
  }
}

// ... (tu código existente de Hero, About, typewriter, etc.)

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMACIONES DE ENTRADA - SECCIÓN SERVICES
 * ═══════════════════════════════════════════════════════════════════════════
 */

let servicesAnimationsInitialized = false;

/**
 * Inicializa las animaciones de la sección Services
 * - Título: slide desde arriba + fade in
 * - Línea decorativa: se dibuja de izquierda a derecha
 * - Descripción: fade in con stagger
 * - Cards: stagger desde abajo + fade in
 */
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
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ESTADO INICIAL: Elementos ocultos/listos para animar
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Título: desplazado hacia arriba y oculto
  if (title) {
    title.style.opacity = '0';
    title.style.transform = 'translateY(-40px)';
    title.style.transition = 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  // Línea decorativa: ancho 0 (se dibujará)
  if (line) {
    line.style.width = '0';
    line.style.transition = 'width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  // Descripción: oculta
  if (description) {
    description.style.opacity = '0';
    description.style.transform = 'translateY(20px)';
    description.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  // Cards: desplazadas hacia abajo y ocultas
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DISPARAR ANIMACIONES CUANDO LA SECCIÓN ES VISIBLE
  // ═══════════════════════════════════════════════════════════════════════════
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !servicesAnimationsInitialized) {
        
        // 1. Título - slide desde arriba
        setTimeout(() => {
          if (title) {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
          }
        }, 100);
        
        // 2. Línea decorativa - se dibuja
        setTimeout(() => {
          if (line) {
            line.style.width = '100%';
          }
        }, 250);
        
        // 3. Descripción - fade in
        setTimeout(() => {
          if (description) {
            description.style.opacity = '1';
            description.style.transform = 'translateY(0)';
          }
        }, 400);
        
        // 4. Cards - stagger desde abajo
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 500 + (index * 120)); // 500ms, 620ms, 740ms, 860ms, 980ms, 1100ms
        });
        
        servicesAnimationsInitialized = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 }); // 20% visible
  
  observer.observe(servicesSection);
}

/**
 * Resetea las animaciones de Services
 */
export function resetServicesAnimations() {
  servicesAnimationsInitialized = false;
  
  const servicesSection = document.getElementById('services');
  if (!servicesSection) return;
  
  const header = servicesSection.querySelector('header');
  const title = header?.querySelector('h2 span');
  const line = header?.querySelector('span[class*="bg-black-primary"]');
  const description = header?.querySelector('p');
  const cards = servicesSection.querySelectorAll('.service-card');
  
  if (title) {
    title.style.opacity = '';
    title.style.transform = '';
  }
  
  if (line) {
    line.style.width = '';
  }
  
  if (description) {
    description.style.opacity = '';
    description.style.transform = '';
  }
  
  cards.forEach(card => {
    card.style.opacity = '';
    card.style.transform = '';
  });
}

// ... (tu código existente de Hero, About, Services, etc.)

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMACIONES DE ENTRADA - SECCIÓN PROJECTS
 * ═══════════════════════════════════════════════════════════════════════════
 */

let projectsAnimationsInitialized = false;

/**
 * Inicializa las animaciones de la sección Projects
 * - Título: slide desde izquierda + fade in
 * - Línea decorativa: se dibuja de izquierda a derecha
 * - Botones de filtro: stagger desde arriba + fade in
 * - Cards: stagger con flip suave + fade in
 */
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
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ESTADO INICIAL: Elementos ocultos/listos para animar
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Título: desplazado a la izquierda y oculto
  if (title) {
    title.style.opacity = '0';
    title.style.transform = 'translateX(-50px)';
    title.style.transition = 'opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  // Línea decorativa: ancho 0 (se dibujará)
  if (line) {
    line.style.width = '0';
    line.style.transition = 'width 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  // Botones de filtro: desplazados hacia arriba y ocultos
  filterButtons.forEach(btn => {
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(-30px)';
    btn.style.transition = 'opacity 0.4s ease-out, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  // Cards: ocultas con escala 0.8
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.85) translateY(30px)';
    card.style.transition = 'opacity 0.5s ease-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DISPARAR ANIMACIONES CUANDO LA SECCIÓN ES VISIBLE
  // ═══════════════════════════════════════════════════════════════════════════
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !projectsAnimationsInitialized) {
        
        // 1. Título - slide desde izquierda
        setTimeout(() => {
          if (title) {
            title.style.opacity = '1';
            title.style.transform = 'translateX(0)';
          }
        }, 100);
        
        // 2. Línea decorativa - se dibuja
        setTimeout(() => {
          if (line) {
            line.style.width = '100%';
          }
        }, 250);
        
        // 3. Botones de filtro - stagger desde arriba
        filterButtons.forEach((btn, index) => {
          setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
          }, 350 + (index * 60)); // 350ms, 410ms, 470ms, 530ms
        });
        
        // 4. Cards - stagger con flip suave
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, 550 + (index * 100)); // 550ms, 650ms, 750ms, 850ms
        });
        
        projectsAnimationsInitialized = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 }); // 20% visible
  
  observer.observe(projectsSection);
}

/**
 * Resetea las animaciones de Projects
 */
export function resetProjectsAnimations() {
  projectsAnimationsInitialized = false;
  
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) return;
  
  const header = projectsSection.querySelector('header');
  const title = header?.querySelector('h2');
  const line = header?.querySelector('span[class*="bg-black-primary"]');
  const filterButtons = projectsSection.querySelectorAll('.filter-btn');
  const cards = projectsSection.querySelectorAll('.project-card');
  
  if (title) {
    title.style.opacity = '';
    title.style.transform = '';
  }
  
  if (line) {
    line.style.width = '';
  }
  
  filterButtons.forEach(btn => {
    btn.style.opacity = '';
    btn.style.transform = '';
  });
  
  cards.forEach(card => {
    card.style.opacity = '';
    card.style.transform = '';
  });
}

// ... (tu código existente de Hero, About, Services, Projects, etc.)

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANIMACIONES DE ENTRADA - SECCIÓN CONTACT
 * ═══════════════════════════════════════════════════════════════════════════
 */

let contactAnimationsInitialized = false;

/**
 * Inicializa las animaciones de la sección Contact
 * - Panel de información: slide desde derecha a su posición original
 * - Formulario: stagger desde izquierda + fade in
 */
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
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ESTADO INICIAL: Elementos ocultos/listos para animar
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Panel de información: desplazado a la derecha y oculto
  aside.style.opacity = '0';
  aside.style.transform = 'translateX(80px)';
  aside.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  
  // Título: desplazado hacia arriba y oculto
  if (title) {
    title.style.opacity = '0';
    title.style.transform = 'translateY(-30px)';
    title.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  // Descripción: oculta
  if (description) {
    description.style.opacity = '0';
    description.style.transform = 'translateX(-30px)';
    description.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  // Fieldsets: desplazados a la izquierda y ocultos
  fieldsets?.forEach(fieldset => {
    fieldset.style.opacity = '0';
    fieldset.style.transform = 'translateX(-40px)';
    fieldset.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
  
  // Botón: oculto y más abajo
  if (button) {
    button.style.opacity = '0';
    button.style.transform = 'translateY(20px)';
    button.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DISPARAR ANIMACIONES CUANDO LA SECCIÓN ES VISIBLE
  // ═══════════════════════════════════════════════════════════════════════════
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !contactAnimationsInitialized) {
        
        // 1. Panel de información - slide desde derecha
        setTimeout(() => {
          aside.style.opacity = '1';
          aside.style.transform = 'translateX(0)';
        }, 100);
        
        // 2. Título - slide desde arriba
        setTimeout(() => {
          if (title) {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
          }
        }, 200);
        
        // 3. Descripción - slide desde izquierda
        setTimeout(() => {
          if (description) {
            description.style.opacity = '1';
            description.style.transform = 'translateX(0)';
          }
        }, 300);
        
        // 4. Fieldsets - stagger desde izquierda
        fieldsets?.forEach((fieldset, index) => {
          setTimeout(() => {
            fieldset.style.opacity = '1';
            fieldset.style.transform = 'translateX(0)';
          }, 400 + (index * 100)); // 400ms, 500ms, 600ms
        });
        
        // 5. Botón - fade in con rebote
        setTimeout(() => {
          if (button) {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
          }
        }, 750);
        
        contactAnimationsInitialized = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 }); // 20% visible
  
  observer.observe(contactSection);
}

/**
 * Resetea las animaciones de Contact
 */
export function resetContactAnimations() {
  contactAnimationsInitialized = false;
  
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;
  
  const aside = contactSection.querySelector('aside');
  const form = contactSection.querySelector('form');
  const title = form?.querySelector('h2');
  const description = form?.querySelector('p');
  const fieldsets = form?.querySelectorAll('fieldset');
  const button = form?.querySelector('button[type="submit"]');
  
  if (aside) {
    aside.style.opacity = '';
    aside.style.transform = '';
  }
  
  if (title) {
    title.style.opacity = '';
    title.style.transform = '';
  }
  
  if (description) {
    description.style.opacity = '';
    description.style.transform = '';
  }
  
  fieldsets?.forEach(fieldset => {
    fieldset.style.opacity = '';
    fieldset.style.transform = '';
  });
  
  if (button) {
    button.style.opacity = '';
    button.style.transform = '';
  }
}

// ... (todo tu código existente)

// ═══════════════════════════════════════════════════════════════════════════
// EFECTO SCROLL DEL FOOTER - Aparece/desaparece con el scroll
// ═══════════════════════════════════════════════════════════════════════════

let footerEffectInitialized = false;
let lastScrollY = 0;
let footerVisible = true;
let ticking = false;

/**
 * Inicializa el efecto de scroll del footer
 * - Scroll hacia abajo: footer se esconde (sube)
 * - Scroll hacia arriba: footer aparece (baja)
 * - Solo se activa cuando la sección Contact está al 90% visible
 */
export function initFooterScrollEffect() {
  if (footerEffectInitialized) return;
  
  const footer = document.querySelector('footer');
  const contactSection = document.getElementById('contact');
  
  if (!footer || !contactSection) return;
  
  // Estado inicial: footer visible
  footer.style.transform = 'translateY(0)';
  footer.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  footerVisible = true;
  
  function handleFooterScroll() {
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Obtener posición de la sección Contact
    const contactRect = contactSection.getBoundingClientRect();
    const contactTop = contactRect.top + window.scrollY;
    const contactHeight = contactRect.height;
    
    // Calcular el 90% de la sección Contact
    const triggerPoint = contactTop + (contactHeight * 0.9);
    
    // Solo activar el efecto si estamos cerca del final (después del 90% de Contact)
    const isNearBottom = currentScrollY + windowHeight >= triggerPoint;
    
    if (!isNearBottom) {
      // Antes del 90% de Contact: footer siempre visible
      if (!footerVisible) {
        footer.style.transform = 'translateY(0)';
        footerVisible = true;
      }
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }
    
    // Después del 90% de Contact: aplicar efecto de scroll
    if (currentScrollY > lastScrollY) {
      // Scroll hacia ABAJO → esconder footer (subir)
      if (footerVisible) {
        footer.style.transform = 'translateY(100%)';
        footerVisible = false;
      }
    } else {
      // Scroll hacia ARRIBA → mostrar footer (bajar)
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
  handleFooterScroll(); // Ejecutar una vez al inicio
  
  footerEffectInitialized = true;
}