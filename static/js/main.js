// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const mobileThemeIcon = mobileThemeToggle.querySelector('i');

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to update theme icons
    const updateThemeIcons = (theme) => {
        if (theme === 'dark') {
            // Remove sun icon and add moon icon
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            mobileThemeIcon.classList.remove('fa-sun');
            mobileThemeIcon.classList.add('fa-moon');
        } else {
            // Remove moon icon and add sun icon
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            mobileThemeIcon.classList.remove('fa-moon');
            mobileThemeIcon.classList.add('fa-sun');
        }
    };

    // Function to toggle theme
    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Set the new theme immediately without transitions
        document.documentElement.setAttribute('data-theme', newTheme);

        // Update icons
        updateThemeIcons(newTheme);

        // Save theme preference
        localStorage.setItem('theme', newTheme);
    };

    // Set initial theme based on saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcons('dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcons('light');
    }

    // Toggle theme when desktop button is clicked
    themeToggle.addEventListener('click', toggleTheme);

    // Toggle theme when mobile button is clicked
    mobileThemeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
    });

    // Initialize animations for elements that are visible on page load
    const initialAnimElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
    initialAnimElements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    });

    // Add scroll animation functionality
    const animateOnScroll = function() {
        const scrollElements = document.querySelectorAll('.ai-feature, .feature-card, .product-card');

        scrollElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            // If element is in viewport
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate__animated');

                // Add different animation classes based on element type
                if (element.classList.contains('ai-feature')) {
                    element.classList.add('slide-in-right');
                } else if (element.classList.contains('feature-card')) {
                    element.classList.add('fade-in');
                } else if (element.classList.contains('product-card')) {
                    element.classList.add('zoom-in');
                }
            }
        });
    };

    // Run once on page load
    animateOnScroll();

    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation for contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // Simple validation
            if (!nameInput.value.trim()) {
                isValid = false;
                showError(nameInput, 'Please enter your name');
            } else {
                removeError(nameInput);
            }

            if (!emailInput.value.trim()) {
                isValid = false;
                showError(emailInput, 'Please enter your email');
            } else if (!isValidEmail(emailInput.value)) {
                isValid = false;
                showError(emailInput, 'Please enter a valid email');
            } else {
                removeError(emailInput);
            }

            if (!messageInput.value.trim()) {
                isValid = false;
                showError(messageInput, 'Please enter your message');
            } else {
                removeError(messageInput);
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // Helper function to validate email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Helper function to show error message
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        input.classList.add('is-invalid');

        if (errorElement) {
            errorElement.textContent = message;
        } else {
            const error = document.createElement('div');
            error.className = 'error-message text-danger mt-1';
            error.textContent = message;
            formGroup.appendChild(error);
        }
    }

    // Helper function to remove error message
    function removeError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        input.classList.remove('is-invalid');

        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    // Add active class to current page in mobile navigation
    const currentPath = window.location.pathname;
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    mobileNavLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Store theme in sessionStorage for immediate access on the next page
    function initPageNavigation() {
        // Get all navigation links (both desktop and mobile)
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .mobile-nav a');

        // Add click event listener to each navigation link
        navLinks.forEach(link => {
            // Skip anchor links (they're handled by the smooth scroll functionality)
            if (link.getAttribute('href').startsWith('#')) return;

            link.addEventListener('click', function(e) {
                // Only handle links to pages within our site
                const href = this.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('mailto:')) {
                    // Get current theme before navigation
                    const currentTheme = document.documentElement.getAttribute('data-theme');

                    // Store the current theme in sessionStorage for immediate access on the next page
                    if (currentTheme) {
                        sessionStorage.setItem('activeTheme', currentTheme);
                    }
                    // Let the default navigation happen normally
                }
            });
        });
    }

    // Initialize page navigation
    initPageNavigation();
});
