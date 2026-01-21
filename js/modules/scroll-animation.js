/**
 * Scroll animation module
 * Adds intersection observer for card animations
 */

export function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all info cards
    document.querySelectorAll('.info-card').forEach(card => {
        observer.observe(card);
    });
}
