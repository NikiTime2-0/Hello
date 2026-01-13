let passportObserver = null;

function observeTravelSpacers() {
    if (!passportObserver) return;
    document.querySelectorAll('.travel-spacer').forEach(spacer => {
        passportObserver.observe(spacer);
    });
}

// Passport Animation - Scroll-basiert, bleibt offen
function setupPassportAnimations() {
    if (!passportObserver) {
        passportObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                    const passport = entry.target.querySelector('.passport-cover');
                    if (passport) {
                        passport.classList.add('open');
                    }
                }
            });
        }, {
            threshold: 0.6,
            rootMargin: '0px 0px -80px 0px'
        });
    }
    observeTravelSpacers();
}

window.setupPassportAnimations = setupPassportAnimations;

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
    
    // Auto-animate passports on scroll (all viewports, stays open)
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
        
        // No passport close on outside click
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

    // Upload handling (Supabase signed URL)
    const uploadForm = document.getElementById('uploadForm');
    const uploadFile = document.getElementById('uploadFile');
    const uploadStatus = document.getElementById('uploadStatus');
    const maxSizeBytes = 50 * 1024 * 1024;

    if (uploadForm && uploadFile && uploadStatus) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            uploadStatus.textContent = '';

            const file = uploadFile.files && uploadFile.files[0];
            if (!file) {
                uploadStatus.textContent = 'Bitte ein Bild auswählen.';
                return;
            }
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                uploadStatus.textContent = 'Nur JPG oder PNG erlaubt.';
                return;
            }
            if (file.size > maxSizeBytes) {
                uploadStatus.textContent = 'Datei ist zu groß (max. 50MB).';
                return;
            }

            uploadStatus.textContent = 'Upload läuft...';

            try {
                const supabaseUrl = 'https://bwjqdbwslrspnjbjflrb.supabase.co';
                const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3anFkYndzbHJzcG5qYmpmbHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMjg5MTYsImV4cCI6MjA4MzkwNDkxNn0.YNXBoQTwDJeEbi4yWHovxHJ40Jv-9KJs0U5HGN74YAs';
                const functionUrl = `${supabaseUrl}/functions/v1/upload`;

                const meta = {
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    platform: navigator.platform || 'unknown',
                    language: navigator.language || 'unknown',
                    screen: {
                        width: window.screen.width,
                        height: window.screen.height
                    }
                };

                const signRes = await fetch(functionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'apikey': supabaseAnonKey
                    },
                    body: JSON.stringify({
                        action: 'sign',
                        filename: file.name,
                        contentType: file.type
                    })
                });

                if (!signRes.ok) {
                    throw new Error('Signierung fehlgeschlagen.');
                }

                const { signedUrl, objectPath } = await signRes.json();

                const uploadRes = await fetch(signedUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': file.type
                    },
                    body: file
                });

                if (!uploadRes.ok) {
                    throw new Error('Upload fehlgeschlagen.');
                }

                const commitRes = await fetch(functionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'apikey': supabaseAnonKey
                    },
                    body: JSON.stringify({
                        action: 'commit',
                        objectPath,
                        meta
                    })
                });

                if (!commitRes.ok) {
                    throw new Error('Metadaten konnten nicht gespeichert werden.');
                }

                uploadStatus.textContent = 'Upload erfolgreich.';
                uploadForm.reset();
            } catch (err) {
                uploadStatus.textContent = 'Fehler beim Upload. Bitte später erneut versuchen.';
            }
        });
    }
});
