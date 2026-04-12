/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BREAKPOINT.JS - ORQUESTADOR RESPONSIVE
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { SCREEN } from './screen.js';
import { initInfiniteCarousel } from './functions/animation.js';
import { 
  initProjectFilters,
  initDesktopNavigation, 
  initMobileNavigation,
  initSmoothNavigation,
  initActiveSectionDetection,
  initFooterHide,
  initSectionAnimations
} from './functions/ui.js';

let currentBreakpoint = null;
let carouselCleanup = null;

function getBreakpoint(width) {
  if (width < SCREEN.laptop) return 'mobile';
  if (width >= SCREEN.laptop && width < SCREEN.desktop) return 'laptop';
  if (width >= SCREEN.desktop && width < SCREEN['2k']) return 'desktop';
  if (width >= SCREEN['2k']) return '2k';
  return 'laptop';
}

function startCarousel() {
  if (carouselCleanup) {
    carouselCleanup();
    carouselCleanup = null;
  }
  carouselCleanup = initInfiniteCarousel();
}

let sharedNavigationInitialized = false;

function initSharedNavigation() {
  if (sharedNavigationInitialized) return;
  initSmoothNavigation();
  initActiveSectionDetection();
  initFooterHide();
  initSectionAnimations();  // ✅ NUEVO: Inicializa las animaciones de la Hero
  sharedNavigationInitialized = true;
}

const BREAKPOINTS = {
  mobile: () => {
    initProjectFilters();
    initMobileNavigation();
    initSharedNavigation();
    startCarousel();
  },
  laptop: () => {
    initProjectFilters();
    initMobileNavigation();
    initSharedNavigation();
    startCarousel();
  },
  desktop: () => {
    initProjectFilters();
    initDesktopNavigation();
    initSharedNavigation();
    startCarousel();
  },
  "2k": () => {
    initProjectFilters();
    initDesktopNavigation();
    initSharedNavigation();
    startCarousel();
  }
};

function executeBreakpoint() {
  const width = window.innerWidth;
  const breakpoint = getBreakpoint(width);
  if (currentBreakpoint === breakpoint) return;
  currentBreakpoint = breakpoint;
  BREAKPOINTS[breakpoint]();
}

export function initBreakpoint() {
  executeBreakpoint();
  window.addEventListener('resize', () => executeBreakpoint());
}