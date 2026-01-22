/**
 * Typewriter effect module
 * Creates a typewriter animation for text
 */

export function initTypewriter(element, text, speed = 150, delay = 300) {
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < text.length) {
            element.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, speed);
        }
    }
    
    // Start typewriter effect after a delay
    setTimeout(typeWriter, delay);
}
