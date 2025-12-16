// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.left-nav a');
    const navDot = document.querySelector('.nav-dot');

    // Fade in header and nav elements on load
    gsap.from('header', {
        duration: 1,
        opacity: 0,
        y: -20,
        ease: 'power2.out',
        delay: 0.2
    });

    gsap.from('.left-nav', {
        duration: 1,
        opacity: 0,
        x: -20,
        ease: 'power2.out',
        delay: 0.4
    });

    gsap.from('.social-links', {
        duration: 1,
        opacity: 0,
        x: -20,
        ease: 'power2.out',
        delay: 0.5
    });

    gsap.from('.bio', {
        duration: 1,
        opacity: 0,
        y: 20,
        ease: 'power2.out',
        delay: 0.6
    });

    gsap.from('footer', {
        duration: 1,
        opacity: 0,
        y: 20,
        ease: 'power2.out',
        delay: 0.7
    });

    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // If it's the home button (dot), close the content
            if (this.classList.contains('nav-dot')) {
                e.preventDefault();
                mainContent.classList.add('hidden');
                return;
            }

            // If it's a section link
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // Show main content
                    mainContent.classList.remove('hidden');

                    // Hide all sections
                    document.querySelectorAll('.content-section').forEach(section => {
                        section.style.display = 'none';
                    });

                    // Show target section
                    targetSection.style.display = 'block';

                    // Scroll to top of content
                    mainContent.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });

                    // Animate section in
                    gsap.from(targetSection, {
                        duration: 0.6,
                        opacity: 0,
                        y: 30,
                        ease: 'power2.out'
                    });
                }
            }
        });
    });

    // Close main content when clicking outside or on dot
    navDot.addEventListener('click', (e) => {
        e.preventDefault();
        mainContent.classList.add('hidden');
    });

    // Add close button to main content
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', () => {
        mainContent.classList.add('hidden');
    });
    mainContent.appendChild(closeBtn);

    // Hide all sections initially
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
});
