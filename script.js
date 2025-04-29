document.addEventListener('DOMContentLoaded', function() {
    // Initialize intro text toggle for mobile
    const introToggle = document.querySelector('.intro-container .toggle-btn');
    const introText = document.querySelector('.intro-text');
    
    if (introToggle && introText) {
        // Initially collapse the intro text on mobile
        if (window.innerWidth <= 600) {
            introToggle.classList.add('collapsed');
        }
        
        introToggle.addEventListener('click', () => {
            introText.classList.toggle('expanded');
            introToggle.classList.toggle('collapsed');
        });
    }
    
    // Print button functionality
    const printButton = document.getElementById('print-button');
    printButton.addEventListener('click', function() {
        // Store the original title
        const originalTitle = document.title;
        
        // Store collapsed state of all sections
        const jobDetails = document.querySelectorAll('.job-details');
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        const collapsedStates = Array.from(jobDetails).map(detail => detail.classList.contains('collapsed'));
        
        // Expand all sections for printing
        jobDetails.forEach(detail => detail.classList.remove('collapsed'));
        toggleBtns.forEach(btn => btn.classList.remove('collapsed'));
        
        // Set an empty title before printing to hide it
        document.title = "";
        
        // Print the page
        window.print();
        
        // Restore the original states after printing
        setTimeout(function() {
            document.title = originalTitle;
            
            // Restore previous collapsed states
            jobDetails.forEach((detail, index) => {
                if (collapsedStates[index]) {
                    detail.classList.add('collapsed');
                    toggleBtns[index].classList.add('collapsed');
                }
            });
        }, 100);
    });
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved user preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️ Light Mode';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Update button text based on current theme
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️ Light Mode';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙 Dark Mode';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Add smooth animations for section transitions
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
    
    // Add date last updated to footer
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Create footer dynamically
    const footer = document.createElement('footer');
    footer.style.textAlign = 'center';
    footer.style.padding = '20px';
    footer.style.marginTop = '30px';
    footer.style.fontSize = '0.9rem';
    footer.style.color = '#7f8c8d';
    footer.textContent = `Last updated: ${formattedDate}`;
    
    document.body.appendChild(footer);
    
    // Adjust button size based on screen width
    function adjustButtonSize() {
        const isMobile = window.innerWidth <= 600;
        const buttons = document.querySelectorAll('.print-button, .theme-toggle');
        
        buttons.forEach(button => {
            if (isMobile) {
                // Use smaller emoji for mobile
                button.style.fontSize = '0.8rem';
                button.style.padding = '6px 10px';
            } else {
                // Reset to default for larger screens
                button.style.fontSize = '1rem';
                button.style.padding = '10px 15px';
            }
        });
    }
    
    // Run on page load
    adjustButtonSize();
    
    // Run when window is resized
    window.addEventListener('resize', adjustButtonSize);
    
    // Initialize job section toggles
    const jobHeaders = document.querySelectorAll('.job-header');
    
    jobHeaders.forEach(header => {
        const details = header.nextElementSibling;
        const toggleBtn = header.querySelector('.toggle-btn');
        
        // Initially collapse all jobs
        details.classList.add('collapsed');
        toggleBtn.classList.add('collapsed');
        
        header.addEventListener('click', () => {
            details.classList.toggle('collapsed');
            toggleBtn.classList.toggle('collapsed');
        });
    });
});