/**
 * Portrait reveal module
 * Creates an interactive portrait reveal effect on mouse movement
 */

export function initPortraitReveal() {
    const portraitContainer = document.getElementById('portrait-container');
    const revealCanvas = document.getElementById('reveal-canvas');
    const revealCtx = revealCanvas.getContext('2d');
    
    // Load the reveal image
    const revealImg = new Image();
    revealImg.src = 'assets/SeniorPortrait.png';
    
    // Set canvas size to match container
    revealCanvas.width = 240;
    revealCanvas.height = 240;
    
    // Create an offscreen canvas for the mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = 240;
    maskCanvas.height = 240;
    const maskCtx = maskCanvas.getContext('2d');
    
    portraitContainer.addEventListener('mousemove', (e) => {
        const rect = portraitContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Draw on the mask
        maskCtx.globalCompositeOperation = 'source-over';
        maskCtx.fillStyle = 'white';
        maskCtx.beginPath();
        maskCtx.arc(x, y, 20, 0, Math.PI * 2);
        maskCtx.fill();
    });
    
    // Animation loop for portrait reveal
    function animateReveal() {
        // Clear the reveal canvas
        revealCtx.clearRect(0, 0, 240, 240);
        
        // Fade the mask back to 0 (transparent) over time
        maskCtx.globalCompositeOperation = 'destination-out';
        maskCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        maskCtx.fillRect(0, 0, 240, 240);
        
        // Reset composite operation for next frame
        maskCtx.globalCompositeOperation = 'source-over';
        
        // Draw the reveal image using the mask
        revealCtx.save();
        
        // Use the mask as a clipping region
        revealCtx.drawImage(maskCanvas, 0, 0);
        revealCtx.globalCompositeOperation = 'source-in';
        revealCtx.drawImage(revealImg, 0, 0, 240, 240);
        
        revealCtx.restore();
        
        requestAnimationFrame(animateReveal);
    }
    
    // Start animation when image loads
    revealImg.onload = () => {
        animateReveal();
    };
}
