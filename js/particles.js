/**
 * Particles module
 * Handles particle animation and collision detection
 */

// Get text bounding boxes
function getTextBounds(heroId, heroTitleId, portraitContainerId) {
    const heroTitle = document.getElementById(heroTitleId);
    const heroRect = document.getElementById(heroId).getBoundingClientRect();
    const portraitContainer = document.getElementById(portraitContainerId);
    
    const titleRect = heroTitle.getBoundingClientRect();
    const portraitRect = portraitContainer.getBoundingClientRect();
    
    return [
        {
            x: titleRect.left - heroRect.left,
            y: titleRect.top - heroRect.top,
            width: titleRect.width,
            height: titleRect.height
        },
        {
            x: portraitRect.left - heroRect.left,
            y: portraitRect.top - heroRect.top,
            width: portraitRect.width,
            height: portraitRect.height
        }
    ];
}

// Capsule collision detection helper
function capsuleDistance(x1, y1, w1, h1, x2, y2, w2, h2) {
    const r1 = h1 / 2;
    const r2 = h2 / 2;
    
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const minDist = r1 + r2;
    
    return { distance, minDist, dx, dy };
}

// Capsule-to-rectangle collision
function capsuleRectCollision(cx, cy, width, height, rx, ry, rw, rh) {
    const radius = height / 2;
    const expandedRect = {
        x: rx - radius,
        y: ry - radius,
        width: rw + radius * 2,
        height: rh + radius * 2
    };
    
    const closestX = Math.max(expandedRect.x, Math.min(cx, expandedRect.x + expandedRect.width));
    const closestY = Math.max(expandedRect.y, Math.min(cy, expandedRect.y + expandedRect.height));
    
    const dx = cx - closestX;
    const dy = cy - closestY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return { collision: distance < radius, distance, dx, dy, radius };
}

// Particle class
class Particle {
    constructor(index, label, canvas, getTextBoundsFn) {
        this.index = index;
        this.label = label;
        this.canvas = canvas;
        this.getTextBoundsFn = getTextBoundsFn;
        this.button = document.getElementById(`particle-${index}`);
        this.isHovered = false;
        this.savedVx = 0;
        this.savedVy = 0;
        
        let isValidPosition = false;
        
        setTimeout(() => {
            this.width = this.button.offsetWidth;
            this.height = this.button.offsetHeight;
        }, 0);
        
        while (!isValidPosition) {
            this.x = Math.random() * (canvas.width - 200) + 100;
            this.y = Math.random() * (canvas.height - 100) + 50;

            const textBounds = this.getTextBoundsFn();
            isValidPosition = textBounds.every(box => {
                const closestX = Math.max(box.x, Math.min(this.x, box.x + box.width));
                const closestY = Math.max(box.y, Math.min(this.y, box.y + box.height));
                const dx = this.x - closestX;
                const dy = this.y - closestY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance >= 80;
            });
        }
        
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.color = '#BB4430';
        
        setTimeout(() => {
            this.width = this.button.offsetWidth;
            this.height = this.button.offsetHeight;
            this.updateButtonPosition();
        }, 10);
        
        this.button.addEventListener('mouseenter', () => {
            this.isHovered = true;
            this.savedVx = this.vx;
            this.savedVy = this.vy;
            this.vx = 0;
            this.vy = 0;
        });
        
        this.button.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.vx = this.savedVx;
            this.vy = this.savedVy;
        });
    }

    updateButtonPosition() {
        if (!this.width || !this.height) return;
        this.button.style.left = `${this.x - this.width / 2}px`;
        this.button.style.top = `${this.y - this.height / 2}px`;
    }

    update(particles, textBounds) {
        if (!this.width || !this.height) return;
        
        if (!this.isHovered) {
            this.x += this.vx;
            this.y += this.vy;

            const radius = this.height / 2;
            const halfWidth = this.width / 2;
            
            if (this.x + halfWidth > this.canvas.width || this.x - halfWidth < 0) {
                this.vx = -this.vx;
                this.savedVx = this.vx;
                this.x = Math.max(halfWidth, Math.min(this.canvas.width - halfWidth, this.x));
            }
            if (this.y + radius > this.canvas.height || this.y - radius < 0) {
                this.vy = -this.vy;
                this.savedVy = this.vy;
                this.y = Math.max(radius, Math.min(this.canvas.height - radius, this.y));
            }

            particles.forEach(other => {
                if (other === this || !other.width || !other.height) return;
                
                const result = capsuleDistance(
                    this.x, this.y, this.width, this.height,
                    other.x, other.y, other.width, other.height
                );
                
                if (result.distance < result.minDist) {
                    const angle = Math.atan2(result.dy, result.dx);
                    const overlap = result.minDist - result.distance;
                    
                    if (!this.isHovered) {
                        this.x -= Math.cos(angle) * overlap / 2;
                        this.y -= Math.sin(angle) * overlap / 2;
                    }
                    if (!other.isHovered) {
                        other.x += Math.cos(angle) * overlap / 2;
                        other.y += Math.sin(angle) * overlap / 2;
                    }
                    
                    if (!this.isHovered && !other.isHovered) {
                        const tempVx = this.vx;
                        const tempVy = this.vy;
                        this.vx = other.vx;
                        this.vy = other.vy;
                        other.vx = tempVx;
                        other.vy = tempVy;
                        
                        this.savedVx = this.vx;
                        this.savedVy = this.vy;
                        other.savedVx = other.vx;
                        other.savedVy = other.vy;
                    } else if (!this.isHovered) {
                        this.vx = -this.vx;
                        this.vy = -this.vy;
                        this.savedVx = this.vx;
                        this.savedVy = this.vy;
                    } else if (!other.isHovered) {
                        other.vx = -other.vx;
                        other.vy = -other.vy;
                        other.savedVx = other.vx;
                        other.savedVy = other.vy;
                    }
                }
            });

            textBounds.forEach(box => {
                const result = capsuleRectCollision(
                    this.x, this.y, this.width, this.height,
                    box.x, box.y, box.width, box.height
                );
                
                if (result.collision) {
                    if (result.distance === 0) {
                        this.vx = -this.vx;
                        this.vy = -this.vy;
                        this.x += (Math.random() - 0.5) * 20;
                        this.y += (Math.random() - 0.5) * 20;
                        this.savedVx = this.vx;
                        this.savedVy = this.vy;
                    } else {
                        const nx = result.dx / result.distance;
                        const ny = result.dy / result.distance;
                        
                        const overlap = result.radius - result.distance;
                        this.x += nx * overlap;
                        this.y += ny * overlap;
                        
                        const dotProduct = this.vx * nx + this.vy * ny;
                        this.vx -= 2 * dotProduct * nx;
                        this.vy -= 2 * dotProduct * ny;
                        this.savedVx = this.vx;
                        this.savedVy = this.vy;
                    }
                }
            });
        }

        this.updateButtonPosition();
    }
}

export function initParticles(canvasId, heroId, heroTitleId, portraitContainerId, labels) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create getTextBounds function with closure
    const getTextBoundsFn = () => getTextBounds(heroId, heroTitleId, portraitContainerId);
    
    // Create particles with labels
    const particles = [];
    for (let i = 0; i < labels.length; i++) {
        particles.push(new Particle(i, labels[i], canvas, getTextBoundsFn));
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const textBounds = getTextBoundsFn();
        
        particles.forEach(particle => {
            particle.update(particles, textBounds);
        });

        requestAnimationFrame(animate);
    }

    animate();
    
};
