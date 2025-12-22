// =====================
// VEREINFACHTE ANIMATION NUR MIT PASS-STEMPELN
// =====================
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const arrivalNotice = document.getElementById('arrivalNotice');
  const arrivalTitle = document.getElementById('arrivalTitle');
  const arrivalDistance = document.getElementById('arrivalDistance');
  
  const countryCards = document.querySelectorAll('.country-card');
  const spacers = document.querySelectorAll('.travel-spacer');
  const stamps = document.querySelectorAll('.passport-stamp');
  const spacerTexts = document.querySelectorAll('.spacer-text');
  
  // Track current country
  let currentCountry = null;
  let lastAnimatedSpacer = null;
  
  // Country names mapping
  const countryNames = {
    'oesterreich': 'Österreich',
    'italien': 'Italien',
    'kroatien': 'Kroatien',
    'frankreich': 'Frankreich',
    'usa': 'USA',
    'kanada': 'Kanada',
    'china': 'China'
  };
  
  // Make elements full screen height
  function updateHeights() {
    countryCards.forEach(card => {
      card.style.minHeight = '100vh';
      card.style.minHeight = '100dvh';
    });
    document.querySelectorAll('.travel-spacer').forEach(spacer => {
      spacer.style.height = '100vh';
      spacer.style.height = '100dvh';
    });
  }
  
  updateHeights();
  window.addEventListener('resize', updateHeights);
  
  // Track scroll direction
  let lastScrollY = window.scrollY;
  let scrollDirection = 'down';
  
  window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;
    scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
    lastScrollY = currentScrollY;
  });
  
  // Country observer
  const countryObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
        const card = entry.target;
        const country = card.dataset.country;
        const distance = card.dataset.distance;
        
        if (country !== currentCountry && scrollDirection === 'down') {
          currentCountry = country;
          showArrivalNotice(country, distance);
        }
      }
    });
  }, {
    threshold: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
  });
  
  // Spacer observer with passport stamp animation
  const spacerObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.7 && scrollDirection === 'down') {
        const spacer = entry.target;
        
        // Prevent re-animating the same spacer
        if (spacer !== lastAnimatedSpacer) {
          lastAnimatedSpacer = spacer;
          
          const stamp = spacer.querySelector('.passport-stamp');
          const spacerText = spacer.querySelector('.spacer-text');
          
          if (stamp) {
            animateStamp(stamp, spacerText);
          }
        }
      }
    });
  }, {
    threshold: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
  });
  
  // Observe elements
  countryCards.forEach(card => countryObserver.observe(card));
  spacers.forEach(spacer => spacerObserver.observe(spacer));
  
  // Animate only stamp (no airplane, no line)
  function animateStamp(stamp, spacerText) {
    // Reset previous animations
    stamp.classList.remove('visible', 'appearing');
    if (spacerText) spacerText.classList.remove('visible');

    // Determine related elements that animate (cover / pages)
    const container = stamp.closest('.passport-container') || stamp.closest('.travel-spacer');
    const cover = container ? container.querySelector('.passport-cover') : null;
    const rightPage = container ? container.querySelector('.passport-inside-right') : null;
    const leftPage = container ? container.querySelector('.passport-inside-left') : null;

    // Helper: parse CSS time strings to milliseconds
    function parseTimeToMs(timeStr) {
      if (!timeStr) return 0;
      // handle comma-separated lists, take max
      return timeStr.split(',').map(s => s.trim()).map(s => {
        if (s.endsWith('ms')) return parseFloat(s);
        if (s.endsWith('s')) return parseFloat(s) * 1000;
        return parseFloat(s) || 0;
      }).reduce((a, b) => Math.max(a, b), 0);
    }

    // Helper: compute max total time (delay + duration) for animations and transitions on an element
    function getMaxElementAnimTime(el) {
      if (!el) return 0;
      const cs = window.getComputedStyle(el);
      const animDelay = parseTimeToMs(cs.animationDelay);
      const animDur = parseTimeToMs(cs.animationDuration);
      const transDelay = parseTimeToMs(cs.transitionDelay);
      const transDur = parseTimeToMs(cs.transitionDuration);
      return Math.max(animDelay + animDur, transDelay + transDur);
    }

    // Compute the longest running animation/transition among related elements
    const maxTimes = [cover, rightPage, leftPage].map(getMaxElementAnimTime);
    const longest = maxTimes.reduce((a, b) => Math.max(a, b), 0);

    // If there is a visible element animation, delay the stamp until it finishes plus a small buffer
    const buffer = 60; // ms
    const initialDelay = longest > 20 ? longest + buffer : 300;

    // Show stamp after computed delay
    setTimeout(() => {
      stamp.classList.add('visible', 'appearing');
    }, initialDelay);

    // Spacer text should appear shortly after the stamp animation completes
    const textDelay = initialDelay + 900;
    setTimeout(() => {
      if (spacerText) spacerText.classList.add('visible');
    }, textDelay);
  }
  
  /* Show arrival notice
  function showArrivalNotice(country, distance) {
    arrivalTitle.textContent = `📍 ${countryNames[country]} erreicht`;
    arrivalDistance.textContent = `Entfernung von Deutschland: ${distance} km`;
    
    arrivalNotice.classList.add('show');
    
    setTimeout(() => {
      arrivalNotice.classList.remove('show');
    }, 3000);
  }
  */
  // Mobile menu
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
      }
    });
  }
  
  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
  
  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      }
    });
  });

  // Initial animation for first spacer when page loads at travel section
  const hash = window.location.hash;
  if (hash === '#reisen') {
    setTimeout(() => {
      const firstSpacer = document.querySelector('.travel-spacer');
      if (firstSpacer) {
        const stamp = firstSpacer.querySelector('.passport-stamp');
        const spacerText = firstSpacer.querySelector('.spacer-text');
        
        if (stamp) {
          animateStamp(stamp, spacerText);
        }
      }
    }, 1000);
  }
});
// =====================
// PASSPORT ANIMATION LOGIC
// =====================

