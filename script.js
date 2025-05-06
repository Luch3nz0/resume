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
    
    // Initialize prize wheel
    const canvas = document.getElementById('wheel');
    const spinButton = document.getElementById('spin-button');
    
    if (canvas && spinButton) {
        const ctx = canvas.getContext('2d');
        const sections = 20;
        const colors = [
            '#2ECC71', // Hire section
            '#FF6B6B', '#FF6B6B', '#FF6B6B', '#FF6B6B', '#FF6B6B', 
            '#FF6B6B', '#FF6B6B', '#FF6B6B', '#FF6B6B', '#FF6B6B',
            '#FF6B6B', '#FF6B6B', '#FF6B6B', '#FF6B6B', '#FF6B6B',
            '#FF6B6B', '#FF6B6B', '#FF6B6B', '#FF6B6B' // Don't Hire sections
        ];
        let currentRotation = 0;

        // Confetti setup
        const confettiColors = ['#2ECC71', '#3498db', '#e74c3c', '#f1c40f', '#9b59b6', '#fd79a8'];
        const confettiCount = 150;
        let confetti = [];

        class ConfettiParticle {
            constructor() {
                this.x = canvas.width / 2;
                this.y = canvas.height / 2;
                this.angle = Math.random() * 360;
                this.speed = 3 + Math.random() * 3;
                this.radius = 5 + Math.random() * 3;
                this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                this.rotation = Math.random() * 360;
                this.rotationSpeed = -4 + Math.random() * 8;
                this.gravity = 0.4;
                this.friction = 0.98;
                this.opacity = 1;
                this.vx = Math.cos(this.angle * Math.PI / 180) * this.speed;
                this.vy = Math.sin(this.angle * Math.PI / 180) * this.speed;
            }

            update() {
                this.vy += this.gravity;
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
                this.opacity -= 0.005;
                return this.opacity > 0;
            }

            draw(ctx) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fillRect(-this.radius, -this.radius/4, this.radius*2, this.radius/2);
                ctx.restore();
            }
        }

        function createConfetti() {
            confetti = [];
            for (let i = 0; i < confettiCount; i++) {
                confetti.push(new ConfettiParticle());
            }
        }

        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawWheel();
            
            confetti = confetti.filter(particle => {
                const isAlive = particle.update();
                if (isAlive) {
                    particle.draw(ctx);
                }
                return isAlive;
            });

            if (confetti.length > 0) {
                requestAnimationFrame(animateConfetti);
            }
        }

        function drawWheel() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(centerX, centerY) - 10;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw sections
            for (let i = 0; i < sections; i++) {
                // Offset to align middle of first section with top
                const sectionAngle = (2 * Math.PI) / sections;
                const startAngle = -Math.PI / 2 - (sectionAngle / 2);
                const angle = startAngle + (i * sectionAngle);
                const nextAngle = angle + sectionAngle;
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, angle, nextAngle);
                ctx.closePath();
                
                ctx.fillStyle = colors[i];
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Add text
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(angle + sectionAngle / 2);
                ctx.textAlign = 'right';
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px Arial'; // Slightly smaller font for more sections
                const text = i === 0 ? 'Hire!' : "Don't Hire";
                ctx.fillText(text, radius - 15, 5); // Adjusted text position
                ctx.restore();
            }
            
            // Draw center circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        function spinWheel() {
            // Calculate a random number of full rotations (between 5 and 8)
            const rotations = 5 + Math.floor(Math.random() * 3);
            const targetRotation = currentRotation + (360 * rotations);
            
            canvas.style.transform = `rotate(${targetRotation}deg)`;
            currentRotation = targetRotation;

            // Trigger confetti after spin animation completes
            setTimeout(() => {
                createConfetti();
                animateConfetti();
            }, 4000); // Match this with the CSS transition duration
        }

        // Initialize wheel
        drawWheel();
        spinButton.addEventListener('click', spinWheel);
    }
    
    // Initialize skills show more/less
    const showMoreBtn = document.querySelector('.show-more-btn');
    const hiddenSkills = document.querySelectorAll('.skill-item.hidden');
    
    if (showMoreBtn && hiddenSkills.length > 0) {
        showMoreBtn.addEventListener('click', () => {
            hiddenSkills.forEach(skill => skill.classList.toggle('hidden'));
            showMoreBtn.textContent = showMoreBtn.textContent === 'Show More' ? 'Show Less' : 'Show More';
        });
    }
    
    // Print button functionality
    const printButton = document.getElementById('print-button');
    printButton.addEventListener('click', function() {
        // Store the original title and states
        const originalTitle = document.title;
        const jobDetails = document.querySelectorAll('.job-details');
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        const collapsedStates = Array.from(jobDetails).map(detail => detail.classList.contains('collapsed'));
        
        // Store skills state
        const skillsHidden = Array.from(hiddenSkills).map(skill => skill.classList.contains('hidden'));
        
        // Expand all sections and skills for PDF
        jobDetails.forEach(detail => detail.classList.remove('collapsed'));
        toggleBtns.forEach(btn => btn.classList.remove('collapsed'));
        hiddenSkills.forEach(skill => skill.classList.remove('hidden'));
        
        // Hide buttons for PDF
        printButton.style.display = 'none';
        themeToggle.style.display = 'none';
        
        // Hide prize wheel section
        const prizeWheel = document.getElementById('prize-wheel');
        if (prizeWheel) {
            prizeWheel.style.display = 'none';
        }

        // PDF options
        const opt = {
            margin: [10, 10],
            filename: 'Enzo_Calixto_Resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };

        // Generate PDF
        html2pdf().set(opt).from(document.body).save().then(() => {
            // Restore the original states after PDF generation
            document.title = originalTitle;
            
            // Restore previous collapsed states
            jobDetails.forEach((detail, index) => {
                if (collapsedStates[index]) {
                    detail.classList.add('collapsed');
                    toggleBtns[index].classList.add('collapsed');
                }
            });
            
            // Restore skills state
            hiddenSkills.forEach((skill, index) => {
                if (skillsHidden[index]) {
                    skill.classList.add('hidden');
                }
            });
            
            // Show buttons again
            printButton.style.display = 'flex';
            themeToggle.style.display = 'flex';
            
            // Show prize wheel again
            if (prizeWheel) {
                prizeWheel.style.display = 'block';
            }
        });
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
