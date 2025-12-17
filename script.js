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
    } else {
        darkToggle.checked = true;
    }

    if (savedMonospaced) {
        body.classList.add('monospaced');
        monospacedToggle.checked = true;
    }

    // Theme toggle handlers
    darkToggle.addEventListener('change', () => {
        if (darkToggle.checked) {
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    lightToggle.addEventListener('change', () => {
        if (lightToggle.checked) {
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    monospacedToggle.addEventListener('change', () => {
        if (monospacedToggle.checked) {
            body.classList.add('monospaced');
            localStorage.setItem('monospaced', 'true');
        } else {
            body.classList.remove('monospaced');
            localStorage.setItem('monospaced', 'false');
        }
    });

    // GSAP Animations and navigation
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.left-nav a');
    const navDot = document.querySelector('.nav-dot');

    // Enhanced entrance animations with stagger
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('header h1', {
        duration: 1.2,
        opacity: 0,
        y: -30,
        ease: 'power4.out'
    })
    .from('header .subtitle', {
        duration: 0.8,
        opacity: 0,
        y: -10
    }, '-=0.6')
    .from('.left-nav li', {
        duration: 0.8,
        opacity: 0,
        x: -30,
        stagger: 0.1
    }, '-=0.4')
    .from('.social-links a', {
        duration: 0.8,
        opacity: 0,
        x: -20,
        stagger: 0.1
    }, '-=0.6')
    .from('.theme-switcher .theme-option', {
        duration: 0.8,
        opacity: 0,
        x: -20,
        stagger: 0.1
    }, '-=0.6')
    .from('.bio', {
        duration: 1,
        opacity: 0,
        y: 30
    }, '-=0.8')
    .from('footer', {
        duration: 0.8,
        opacity: 0,
        y: 20
    }, '-=0.6');

    // Magnetic effect for interactive elements
    const interactiveElements = document.querySelectorAll('.left-nav a, .social-links a, .theme-option');
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

    // Parallax effect on bio text
    let scrollPos = 0;
    window.addEventListener('scroll', () => {
        scrollPos = window.pageYOffset;
        gsap.to('.bio', {
            y: scrollPos * 0.3,
            duration: 0.5,
            ease: 'power1.out'
        });
    });

    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // If it's the home button (dot), close the content
            if (this.classList.contains('nav-dot')) {
                e.preventDefault();
                gsap.to(mainContent, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        mainContent.classList.add('hidden');
                        gsap.set(mainContent, { opacity: 1 });
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

                            // Animate section in with stagger for list items
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

    // Close main content when clicking outside or on dot
    navDot.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(mainContent, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                mainContent.classList.add('hidden');
                gsap.set(mainContent, { opacity: 1 });
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
            }
        });
    });
    mainContent.appendChild(closeBtn);

    // Hide all sections initially
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // Floating animation for bio text
    gsap.to('.bio', {
        y: '+=10',
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
    });

    // Subtle pulse animation for page border
    gsap.to('body::before', {
        opacity: 0.15,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
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
