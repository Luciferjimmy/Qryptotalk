document.addEventListener('DOMContentLoaded', function() {
    // Toggle Eve's interception
    const toggleEveButton = document.querySelector('.toggle-eve');
    if (toggleEveButton) {
        toggleEveButton.addEventListener('click', function() {
            const eveIntercept = document.querySelector('.eve-intercept');
            const eveWarning = document.querySelector('.eve-warning');
            
            eveIntercept.classList.toggle('hidden');
            eveWarning.classList.toggle('hidden');
            
            if (eveIntercept.classList.contains('hidden')) {
                this.textContent = "Show Eve's Interception";
            } else {
                this.textContent = "Hide Eve's Interception";
            }
        });
    }

    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqCard = question.parentElement;
            faqCard.classList.toggle('active');
            
            // Close other open FAQs
            faqQuestions.forEach(q => {
                if (q !== question && q.parentElement.classList.contains('active')) {
                    q.parentElement.classList.remove('active');
                }
            });
        });
    });

    // Animate quantum particles on scroll
    const animateOnScroll = () => {
        const particles = document.querySelectorAll('.quantum-particle');
        particles.forEach((particle, index) => {
            const rect = particle.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isVisible) {
                particle.style.animationPlayState = 'running';
            } else {
                particle.style.animationPlayState = 'paused';
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            header.style.padding = '15px 0';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.padding = '20px 0';
        }
    });
});
