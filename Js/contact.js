document.addEventListener('DOMContentLoaded', function() {
    // Character counter for message field
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength < 10) {
                showFieldError(this, 'Message must be at least 10 characters');
            } else {
                clearFieldError(this);
            }
        });
    }

    // Form submission handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form before submission
            const isValid = validateForm();
            if (!isValid) return;
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Get form data
            const formData = new FormData(this);
            
            // Send AJAX request
            fetch('contact.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage('success', data.message);
                    contactForm.reset();
                    if (charCount) charCount.textContent = '0';
                    
                    // Reset ratings
                    document.querySelectorAll('input[type="radio"]').forEach(radio => {
                        radio.checked = false;
                    });
                } else {
                    showMessage('error', data.message);
                    
                    // Display field errors
                    if (data.errors) {
                        Object.entries(data.errors).forEach(([field, error]) => {
                            const input = document.querySelector(`[name="${field}"]`);
                            if (input) {
                                showFieldError(input, error);
                            }
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('error', 'An error occurred. Please try again.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
    }

    // Form validation
    function validateForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showFieldError(field, 'This field is required');
            } else if (field.id === 'message' && field.value.length < 10) {
                isValid = false;
                showFieldError(field, 'Message must be at least 10 characters');
            }
        });

        return isValid;
    }

    // Show field error
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group') || field.closest('.form-select');
        if (!formGroup) return;
        
        formGroup.classList.add('error');
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('small');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    // Clear field error
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group') || field.closest('.form-select');
        if (formGroup) {
            formGroup.classList.remove('error');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) errorElement.remove();
        }
    }

    // Show message (success or error)
    function showMessage(type, message) {
        // Remove any existing messages
        const existingMsg = document.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Insert message
        const formHeader = document.querySelector('.form-header');
        if (formHeader) {
            formHeader.appendChild(messageDiv);
        } else {
            contactForm.prepend(messageDiv);
        }
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Remove error state when user starts typing
    document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select').forEach(input => {
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    // FAQ toggle functionality
    function toggleFAQ(button) {
        const faqItem = button.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        faqItem.classList.toggle('active');
        answer.style.maxHeight = faqItem.classList.contains('active') ? answer.scrollHeight + 'px' : '0';
        const icon = button.querySelector('i');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
    }
    
    // Initialize FAQ items
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
});