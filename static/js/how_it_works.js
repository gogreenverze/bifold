/**
 * How It Works Page - Scroll Functionality
 *
 * This script handles the scrolling behavior for the "How It Works" page,
 * updating the active app screen in the fixed phone mockup based on scroll position.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all step content sections
    const stepContents = document.querySelectorAll('.app-step-content');

    // Get all app screens
    const appScreens = document.querySelectorAll('.app-screen');

    // Get navigation dots if they exist
    const navDots = document.querySelectorAll('.nav-dot');

    // Function to update active screen based on scroll position
    function updateActiveScreen() {
        // Get current scroll position
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        // Check which step content is currently in view
        stepContents.forEach((content, index) => {
            const rect = content.getBoundingClientRect();
            const contentTop = rect.top;
            const contentHeight = rect.height;

            // Calculate how much of the content is visible in the viewport
            // We consider an element "in view" when it's at least 30% visible
            const visiblePortion = Math.min(windowHeight, contentTop + contentHeight) - Math.max(0, contentTop);
            const visibilityRatio = visiblePortion / contentHeight;

            // If enough of the content is in view (30% or more)
            if (visibilityRatio > 0.3 && contentTop < windowHeight * 0.7) {
                // Update active app screen
                appScreens.forEach(screen => screen.classList.remove('active'));
                if (appScreens[index]) {
                    appScreens[index].classList.add('active');
                }

                // Update active navigation dot
                if (navDots.length > 0) {
                    navDots.forEach(dot => dot.classList.remove('active'));
                    if (navDots[index]) {
                        navDots[index].classList.add('active');
                    }
                }

                // Add active class to current step content
                stepContents.forEach(step => step.classList.remove('active'));
                content.classList.add('active');
            }
        });
    }

    // Add click event listeners to navigation dots
    if (navDots.length > 0) {
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                // Scroll to the corresponding step content
                if (stepContents[index]) {
                    // Get the navbar height to adjust scroll position
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;

                    window.scrollTo({
                        top: stepContents[index].offsetTop - (navbarHeight + 20),
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Run once on page load
    setTimeout(updateActiveScreen, 300);

    // Run on scroll
    window.addEventListener('scroll', updateActiveScreen);

    // Add smooth scrolling for step links
    document.querySelectorAll('a[href^="#step"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Get the navbar height to adjust scroll position
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;

                window.scrollTo({
                    top: targetElement.offsetTop - (navbarHeight + 20),
                    behavior: 'smooth'
                });
            }
        });
    });
});
