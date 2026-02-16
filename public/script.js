// Contact Form Handler
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('.submit-button');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');
    const messageEl = form.querySelector('.form-message');
    
    // Get form data
    const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        company: form.company.value.trim(),
        position: form.position.value.trim(),
        message: form.message.value.trim()
    };
    
    // Validate
    if (!formData.name || !formData.email || !formData.company || !formData.position || !formData.message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'inline';
    messageEl.style.display = 'none';
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(data.message || 'Thank you! We\'ll be in touch within 24 hours.', 'success');
            form.reset();
        } else {
            showMessage(data.error || 'Something went wrong. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Unable to send message. Please email us directly at info@linearmarketingsolutions.com', 'error');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoader.style.display = 'none';
    }
    
    function showMessage(text, type) {
        messageEl.textContent = text;
        messageEl.className = `form-message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
