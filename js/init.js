/**
 * Main initialization script
 * Imports and initializes all modules
 */

import { initTypewriter } from './modules/typewriter.js';
import { initPortraitReveal } from './modules/portrait-reveal.js';
import { initParticleCanvas } from './modules/particle-canvas.js';
import { initScrollAnimation } from './modules/scroll-animation.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initPortraitReveal();
    initParticleCanvas();
    initScrollAnimation();
});
