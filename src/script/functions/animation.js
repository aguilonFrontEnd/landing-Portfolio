/**
 * ============================================================================
 * ANIMATION.JS - FUNCIONES DE ANIMACION
 * ============================================================================
 * Proposito: Contiene TODAS las animaciones del sitio web.
 * 
 * SECCIONES:
 * 1. Typewriter Effect        - Efecto de escritura para el nombre
 * 2. Menu Mobile              - Animacion de apertura/cierre del menu hamburguesa
 * 3. Carrusel Infinito        - Carrusel de tecnologias que se mueve automaticamente
 * 4. Animaciones Hero         - Animaciones de entrada para la seccion principal
 * 5. Animaciones About        - Animaciones de entrada para la seccion "Quien soy"
 * 6. Animaciones Services     - Animaciones de entrada para la seccion de servicios
 * 7. Animaciones Projects     - Animaciones de entrada para la seccion de proyectos
 * 8. Animaciones Contact      - Animaciones de entrada para la seccion de contacto
 * 9. Efecto Scroll Footer     - Footer aparece/desaparece con el scroll
 * ============================================================================
 */

// ============================================================================
// 1. TYPEWRITER EFFECT
// ============================================================================

/**
 * Crea un efecto de maquina de escribir para un elemento de texto.
 * Se usa en el menu desktop cuando se activa el modo scroll.
 * 
 * @param {HTMLElement} textElement - Elemento DOM donde se escribira el texto
 * @param {string} fullText - Texto completo que se escribira letra por letra
 * @param {number} speed - Velocidad en milisegundos por cada letra (default: 60ms)
 * @returns {Object} - Objeto con metodos start() y stop() para controlar la animacion
 */
export function createTypewriter(textElement, fullText, speed = 60) {
  let typewriterTimer = null;
  let currentIndex = 0;
  
  /**
   * Inicia el efecto typewriter.
   * Limpia cualquier animacion previa y comienza a escribir desde cero.
   */
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
  
  /**
   * Detiene el efecto typewriter y limpia el texto.
   */
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

/**
 * Anima la apertura y cierre del menu mobile/tablet.
 * Usa transiciones CSS para un efecto suave de slide y fade.
 * 
 * @param {HTMLElement} mobileMenu - Elemento DOM del menu mobile
 * @param {boolean} isOpening - true para abrir el menu, false para cerrarlo
 */
export function animateMobileMenu(mobileMenu, isOpening) {
  if (isOpening) {
    // ABRIR MENU: Mostrar con fade in y slide desde la derecha
    mobileMenu.style.display = 'flex';
    requestAnimationFrame(() => {
      mobileMenu.classList.add('menu-open');
      mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    });
  } else {
    // CERRAR MENU: Ocultar con fade out y slide hacia la derecha
    mobileMenu.classList.remove('menu-open');
    mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      mobileMenu.style.display = 'none';
    }, 300); // Esperar a que termine la transicion CSS (300ms)
  }
}

// ============================================================================
// 3. CARRUSEL INFINITO DE TECNOLOGIAS
// ============================================================================

/**
 * Inicializa el carrusel infinito de iconos de tecnologias.
 * Clona los elementos originales para crear un loop infinito.
 * Se pausa automaticamente al pasar el mouse por encima.
 * 
 * @returns {Function} - Funcion de limpieza para detener la animacion y remover eventos
 */
