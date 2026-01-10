document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            const isVisible = navLinks.style.display === 'flex';
            navLinks.style.display = isVisible ? 'none' : 'flex';
            
            if (!isVisible) {
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'rgba(255, 255, 255, 0.98)';
                navLinks.style.backdropFilter = 'blur(20px)';
                navLinks.style.flexDirection = 'column';
                navLinks.style.padding = '25px';
                navLinks.style.gap = '20px';
                navLinks.style.borderTop = '1px solid var(--light-border)';
                navLinks.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.1)';
                navLinks.style.zIndex = '1001';
            }
        });
    }
    
    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                if (window.innerWidth <= 768 && navLinks) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });
    
    // Passport Animation - EINFACHE VERSION
    function setupPassportAnimations() {
        document.querySelectorAll('.passport-cover').forEach(cover => {
            // Remove existing listeners
            cover.removeEventListener('click', handlePassportClick);
            cover.addEventListener('click', handlePassportClick);
        });
    }
    
    function handlePassportClick(e) {
        e.stopPropagation();
        const cover = e.currentTarget;
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            handleMobilePassportClick(cover);
        } else {
            handleDesktopPassportClick(cover);
        }
    }
    
    function handleMobilePassportClick(cover) {
        const isOpen = cover.classList.contains('open');
        const container = cover.closest('.passport-container');
        const stamp = container.querySelector('.passport-stamp');
        
        if (!isOpen) {
            // Öffnen
            cover.classList.add('open');
            
            // Stempel nach Verzögerung anzeigen
            setTimeout(() => {
                if (stamp) {
                    stamp.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.5s';
                    stamp.style.opacity = '1';
                    stamp.style.transform = stamp.style.transform.replace('scale(0)', 'scale(1)');
                }
            }, 1500);
            
            // Auto-close nach 4 Sekunden
            setTimeout(() => {
                if (cover.classList.contains('open')) {
                    handleMobilePassportClose(cover, stamp);
                }
            }, 4000);
        } else {
            // Schließen
            handleMobilePassportClose(cover, stamp);
        }
    }
    
    function handleMobilePassportClose(cover, stamp) {
        cover.classList.remove('open');
        
        // Stempel sofort verstecken
        if (stamp) {
            stamp.style.transition = 'all 0.3s ease';
            stamp.style.opacity = '0';
            stamp.style.transform = stamp.style.transform.replace('scale(1)', 'scale(0)');
            
            // Transition nach Animation zurücksetzen
            setTimeout(() => {
                stamp.style.transition = '';
            }, 300);
        }
    }
    
    function handleDesktopPassportClick(cover) {
        const isOpen = cover.classList.contains('open');
        const container = cover.closest('.passport-container');
        const stamp = container.querySelector('.passport-stamp');
        
        if (!isOpen) {
            // Öffnen
            cover.classList.add('open');
            
            // Auto-close nach 4 Sekunden
            setTimeout(() => {
                if (cover.classList.contains('open')) {
                    cover.classList.remove('open');
                    
                    // Stempel verstecken
                    if (stamp) {
                        stamp.style.transition = 'all 0.3s ease';
                        stamp.style.opacity = '0';
                        stamp.style.transform = 'translate(-50%, -50%) scale(0)';
                        
                        setTimeout(() => {
                            stamp.style.transition = '';
                        }, 300);
                    }
                }
            }, 4000);
        } else {
            // Schließen
            cover.classList.remove('open');
            
            // Stempel verstecken
            if (stamp) {
                stamp.style.transition = 'all 0.3s ease';
                stamp.style.opacity = '0';
                stamp.style.transform = 'translate(-50%, -50%) scale(0)';
                
                setTimeout(() => {
                    stamp.style.transition = '';
                }, 300);
            }
        }
    }
    
    // Auto-animate passports on scroll (Desktop only)
    if (window.innerWidth > 768) {
        let lastAnimatedSpacer = null;
        
        const passportObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
                    const spacer = entry.target;
                    
                    if (spacer !== lastAnimatedSpacer) {
                        lastAnimatedSpacer = spacer;
                        
                        const passport = spacer.querySelector('.passport-cover');
                        if (passport && !passport.classList.contains('open')) {
                            // Close any other open passports
                            document.querySelectorAll('.passport-cover.open').forEach(p => {
                                p.classList.remove('open');
                                const pStamp = p.closest('.passport-container')?.querySelector('.passport-stamp');
                                if (pStamp) {
                                    pStamp.style.opacity = '0';
                                    pStamp.style.transform = 'translate(-50%, -50%) scale(0)';
                                }
                            });
                            
                            // Open this passport
                            setTimeout(() => {
                                passport.classList.add('open');
                            }, 500);
                            
                            // Auto-close after 4 seconds
                            setTimeout(() => {
                                if (passport.classList.contains('open')) {
                                    passport.classList.remove('open');
                                    const stamp = passport.closest('.passport-container')?.querySelector('.passport-stamp');
                                    if (stamp) {
                                        stamp.style.opacity = '0';
                                        stamp.style.transform = 'translate(-50%, -50%) scale(0)';
                                    }
                                }
                            }, 4500);
                        }
                    }
                }
            });
        }, {
            threshold: 0.7,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Initialize after travel data loads
        setTimeout(() => {
            document.querySelectorAll('.travel-spacer').forEach(spacer => {
                passportObserver.observe(spacer);
            });
        }, 1000);
    }
    
    // Initialize passport animations
    setupPassportAnimations();
    
    // Re-initialize after travel data loads
    setTimeout(setupPassportAnimations, 500);
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && navLinks) {
            if (!e.target.closest('.nav-container') && navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            }
        }
        
        // Close passports when clicking outside
        if (!e.target.closest('.passport-container')) {
            document.querySelectorAll('.passport-cover.open').forEach(cover => {
                const isMobile = window.innerWidth <= 768;
                const container = cover.closest('.passport-container');
                const stamp = container.querySelector('.passport-stamp');
                
                cover.classList.remove('open');
                
                // Stempel verstecken
                if (stamp) {
                    if (isMobile) {
                        stamp.style.opacity = '0';
                        stamp.style.transform = 'translateX(-50%) scale(0)';
                    } else {
                        stamp.style.opacity = '0';
                        stamp.style.transform = 'translate(-50%, -50%) scale(0)';
                    }
                }
            });
        }
    });
    
    // Window resize handling
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks) {
            navLinks.style.display = 'flex';
            navLinks.style.position = 'static';
            navLinks.style.flexDirection = 'row';
            navLinks.style.padding = '0';
            navLinks.style.background = 'transparent';
            navLinks.style.boxShadow = 'none';
            navLinks.style.backdropFilter = 'none';
            navLinks.style.borderTop = 'none';
        }
        
        // Re-initialize passport animations on resize
        setTimeout(setupPassportAnimations, 100);
    });
    
    // Touch feedback for mobile
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.passport-cover') && navigator.vibrate) {
            navigator.vibrate(10);
        }
    }, { passive: true });
});