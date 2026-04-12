// ===================================================================
// SCREEN - BREAKPOINTS DE PANTALLA
// ===================================================================
// ESTE ARCHIVO DEFINE LOS TAMAÑOS BASE DE PANTALLA (BREAKPOINTS)
// QUE SE UTILIZAN EN TODO EL SISTEMA PARA EL DISEÑO RESPONSIVE.
//
// PROPÓSITO:
//   Centralizar todos los puntos de quiebre (breakpoints) en un solo lugar
//   para mantener consistencia en toda la aplicación.
//
// ¿QUÉ ES UN BREAKPOINT?
//   Es un ancho de pantalla específico donde el diseño cambia para
//   adaptarse a diferentes dispositivos (móvil, tablet, laptop, etc.)
//
// IMPORTANTE:
//   - ESTE ARCHIVO NO CONTIENE LÓGICA, SOLO DATOS (constantes)
//   - Los valores están en píxeles (px)
//   - screen.js NO importa nada, solo exporta
//   - Es la fuente de verdad única para breakpoints
//   - Cualquier archivo que necesite breakpoints debe importar desde aquí
//
// USO TÍPICO:
//   import { SCREEN } from './screen.js';
//   
//   if (window.innerWidth >= SCREEN.laptop) {
//     // Ejecutar código para laptop/escritorio
//   }
// ===================================================================

// ==================== OBJETO SCREEN ====================
// ----------------------------------------------------------------
// SCREEN
// ----------------------------------------------------------------
// Contiene todos los breakpoints organizados por tipo de dispositivo
//
// VALORES:
//   mobile:   0px    - Desde 0px hasta 767px (dispositivos móviles)
//   tablet:   768px  - Desde 768px hasta 1023px (tablets)
//   laptop:   1024px - Desde 1024px hasta 1279px (laptops/escritorio pequeño)
//   desktop:  1280px - Desde 1280px hasta 1535px (escritorio estándar)
//   "2k":     1536px - Desde 1536px en adelante (pantallas 2K, 4K)
//
// NOTA: "2k" está entre comillas porque la clave tiene un guión,
//       pero JavaScript permite accederlo como SCREEN["2k"]
//
// EJEMPLO DE USO:
//   // Detectar si es móvil
//   const isMobile = window.innerWidth < SCREEN.tablet;
//   
//   // Detectar si es tablet
//   const isTablet = window.innerWidth >= SCREEN.tablet && 
//                    window.innerWidth < SCREEN.laptop;
//   
//   // Detectar si es laptop o superior
//   const isLaptopOrGreater = window.innerWidth >= SCREEN.laptop;
//   
//   // Detectar si es 2K o superior
//   const isUltraWide = window.innerWidth >= SCREEN["2k"];
export const SCREEN = {
  mobile: 0,      // Desde 0px (todos los dispositivos comienzan aquí)
  tablet: 768,    // Tablets como iPad (vertical)
  laptop: 1024,   // Laptops y tablets grandes (horizontal)
  desktop: 1280,  // Escritorios estándar
  "2k": 1536      // Pantallas grandes 2K, 4K, ultra-wide
};