export function initInfiniteCarousel() {
  const track = document.getElementById("carousel-track");
  
  if (!track) {
    console.warn("No se encontro el elemento con id='carousel-track'");
    return () => {};
  }

  // Evitar inicializacion multiple
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

  console.log(`Carrusel: ${originalItems.length} elementos originales`);

  // Calcular cuantas copias se necesitan para un loop suave
  const singleLoopWidth = originalItems.reduce((total, item) => total + item.getBoundingClientRect().width, 0);
  const viewportWidth = window.innerWidth;
  const neededCopies = Math.ceil((viewportWidth * 2) / singleLoopWidth) + 2;

  // Clonar elementos originales
  const originalItemsClone = originalItems.map(item => item.cloneNode(true));
  track.innerHTML = '';
  
  // Agregar originales y clones
  originalItemsClone.forEach(item => track.appendChild(item));
  for (let i = 0; i < neededCopies; i++) {
    originalItemsClone.forEach(item => track.appendChild(item.cloneNode(true)));
  }

  // Configuracion de la animacion
  let position = 0;
  const speed = 0.8; // Pixeles por frame
  let animationId = null;
  let isAnimating = true;

  /**
   * Funcion de animacion recursiva usando requestAnimationFrame.
   * Mueve el carrusel horizontalmente y resetea la posicion al llegar al final.
   */
  function animate() {
    if (!isAnimating) return;
    position -= speed;
    if (Math.abs(position) >= singleLoopWidth * neededCopies) position = 0;
    track.style.transform = `translateX(${position}px)`;
    animationId = requestAnimationFrame(animate);
  }

  /** Pausa la animacion (al hacer hover) */
  function pauseAnimation() {
    isAnimating = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  /** Reanuda la animacion (al quitar el hover) */
  function resumeAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      animate();
    }
  }

  // Event listeners para pausar al hacer hover
  track.addEventListener('mouseenter', pauseAnimation);
  track.addEventListener('mouseleave', resumeAnimation);
  animate();

  // Funcion de limpieza para cuando se destruye el componente
  const cleanup = () => {
    pauseAnimation();
    track.removeAttribute('data-carousel-initialized');
    track.removeEventListener('mouseenter', pauseAnimation);
    track.removeEventListener('mouseleave', resumeAnimation);
    console.log("Carrusel limpiado");
  };

  console.log("Carrusel infinito inicializado");
  return cleanup;
}

// ============================================================================
// 4. ANIMACIONES DE ENTRADA - SECCION HERO (INTRODUCTION)
// ============================================================================

let heroAnimationsInitialized = false;

/**
 * Inicializa las animaciones de entrada para la seccion Hero.
 * 
 * Secuencia de animacion:
 * 1. Imagen del panel derecho: fade in desde opacidad 0.4 a 1
 * 2. Menu desktop: slide desde la derecha hasta su posicion original
 * 3. Textos del aside: aparecen uno tras otro (stagger) desde la izquierda
 * 
 * Tiempos:
 * - Imagen: 100ms
 * - Menu: 250ms
 * - Textos: 400ms, 550ms, 700ms, 850ms, 1000ms, 1150ms
 */
export function initHeroAnimations() {
  if (heroAnimationsInitialized) return;
  
  const heroMain = document.querySelector('#introduction main');
  if (!heroMain) return;
  
  const nav = document.getElementById('main-navigation');
  const aside = document.querySelector('#introduction aside');
  const figure = document.querySelector('#introduction figure');
  
  if (!aside || !figure) return;
  
  // Elementos del aside para animar en secuencia (orden de aparicion)
  const asideElements = [
    aside.querySelector('p.text-gray-secondary'),      // "MY NAME IS"
    aside.querySelector('h2'),                        // "ALEJANDRO"
    aside.querySelector('p.text-yellow-primary'),     // "AGUILON"
    aside.querySelector('p.text-gray-secondary\\/70'), // "BUITRAGO"
    aside.querySelector('.bg-yellow-primary'),        // Boton FRONT END DEVELOPER
    aside.querySelector('footer')                     // Ubicacion
  ].filter(el => el);
  
  // ESTADO INICIAL: Todos los elementos ocultos o en posicion de inicio
  
  // Menu: escondido a la derecha (fuera de pantalla)
  if (nav) {
    nav.style.opacity = '0';
    nav.style.transform = 'translateX(100%)';
    nav.style.transition = 'opacity 0.8s ease-out, transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
  
  // Imagen: empieza con opacidad 0.4 (semi-transparente)
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
  
  // DISPARAR ANIMACIONES EN SECUENCIA
  requestAnimationFrame(() => {
    // 1. Imagen - fade in lento
    setTimeout(() => {
      if (figure) figure.style.opacity = '1';
    }, 100);
    
    // 2. Menu - slide desde la derecha
    setTimeout(() => {
      if (nav) {
        nav.style.opacity = '1';
        nav.style.transform = 'translateX(0)';
      }
    }, 250);
    
    // 3. Textos del aside - stagger progresivo
    asideElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      }, 400 + (index * 150));
    });
  });
  
  heroAnimationsInitialized = true;
}

