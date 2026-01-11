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
    
    // Passport Animation - KORRIGIERTE VERSION
    function setupPassportAnimations() {
        document.querySelectorAll('.passport-cover').forEach(cover => {
            // Remove existing listeners to avoid duplicates
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
    
    // NEUE verbesserte Mobile-Handling
    function handleMobilePassportClick(cover) {
        const isOpen = cover.classList.contains('open');
        const container = cover.closest('.passport-container');
        const stamp = container.querySelector('.passport-stamp');
        const leftPage = container.querySelector('.passport-inside-left');
        const rightPage = container.querySelector('.passport-inside-right');
        
        if (!isOpen) {
            // Öffnen
            cover.classList.add('open');
            
            // Innenseiten vorbereiten
            if (leftPage) {
                leftPage.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s';
                leftPage.style.opacity = '1';
                leftPage.style.transform = 'translateX(-50%) translateY(0)';
            }
            
            if (rightPage) {
                rightPage.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s';
                rightPage.style.opacity = '1';
                rightPage.style.transform = 'translateX(-50%) translateY(220px)';
            }
            
            // Stempel nach Verzögerung anzeigen
            setTimeout(() => {
                if (stamp) {
                    stamp.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s';
                    stamp.style.opacity = '1';
                    stamp.style.transform = 'translateX(-50%) scale(1) rotate(5deg)';
                    stamp.style.top = '330px';
                }
            }, 1200);
            
            // Auto-close nach 5 Sekunden
            setTimeout(() => {
                if (cover.classList.contains('open')) {
                    handleMobilePassportClose(cover);
                }
            }, 5000);
        } else {
            // Schließen
            handleMobilePassportClose(cover);
        }
    }
    
    function handleMobilePassportClose(cover) {
        const container = cover.closest('.passport-container');
        const stamp = container.querySelector('.passport-stamp');
        const leftPage = container.querySelector('.passport-inside-left');
        const rightPage = container.querySelector('.passport-inside-right');
        
        // Stempel zuerst verstecken
        if (stamp) {
            stamp.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            stamp.style.opacity = '0';
            stamp.style.transform = 'translateX(-50%) scale(0)';
        }
        
        // Innenseiten verstecken
        if (leftPage) {
            leftPage.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s';
            leftPage.style.opacity = '0';
            leftPage.style.transform = 'translateX(-50%) translateY(-20px)';
        }
        
        if (rightPage) {
            rightPage.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0s';
            rightPage.style.opacity = '0';
            rightPage.style.transform = 'translateX(-50%) translateY(20px)';
        }
        
        // Cover schließen
        setTimeout(() => {
            cover.classList.remove('open');
            
            // Transitions nach Animation zurücksetzen
            setTimeout(() => {
                if (stamp) stamp.style.transition = '';
                if (leftPage) leftPage.style.transition = '';
                if (rightPage) rightPage.style.transition = '';
            }, 400);
        }, 200);
    }
    
    function handleDesktopPassportClick(cover) {
        const isOpen = cover.classList.contains('open');
        const container = cover.closest('.passport-container');
        const stamp = container.querySelector('.passport-stamp');
        const leftPage = container.querySelector('.passport-inside-left');
        const rightPage = container.querySelector('.passport-inside-right');
        const spine = container.querySelector('.page-spine');
        
        if (!isOpen) {
            // Öffnen
            cover.classList.add('open');
            
            // Innenseiten anzeigen
            if (leftPage) {
                leftPage.style.opacity = '1';
                leftPage.style.transform = 'translateX(0)';
            }
            
            if (rightPage) {
                rightPage.style.opacity = '1';
                rightPage.style.transform = 'translateX(0)';
            }
            
            if (spine) {
                spine.style.opacity = '1';
            }
            
            // Stempel nach Verzögerung anzeigen
            setTimeout(() => {
                if (stamp) {
                    stamp.style.opacity = '1';
                    stamp.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            }, 1500);
            
            // Auto-close nach 5 Sekunden
            setTimeout(() => {
                if (cover.classList.contains('open')) {
                    cover.classList.remove('open');
                    
                    // Alles zurücksetzen
                    if (stamp) {
                        stamp.style.opacity = '0';
                        stamp.style.transform = 'translate(-50%, -50%) scale(0)';
                    }
                    
                    if (leftPage) {
                        leftPage.style.opacity = '0';
                        leftPage.style.transform = 'translateX(-20px)';
                    }
                    
                    if (rightPage) {
                        rightPage.style.opacity = '0';
                        rightPage.style.transform = 'translateX(20px)';
                    }
                    
                    if (spine) {
                        spine.style.opacity = '0';
                    }
                }
            }, 5000);
        } else {
            // Schließen
            cover.classList.remove('open');
            
            // Alles verstecken
            if (stamp) {
                stamp.style.opacity = '0';
                stamp.style.transform = 'translate(-50%, -50%) scale(0)';
            }
            
            if (leftPage) {
                leftPage.style.opacity = '0';
                leftPage.style.transform = 'translateX(-20px)';
            }
            
            if (rightPage) {
                rightPage.style.opacity = '0';
                rightPage.style.transform = 'translateX(20px)';
            }
            
            if (spine) {
                spine.style.opacity = '0';
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
                                const pContainer = p.closest('.passport-container');
                                const pStamp = pContainer?.querySelector('.passport-stamp');
                                const pLeft = pContainer?.querySelector('.passport-inside-left');
                                const pRight = pContainer?.querySelector('.passport-inside-right');
                                const pSpine = pContainer?.querySelector('.page-spine');
                                
                                if (pStamp) {
                                    pStamp.style.opacity = '0';
                                    pStamp.style.transform = 'translate(-50%, -50%) scale(0)';
                                }
                                if (pLeft) pLeft.style.opacity = '0';
                                if (pRight) pRight.style.opacity = '0';
                                if (pSpine) pSpine.style.opacity = '0';
                            });
                            
                            // Open this passport
                            setTimeout(() => {
                                passport.classList.add('open');
                            }, 500);
                            
                            // Auto-close after 5 seconds
                            setTimeout(() => {
                                if (passport.classList.contains('open')) {
                                    passport.classList.remove('open');
                                    const container = passport.closest('.passport-container');
                                    const stamp = container?.querySelector('.passport-stamp');
                                    const leftPage = container?.querySelector('.passport-inside-left');
                                    const rightPage = container?.querySelector('.passport-inside-right');
                                    const spine = container?.querySelector('.page-spine');
                                    
                                    if (stamp) {
                                        stamp.style.opacity = '0';
                                        stamp.style.transform = 'translate(-50%, -50%) scale(0)';
                                    }
                                    if (leftPage) leftPage.style.opacity = '0';
                                    if (rightPage) rightPage.style.opacity = '0';
                                    if (spine) spine.style.opacity = '0';
                                }
                            }, 5500);
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
        
        // Close passports when clicking outside (nur auf Desktop)
        if (window.innerWidth > 768 && !e.target.closest('.passport-container')) {
            document.querySelectorAll('.passport-cover.open').forEach(cover => {
                const container = cover.closest('.passport-container');
                const stamp = container.querySelector('.passport-stamp');
                const leftPage = container.querySelector('.passport-inside-left');
                const rightPage = container.querySelector('.passport-inside-right');
                const spine = container.querySelector('.page-spine');
                
                cover.classList.remove('open');
                
                if (stamp) {
                    stamp.style.opacity = '0';
                    stamp.style.transform = 'translate(-50%, -50%) scale(0)';
                }
                if (leftPage) leftPage.style.opacity = '0';
                if (rightPage) rightPage.style.opacity = '0';
                if (spine) spine.style.opacity = '0';
            });
        }
    });
    
    // Window resize handling
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
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
            setupPassportAnimations();
        }, 100);
    });
    
    // Touch feedback for mobile
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('.passport-cover') && navigator.vibrate) {
            navigator.vibrate(10);
        }
    }, { passive: true });
});