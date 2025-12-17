// Theme Switcher
document.addEventListener('DOMContentLoaded', () => {
    // Theme management
    const body = document.body;
    const monospacedToggle = document.getElementById('monospaced-toggle');
    const darkToggle = document.getElementById('dark-toggle');
    const lightToggle = document.getElementById('light-toggle');

    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedMonospaced = localStorage.getItem('monospaced') === 'true';

    // Apply saved preferences
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        lightToggle.checked = true;
        lightToggle.parentElement.classList.add('is-selected');
        darkToggle.parentElement.classList.remove('is-selected');
    } else {
        darkToggle.checked = true;
        darkToggle.parentElement.classList.add('is-selected');
    }

    if (savedMonospaced) {
        body.classList.add('monospaced');
        monospacedToggle.checked = true;
        monospacedToggle.parentElement.classList.add('is-selected');
    }

    // Theme toggle handlers
    darkToggle.addEventListener('change', () => {
        if (darkToggle.checked) {
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
            darkToggle.parentElement.classList.add('is-selected');
            lightToggle.parentElement.classList.remove('is-selected');
        }
    });

    lightToggle.addEventListener('change', () => {
        if (lightToggle.checked) {
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            lightToggle.parentElement.classList.add('is-selected');
            darkToggle.parentElement.classList.remove('is-selected');
        }
    });

    monospacedToggle.addEventListener('change', () => {
        if (monospacedToggle.checked) {
            body.classList.add('monospaced');
            localStorage.setItem('monospaced', 'true');
            monospacedToggle.parentElement.classList.add('is-selected');
        } else {
            body.classList.remove('monospaced');
            localStorage.setItem('monospaced', 'false');
            monospacedToggle.parentElement.classList.remove('is-selected');
        }
    });

    // GSAP Animations and navigation
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.nav-text');
    const navItems = document.querySelectorAll('.site-header-nav li');

    // Enhanced entrance animations with stagger
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.site-header-title', {
        duration: 1.2,
        opacity: 0,
        y: -30,
        ease: 'power4.out'
    })
    .from('.site-header-label', {
        duration: 0.8,
        opacity: 0,
        y: -10
    }, '-=0.6')
    .from('.site-header-nav li', {
        duration: 0.8,
        opacity: 0,
        x: -30,
        stagger: 0.1
    }, '-=0.4')
    .from('.theme .theme-btn', {
        duration: 0.8,
        opacity: 0,
        x: 20,
        stagger: 0.1
    }, '-=0.6')
    .from('.bio', {
        duration: 1,
        opacity: 0,
        y: 30
    }, '-=0.8')
    .from('.copyright', {
        duration: 0.8,
        opacity: 0,
        y: 20
    }, '-=0.6');

    // Magnetic effect for interactive elements
    const interactiveElements = document.querySelectorAll('.nav-text, .theme-btn');
    interactiveElements.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            gsap.to(e.target, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        link.addEventListener('mouseleave', (e) => {
            gsap.to(e.target, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Navigation functionality
    navLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // If it's the home button
            if (href === '#' || href === '') {
                e.preventDefault();
                gsap.to(mainContent, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        mainContent.classList.add('hidden');
                        gsap.set(mainContent, { opacity: 1 });

                        // Update active state
                        navItems.forEach(item => item.classList.remove('is-selected'));
                        navItems[index].classList.add('is-selected');
                    }
                });
                return;
            }

            // If it's a section link
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    // Update active state
                    navItems.forEach(item => item.classList.remove('is-selected'));
                    navItems[index].classList.add('is-selected');

                    // Show main content with animation
                    mainContent.classList.remove('hidden');

                    // Fade out all sections
                    const allSections = document.querySelectorAll('.content-section');
                    gsap.to(allSections, {
                        opacity: 0,
                        duration: 0.2,
                        onComplete: () => {
                            allSections.forEach(section => {
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
                            gsap.fromTo(targetSection,
                                { opacity: 0, y: 30 },
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.6,
                                    ease: 'power3.out'
                                }
                            );

                            // Animate project items with stagger
                            const projectItems = targetSection.querySelectorAll('.project-list li');
                            if (projectItems.length > 0) {
                                gsap.from(projectItems, {
                                    opacity: 0,
                                    y: 20,
                                    stagger: 0.1,
                                    duration: 0.6,
                                    ease: 'power2.out',
                                    delay: 0.2
                                });
                            }

                            // Animate contact items with stagger
                            const contactItems = targetSection.querySelectorAll('.contact-list li');
                            if (contactItems.length > 0) {
                                gsap.from(contactItems, {
                                    opacity: 0,
                                    x: -20,
                                    stagger: 0.1,
                                    duration: 0.6,
                                    ease: 'power2.out',
                                    delay: 0.2
                                });
                            }

                            // Animate paragraphs with stagger
                            const paragraphs = targetSection.querySelectorAll('p, h3, ul');
                            if (paragraphs.length > 0) {
                                gsap.from(paragraphs, {
                                    opacity: 0,
                                    y: 15,
                                    stagger: 0.08,
                                    duration: 0.5,
                                    ease: 'power2.out',
                                    delay: 0.2
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    // Add close button to main content
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';

    // Animate close button on hover
    closeBtn.addEventListener('mouseenter', () => {
        gsap.to(closeBtn, {
            scale: 1.2,
            rotation: 90,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    });

    closeBtn.addEventListener('mouseleave', () => {
        gsap.to(closeBtn, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    closeBtn.addEventListener('click', () => {
        gsap.to(mainContent, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                mainContent.classList.add('hidden');
                gsap.set(mainContent, { opacity: 1 });

                // Reset to home
                navItems.forEach(item => item.classList.remove('is-selected'));
                navItems[0].classList.add('is-selected');
            }
        });
    });
    mainContent.appendChild(closeBtn);

    // Hide all sections initially
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Smooth fade in for gradient when switching themes
    const themeToggles = document.querySelectorAll('#dark-toggle, #light-toggle, #monospaced-toggle');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            gsap.to('#canvas', {
                opacity: 0.2,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    gsap.to('#canvas', {
                        opacity: document.body.classList.contains('light-theme') ? 0.25 : 0.4,
                        duration: 0.3
                    });
                }
            });
        });
    });

    // Add smooth hover effects for project links
    const projectLinks = document.querySelectorAll('.project-list a, .contact-list a');
    projectLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            gsap.to(e.target, {
                x: 5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        link.addEventListener('mouseleave', (e) => {
            gsap.to(e.target, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
});