/**
 * Resetea las animaciones de la seccion Hero.
 * Util cuando se cambia de seccion y se necesita reiniciar el estado.
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

// ============================================================================
// 5. ANIMACIONES DE ENTRADA - SECCION ABOUT
// ============================================================================

let aboutAnimationsInitialized = false;

/**
 * Inicializa las animaciones de entrada para la seccion About.
 * Se activa cuando la seccion es visible (IntersectionObserver).
 * 
 * Secuencia de animacion:
 * 1. Imagen: slide desde la izquierda + fade in
 * 2. Textos: aparecen uno tras otro desde la derecha
 * 3. Linea amarilla: se dibuja de izquierda a derecha
 * 4. Boton CV: aparece con un efecto de rebote
 * 
 * Tiempos:
 * - Imagen: 100ms
 * - Textos: 250ms, 400ms, 550ms, 700ms
 * - Linea amarilla: 400ms
 * - Boton CV: 850ms
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
  
  // Elementos de texto para animar en secuencia
  const textElements = [
    title?.querySelector('p'),                    // "Who is"
    title?.querySelector('h2 span:first-child'),  // "ALEJANDRO"
    paragraphs?.[0],                              // Primer parrafo
    paragraphs?.[1]                               // Segundo parrafo
  ].filter(el => el);
  
  // ESTADO INICIAL: Elementos ocultos o en posicion de inicio
  
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
  
  // Observer para disparar animaciones cuando la seccion es visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !aboutAnimationsInitialized) {
        
        setTimeout(() => {
          if (figure) {
            figure.style.opacity = '1';
            figure.style.transform = 'translateX(0)';
          }
        }, 100);
        
        textElements.forEach((el, index) => {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
          }, 250 + (index * 150));
        });
        
        setTimeout(() => {
          if (yellowLine) yellowLine.style.width = '100%';
        }, 400);
        
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
  }, { threshold: 0.3 });
  
  observer.observe(aboutSection);
}

/**
 * Resetea las animaciones de la seccion About.
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
  
  if (yellowLine) yellowLine.style.width = '';
  if (button) {
    button.style.opacity = '';
    button.style.transform = '';
  }
}

// ============================================================================
// 6. ANIMACIONES DE ENTRADA - SECCION SERVICES
// ============================================================================

let servicesAnimationsInitialized = false;

/**
 * Inicializa las animaciones de entrada para la seccion Services.
 * Se activa cuando la seccion es visible (IntersectionObserver).
 * 
 * Secuencia de animacion:
 * 1. Titulo: slide desde arriba + fade in
 * 2. Linea decorativa: se dibuja de izquierda a derecha
 * 3. Descripcion: fade in con slide up
 * 4. Cards: aparecen una tras otra desde abajo
 * 
 * Tiempos:
 * - Titulo: 100ms
 * - Linea: 250ms
 * - Descripcion: 400ms
 * - Cards: 500ms, 620ms, 740ms, 860ms, 980ms, 1100ms
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
  
  // ESTADO INICIAL
  
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
        
        setTimeout(() => {
          if (title) {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
          }
        }, 100);
        
        setTimeout(() => {
          if (line) line.style.width = '100%';
        }, 250);
        
        setTimeout(() => {
          if (description) {
            description.style.opacity = '1';
            description.style.transform = 'translateY(0)';
          }
        }, 400);
        
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 500 + (index * 120));
        });
        
        servicesAnimationsInitialized = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(servicesSection);
}

/**
 * Resetea las animaciones de la seccion Services.
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
  if (line) line.style.width = '';
  if (description) {
    description.style.opacity = '';
    description.style.transform = '';
  }
  cards.forEach(card => {
    card.style.opacity = '';
    card.style.transform = '';
  });
}

// ============================================================================
// 7. ANIMACIONES DE ENTRADA - SECCION PROJECTS
// ============================================================================

let projectsAnimationsInitialized = false;

/**
 * Inicializa las animaciones de entrada para la seccion Projects.
 * Se activa cuando la seccion es visible (IntersectionObserver).
 * 
 * Secuencia de animacion:
 * 1. Titulo: slide desde la izquierda + fade in
 * 2. Linea decorativa: se dibuja de izquierda a derecha
 * 3. Botones de filtro: caen uno tras otro desde arriba
 * 4. Cards: aparecen con efecto de flip suave (escala + fade)
 * 
 * Tiempos:
 * - Titulo: 100ms
 * - Linea: 250ms
 * - Botones: 350ms, 410ms, 470ms, 530ms
 * - Cards: 550ms, 650ms, 750ms, 850ms...
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
  
  // ESTADO INICIAL
  
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
        
        setTimeout(() => {
          if (title) {
            title.style.opacity = '1';
            title.style.transform = 'translateX(0)';
          }
        }, 100);
        
        setTimeout(() => {
          if (line) line.style.width = '100%';
        }, 250);
        
        filterButtons.forEach((btn, index) => {
          setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
          }, 350 + (index * 60));
        });
        
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, 550 + (index * 100));
        });
        
        projectsAnimationsInitialized = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(projectsSection);
}

/**
 * Resetea las animaciones de la seccion Projects.
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
  if (line) line.style.width = '';
  filterButtons.forEach(btn => {
    btn.style.opacity = '';
    btn.style.transform = '';
  });
  cards.forEach(card => {
    card.style.opacity = '';
    card.style.transform = '';
  });
}

// ============================================================================
// 8. ANIMACIONES DE ENTRADA - SECCION CONTACT
// ============================================================================

let contactAnimationsInitialized = false;

/**
 * Inicializa las animaciones de entrada para la seccion Contact.
 * Se activa cuando la seccion es visible (IntersectionObserver).
 * 
 * Secuencia de animacion:
 * 1. Panel de informacion (derecha): slide desde la derecha
 * 2. Titulo "Contact Us": slide desde arriba
 * 3. Descripcion: slide desde la izquierda
 * 4. Campos del formulario: aparecen uno tras otro desde la izquierda
 * 5. Boton SEND: aparece con efecto de rebote
 * 
 * Tiempos:
 * - Panel info: 100ms
 * - Titulo: 200ms
 * - Descripcion: 300ms
 * - Campos: 400ms, 500ms, 600ms
 * - Boton: 750ms
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
  
  // ESTADO INICIAL
  
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
        
        setTimeout(() => {
          aside.style.opacity = '1';
          aside.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
          if (title) {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
          }
        }, 200);
        
        setTimeout(() => {
          if (description) {
            description.style.opacity = '1';
            description.style.transform = 'translateX(0)';
          }
        }, 300);
        
        fieldsets?.forEach((fieldset, index) => {
          setTimeout(() => {
            fieldset.style.opacity = '1';
            fieldset.style.transform = 'translateX(0)';
          }, 400 + (index * 100));
        });
        
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
  }, { threshold: 0.2 });
  
  observer.observe(contactSection);
}

/**
 * Resetea las animaciones de la seccion Contact.
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

// ============================================================================
// 9. EFECTO SCROLL DEL FOOTER
// ============================================================================

let footerEffectInitialized = false;
let lastScrollY = 0;
let footerVisible = true;
let ticking = false;

/**
 * Inicializa el efecto de scroll para el footer.
 * El footer se esconde al hacer scroll hacia abajo y aparece al hacer scroll hacia arriba.
 * Solo se activa cuando el usuario ha visto al menos el 90% de la seccion Contact.
 * 
 * Comportamiento:
 * - Antes del 90% de Contact: footer siempre visible
 * - Despues del 90% de Contact:
 *   - Scroll hacia ABAJO: footer se esconde (sube)
 *   - Scroll hacia ARRIBA: footer aparece (baja)
 */
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