document.addEventListener('DOMContentLoaded', function() {
  // Passport Animation für jeden Spacer
  const travelSpacers = document.querySelectorAll('.travel-spacer');
  
  // Country symbols mapping
  const countrySymbols = {
    'madeira': '🌺',
    'italien': '🍕',
    'kroatien': '🏖️',
    'frankreich': '🗼',
    'usa': '🗽',
    'kanada': '🍁',
    'china': '🐉'
  };
  
  // Country names mapping
  const countryNames = {
    'madeira': 'MADEIRA',
    'italien': 'ITALIEN',
    'kroatien': 'KROATIEN',
    'frankreich': 'FRANKREICH',
    'usa': 'USA',
    'kanada': 'KANADA',
    'china': 'CHINA'
  };
  
  // Initialize passport for each spacer
  travelSpacers.forEach(spacer => {
    const country = spacer.dataset.country;
    const cover = spacer.querySelector('.passport-cover');
    const stamp = spacer.querySelector('.passport-stamp');
    const stampCountry = stamp.querySelector('.stamp-country');
    const stampSymbol = stamp.querySelector('.stamp-symbol');
    
    // Set country-specific content
    if (country && countrySymbols[country]) {
      stampCountry.textContent = countryNames[country];
      stampSymbol.textContent = countrySymbols[country];
    }
    
    // Add click event to cover
    if (cover) {
      cover.addEventListener('click', function() {
        this.classList.toggle('open');
      });
    }
  });
  
  // Observer für Passport-Animation beim Scrollen
  const passportObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
        const spacer = entry.target;
        const cover = spacer.querySelector('.passport-cover');
        
        if (cover && !cover.classList.contains('open')) {
          // Automatisch öffnen beim Scrollen
          setTimeout(() => {
            cover.classList.add('open');
          }, 500);
        }
      }
    });
  }, {
    threshold: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
  });
  
  // Observe all travel spacers
  travelSpacers.forEach(spacer => {
    passportObserver.observe(spacer);
  });
  
  // Optional: Schließen-Button für alle Passports
  const closeAllPassports = () => {
    document.querySelectorAll('.passport-cover.open').forEach(cover => {
      cover.classList.remove('open');
    });
  };
  
  // Schließen bei Klick außerhalb
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.passport-container') && 
        !event.target.closest('.passport-cover')) {
      closeAllPassports();
    }
  });
});

// =====================
// MOBILE VERTIKALE ANIMATION
// =====================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Detection
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Vertikale Animation für Mobile
        const passportCovers = document.querySelectorAll('.passport-cover');
        
        passportCovers.forEach(cover => {
            // Touch Event mit besserem Feedback
            cover.addEventListener('touchstart', function(e) {
                e.preventDefault();
                // Haptic Feedback (falls unterstützt)
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
                
                const isOpen = this.classList.contains('open');
                
                if (isOpen) {
                    // Schließen: Stempel → rechte Seite → linke Seite → Cover
                    const stamp = this.closest('.passport-container').querySelector('.passport-stamp');
                    const rightPage = this.closest('.passport-container').querySelector('.passport-inside-right');
                    const leftPage = this.closest('.passport-container').querySelector('.passport-inside-left');
                    
                    if (stamp) stamp.style.transition = 'all 0.2s ease';
                    if (rightPage) rightPage.style.transition = 'all 0.3s ease 0.1s';
                    if (leftPage) leftPage.style.transition = 'all 0.4s ease 0.2s';
                    
                    this.classList.remove('open');
                    
                    // Transitions zurücksetzen
                    setTimeout(() => {
                        if (stamp) stamp.style.transition = '';
                        if (rightPage) rightPage.style.transition = '';
                        if (leftPage) leftPage.style.transition = '';
                    }, 800);
                } else {
                    // Öffnen: Cover → linke Seite → rechte Seite → Stempel
                    this.classList.add('open');
                }
            }, { passive: false });
            
            // Fallback für Click (Tablet/Desktop)
            cover.addEventListener('click', function(e) {
                if (!isMobile) {
                    this.classList.toggle('open');
                }
            });
        });
        
        // Performance Optimierung für Mobile
        const style = document.createElement('style');
        style.textContent = `
            .passport-container * {
                will-change: transform, opacity;
                -webkit-font-smoothing: antialiased;
            }
            
            /* Smooth Scrolling für Mobile */
            .travel-spacer {
                scroll-snap-align: start;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Orientation Change Handling
    window.addEventListener('orientationchange', function() {
        // Kurze Verzögerung für korrekte Größenberechnung
        setTimeout(() => {
            // Alle Passports zurücksetzen bei Orientierungswechsel
            document.querySelectorAll('.passport-cover.open').forEach(cover => {
                cover.classList.remove('open');
            });
        }, 300);
    });
});
