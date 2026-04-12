// index.js
import { initBreakpoint } from './breakpoint.js';

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBreakpoint);
} else {
  initBreakpoint();
}