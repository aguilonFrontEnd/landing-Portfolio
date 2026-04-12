  // Importar directamente
  import { initBreakpoint } from '/src/script/index.js';
  
  // Ejecutar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBreakpoint);
  } else {
    initBreakpoint();
  }
