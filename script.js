// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Fade in elements on load
    gsap.from('nav', {
        duration: 0.8,
        y: -20,
        opacity: 0,
        ease: 'power2.out'
    });

    gsap.from('.hero h1', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        delay: 0.2,
        ease: 'power2.out'
    });

    gsap.from('.hero .subtitle', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        delay: 0.3,
        ease: 'power2.out'
    });

    gsap.from('.hero .description', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        delay: 0.4,
        ease: 'power2.out'
    });

    // Animate project list items
    gsap.from('.project-list li', {
        duration: 0.6,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        delay: 0.5,
        ease: 'power2.out'
    });

    // Smooth scroll with offset
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 0.8,
                    scrollTo: { y: target, offsetY: 50 },
                    ease: 'power2.inOut'
                });
            }
        });
    });
});
