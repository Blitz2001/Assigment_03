
document.addEventListener('DOMContentLoaded', function() {
    // Message character count
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            // Validate minimum length
            if (currentLength < 10) {
                this.classList.add('error');
                const errorMsg = this.nextElementSibling.querySelector('.error-message') || 
                                document.createElement('small');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Message must be at least 10 characters';
                if (!this.nextElementSibling.querySelector('.error-message')) {
                    this.nextElementSibling.appendChild(errorMsg);
                }
            } else {
                this.classList.remove('error');
                const errorMsg = this.nextElementSibling.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    }

    // Form submission handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate message length
            const message = messageTextarea.value;
            if (message.length < 10) {
                showError(messageTextarea, 'Message must be at least 10 characters');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Collect form data
            const formData = new FormData(this);
            
            // Send AJAX request
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    showSuccessMessage('Message sent successfully!');
                    // Reset form
                    this.reset();
                    // Reset character count
                    if (charCount) charCount.textContent = '0';
                } else {
                    // Show error message
                    if (data.message) {
                        showError(null, data.message);
                    }
                    // Show field errors
                    if (data.errors) {
                        for (const [field, error] of Object.entries(data.errors)) {
                            const input = document.querySelector(`[name="${field}"]`);
                            if (input) {
                                showError(input, error);
                            }
                        }
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError(null, 'An error occurred. Please try again.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            });
        });
    }

    // Star rating interaction
    const starRating = document.getElementById('experience-rating');
    if (starRating) {
        const stars = starRating.querySelectorAll('input[type="radio"]');
        const ratingText = document.getElementById('rating-text');
        
        stars.forEach(star => {
            star.addEventListener('change', function() {
                const rating = this.value;
                const ratings = {
                    '1': 'Poor',
                    '2': 'Fair',
                    '3': 'Good',
                    '4': 'Very Good',
                    '5': 'Excellent'
                };
                ratingText.textContent = `You rated: ${ratings[rating]}`;
            });
        });
    }

    // Helper function to show error messages
    function showError(input, message) {
        if (input) {
            const formGroup = input.closest('.form-group') || input.closest('.form-select');
            if (formGroup) {
                formGroup.classList.add('error');
                
                let errorElement = formGroup.querySelector('.error-message');
                if (!errorElement) {
                    errorElement = document.createElement('small');
                    errorElement.className = 'error-message';
                    formGroup.appendChild(errorElement);
                }
                errorElement.textContent = message;
            }
        } else {
            // Show general error message
            alert(message);
        }
    }

    // Helper function to show success message
    function showSuccessMessage(message) {
        // Create success modal if it doesn't exist
        let successModal = document.getElementById('success-modal');
        if (!successModal) {
            successModal = document.createElement('div');
            successModal.id = 'success-modal';
            successModal.className = 'modal';
            successModal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Success!</h3>
                        <button class="modal-close" aria-label="Close modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="success-content">
                            <div class="success-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <p>${message}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary modal-ok">OK</button>
                    </div>
                </div>
            `;
            document.body.appendChild(successModal);
            
            // Add event listeners for closing the modal
            successModal.querySelectorAll('.modal-close, .modal-ok, .modal-backdrop').forEach(el => {
                el.addEventListener('click', function() {
                    successModal.style.display = 'none';
                });
            });
        }
        
        // Update message and show modal
        successModal.querySelector('.modal-body p').textContent = message;
        successModal.style.display = 'flex';
    }

    // FAQ toggle functionality
    function toggleFAQ(button) {
        const faqItem = button.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        
        // Toggle the active class
        faqItem.classList.toggle('active');
        
        // Toggle the answer visibility
        if (faqItem.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            button.querySelector('i').className = 'fas fa-chevron-up';
        } else {
            answer.style.maxHeight = '0';
            button.querySelector('i').className = 'fas fa-chevron-down';
        }
    }
    
    // Initialize FAQ items
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
});