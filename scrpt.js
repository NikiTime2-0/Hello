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
    
    // Start animations with delays
    setTimeout(() => {
      stamp.classList.add('visible', 'appearing');
    }, 300);
    
    setTimeout(() => {
      if (spacerText) spacerText.classList.add('visible');
    }, 1200);
  }
  
  // Show arrival notice
  function showArrivalNotice(country, distance) {
    arrivalTitle.textContent = `📍 ${countryNames[country]} erreicht`;
    arrivalDistance.textContent = `Entfernung von Deutschland: ${distance} km`;
    
    arrivalNotice.classList.add('show');
    
    setTimeout(() => {
      arrivalNotice.classList.remove('show');
    }, 3000);
  }
  
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
