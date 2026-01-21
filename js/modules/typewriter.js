/**
 * Typewriter effect module
 * Displays text character by character with a typing animation
 */

export function initTypewriter() {
    const heroTitle = document.getElementById('hero-title');
    const titleText = "Hello, I'm Patrick!";
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < titleText.length) {
            heroTitle.textContent += titleText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100); // Adjust speed here (milliseconds per character)
        }
    }
    
    // Start typewriter effect after a short delay
    setTimeout(typeWriter, 500);
}
