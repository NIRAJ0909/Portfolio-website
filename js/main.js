// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference or use system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark-theme' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark-theme');
        updateThemeIcon(true);
    } else {
        body.classList.remove('dark-theme');
        updateThemeIcon(false);
    }
}

// Initialize theme on page load
initializeTheme();

// Toggle theme
themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark-theme' : '');
    updateThemeIcon(isDark);
});

// Update theme icon
function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i') || document.createElement('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    if (!themeToggle.contains(icon)) {
        themeToggle.appendChild(icon);
    }
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {  // Only auto-switch if user hasn't set a preference
        const isDark = e.matches;
        body.classList.toggle('dark-theme', isDark);
        updateThemeIcon(isDark);
    }
});

// Form handling
document.getElementById('contact-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitButton = form.querySelector('.send-btn');
    const originalButtonText = submitButton.textContent;
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        if (!formData.name || !formData.email || !formData.message) {
            throw new Error('Please fill in all fields');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            throw new Error('Please enter a valid email address');
        }

        const response = await fetch('http://127.0.0.1:3000/api/contact', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Failed to send message');
        }

        form.reset();
        showMessage('Message sent successfully!', 'success');

    } catch (error) {
        showMessage(error.message || 'Error sending message', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

// Message display function
function showMessage(message, type = 'success') {
    const existingMsg = document.querySelector('.message');
    if (existingMsg) {
        existingMsg.remove();
    }

    const messageContainer = document.createElement('div');
    messageContainer.className = `message ${type}`;
    messageContainer.textContent = message;
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '20px';
    messageContainer.style.right = '20px';
    messageContainer.style.padding = '1rem 2rem';
    messageContainer.style.borderRadius = '4px';
    messageContainer.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    messageContainer.style.color = 'white';
    messageContainer.style.zIndex = '1000';
    messageContainer.style.transition = 'all 0.3s ease';
    messageContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    messageContainer.style.opacity = '0';

    document.body.appendChild(messageContainer);

    // Trigger animation
    setTimeout(() => {
        messageContainer.style.opacity = '1';
    }, 10);

    // Remove the message after 3 seconds
    setTimeout(() => {
        messageContainer.style.opacity = '0';
        setTimeout(() => {
            messageContainer.remove();
        }, 300);
    }, 3000);
}

// Enhanced scroll to contact function
function scrollToContact(e) {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        // Calculate position accounting for navbar height
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = contactSection.offsetTop - navbarHeight;
        
        // Smooth scroll with fallback
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback for older browsers
            const scrollStep = -window.scrollY / (500 / 15);
            const scrollInterval = setInterval(() => {
                if (window.scrollY <= targetPosition) {
                    clearInterval(scrollInterval);
                } else {
                    window.scrollBy(0, scrollStep);
                }
            }, 15);
        }

        // Add highlight effect
        contactSection.classList.add('highlight');
        setTimeout(() => {
            contactSection.classList.remove('highlight');
        }, 2000);
        
        // Update URL hash
        history.pushState(null, null, '#contact');
    }
}

// Initialize event listeners after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up button event listeners
    document.querySelectorAll('.pricing-btn, .quote-btn').forEach(button => {
        button.addEventListener('click', scrollToContact);
    });
    
    // Handle initial hash if present
    if (window.location.hash === '#contact') {
        setTimeout(() => {
            scrollToContact({ preventDefault: () => {} });
        }, 100);
    }
});
// Robust scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Calculate position accounting for navbar height
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset;
    const targetPosition = sectionPosition - navbarHeight;

    // Modern smooth scrolling with fallback
    try {
        window.scroll({
            top: targetPosition,
            behavior: 'smooth'
        });
    } catch (e) {
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, targetPosition);
    }

    // Add highlight effect
    section.classList.add('highlight');
    setTimeout(() => {
        section.classList.remove('highlight');
    }, 2000);
}

// Initialize everything after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up click handlers for all scroll buttons
    document.querySelectorAll('[data-scroll-to]').forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-scroll-to');
            scrollToSection(targetSection);
        });
    });

    // Handle hash links on page load
    if (window.location.hash) {
        const targetSection = window.location.hash.substring(1);
        setTimeout(() => {
            scrollToSection(targetSection);
        }, 100);
    }
});

// Gallery Functions
function openGallery(galleryId) {
  // First hide all galleries
  const galleries = document.querySelectorAll('.project-gallery');
  galleries.forEach(gallery => {
    gallery.style.display = 'none';
  });
  
  // Then show the requested gallery
  const galleryToShow = document.getElementById(galleryId);
  if (galleryToShow) {
    galleryToShow.style.display = 'block';
  }
  
  // Finally show the modal
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeGallery() {
  const modal = document.getElementById('gallery-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Close when clicking outside content
window.addEventListener('click', function(event) {
  const modal = document.getElementById('gallery-modal');
  if (event.target === modal) {
    closeGallery();
  }
});

// Close with ESC key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeGallery();
  }
});
// JavaScript Functionality
document.querySelectorAll('.view-details').forEach(button => {
    button.addEventListener('click', function() {
      this.nextElementSibling.classList.toggle('hidden');
    });
  });
  
  document.querySelectorAll('.thumbnail').forEach(img => {
    img.addEventListener('click', function() {
      const modal = document.querySelector('.image-modal');
      const modalImg = document.getElementById('expanded-image');
      
      modal.classList.remove('hidden');
      modalImg.src = this.src;
    });
  });
  
  document.querySelector('.close-modal').addEventListener('click', function() {
    document.querySelector('.image-modal').classList.add('hidden');
  });