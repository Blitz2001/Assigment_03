// ===== CONTACT PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact page functionality
    initializeContactPage();
});

function initializeContactPage() {
    // Initialize form functionality
    initializeContactForm();

    // Initialize rating systems
    initializeRatingSystem();

    // Initialize character counting
    initializeCharacterCount();

    // Initialize FAQ functionality
    initializeFAQ();

    // Initialize form auto-fill if user is logged in
    initializeAutoFill();

    // Initialize success modal
    initializeSuccessModal();
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateContactForm(this)) {
                submitContactForm(this);
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateContactField(this);
            });

            input.addEventListener('input', function() {
                clearContactFieldError(this);

                // Real-time validation for email
                if (this.type === 'email') {
                    setTimeout(() => validateContactField(this), 500);
                }
            });
        });
    }
}

function validateContactForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');

    requiredFields.forEach(field => {
        if (!validateContactField(field)) {
            isValid = false;
        }
    });

    // Additional validations
    if (!validateMessageLength()) {
        isValid = false;
    }

    return isValid;
}

function validateContactField(field) {
    const value = field.value.trim();
    const fieldType = field.type;

    // Clear previous errors
    clearContactFieldError(field);

    // Check required fields
    if (field.hasAttribute('required') && !value) {
        showContactFieldError(field, `${getContactFieldLabel(field)} is required.`);
        return false;
    }

    // Skip validation if field is empty and not required
    if (!value && !field.hasAttribute('required')) {
        return true;
    }

    // Email validation
    if (fieldType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showContactFieldError(field, 'Please enter a valid email address.');
            return false;
        }
    }

    // Message length validation
    if (field.name === 'message') {
        if (value.length < 10) {
            showContactFieldError(field, 'Message must be at least 10 characters long.');
            return false;
        }
        if (value.length > 1000) {
            showContactFieldError(field, 'Message cannot exceed 1000 characters.');
            return false;
        }
    }

    // Name validation
    if (field.name === 'first_name' || field.name === 'last_name') {
        if (value.length < 2) {
            showContactFieldError(field, 'Name must be at least 2 characters long.');
            return false;
        }
        if (!/^[a-zA-Z\s'-]+$/.test(value)) {
            showContactFieldError(field, 'Name can only contain letters, spaces, hyphens, and apostrophes.');
            return false;
        }
    }

    // Show success state
    showContactFieldSuccess(field);
    return true;
}

function validateMessageLength() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const currentLength = parseInt(charCount.textContent);

    if (currentLength < 10 && messageField.value.trim()) {
        showContactFieldError(messageField, 'Message must be at least 10 characters long.');
        return false;
    }

    return true;
}

function showContactFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    // Remove existing feedback
    const existingFeedback = formGroup.querySelectorAll('.form-error, .form-success');
    existingFeedback.forEach(el => el.remove());

    // Add error message
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);

    // Add error styling
    field.classList.remove('valid');
    field.classList.add('invalid');
}

function showContactFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    // Remove existing feedback
    const existingFeedback = formGroup.querySelectorAll('.form-error, .form-success');
    existingFeedback.forEach(el => el.remove());

    // Add success styling
    field.classList.remove('invalid');
    field.classList.add('valid');
}

function clearContactFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    const feedback = formGroup.querySelectorAll('.form-error, .form-success');
    feedback.forEach(el => el.remove());

    field.classList.remove('valid', 'invalid');
}

function getContactFieldLabel(field) {
    const label = field.closest('.form-group')?.querySelector('.form-label');
    if (label) {
        return label.textContent.replace(/\*/g, '').replace(/\s*$/, '').split('\n')[1]?.trim() ||
               label.textContent.replace(/\*/g, '').trim();
    }
    return field.name || 'Field';
}

function submitContactForm(form) {
    const formData = new FormData(form);
    const contactData = {};

    // Collect form data
    for (let [key, value] of formData.entries()) {
        contactData[key] = value;
    }

    // Add rating data
    const experienceRating = document.querySelector('input[name="experience_rating"]:checked');
    const recommendationRating = document.querySelector('input[name="recommendation"]:checked');

    contactData.experience_rating = experienceRating ? experienceRating.value : null;
    contactData.recommendation = recommendationRating ? recommendationRating.value : null;
    contactData.timestamp = new Date().toISOString();

    // Show loading state
    showLoadingState(form);

    // Simulate form submission (replace with actual PHP endpoint)
    setTimeout(() => {
        hideLoadingState(form);

        // Save to local storage for demo purposes
        saveContactSubmission(contactData);

        // Show success
        showSuccessModal();

        // Reset form
        form.reset();
        resetRatings();
        updateCharacterCount();
    }, 2000);

    // In real implementation:
    /*
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState(form);
        if (data.success) {
            showSuccessModal();
            form.reset();
            resetRatings();
            updateCharacterCount();
        } else {
            showNotification(data.message || 'Failed to send message. Please try again.', 'error');
        }
    })
    .catch(error => {
        hideLoadingState(form);
        showNotification('Network error. Please check your connection and try again.', 'error');
    });
    */
}

function saveContactSubmission(data) {
    const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    submissions.push(data);
    localStorage.setItem('contact_submissions', JSON.stringify(submissions));
}

function showLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }
}

function hideLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
}

// ===== RATING SYSTEM =====
function initializeRatingSystem() {
    // Initialize star rating
    initializeStarRating();

    // Initialize recommendation rating
    initializeRecommendationRating();
}

function initializeStarRating() {
    const starRating = document.getElementById('experience-rating');
    const ratingText = document.getElementById('rating-text');

    if (starRating && ratingText) {
        const stars = starRating.querySelectorAll('input[type="radio"]');

        stars.forEach(star => {
            star.addEventListener('change', function() {
                updateStarRatingText(this.value);
            });
        });

        // Add hover effects
        const starLabels = starRating.querySelectorAll('label');
        starLabels.forEach((label, index) => {
            label.addEventListener('mouseenter', function() {
                const rating = 5 - index;
                highlightStars(rating);
                showTemporaryRatingText(rating);
            });
        });

        starRating.addEventListener('mouseleave', function() {
            const checkedStar = starRating.querySelector('input[type="radio"]:checked');
            if (checkedStar) {
                highlightStars(checkedStar.value);
                updateStarRatingText(checkedStar.value);
            } else {
                clearStarHighlight();
                ratingText.textContent = 'Click to rate your experience';
            }
        });
    }
}

function updateStarRatingText(rating) {
    const ratingText = document.getElementById('rating-text');
    const ratingTexts = {
        '1': 'Very Poor - Extremely dissatisfied',
        '2': 'Poor - Dissatisfied',
        '3': 'Fair - Neutral',
        '4': 'Good - Satisfied',
        '5': 'Excellent - Very satisfied'
    };

    if (ratingText) {
        ratingText.textContent = ratingTexts[rating] || 'Click to rate your experience';
    }
}

function showTemporaryRatingText(rating) {
    const ratingText = document.getElementById('rating-text');
    const ratingTexts = {
        '1': 'Very Poor',
        '2': 'Poor',
        '3': 'Fair',
        '4': 'Good',
        '5': 'Excellent'
    };

    if (ratingText) {
        ratingText.textContent = ratingTexts[rating] || '';
    }
}

function highlightStars(rating) {
    const starRating = document.getElementById('experience-rating');
    const labels = starRating.querySelectorAll('label');

    labels.forEach((label, index) => {
        const starValue = 5 - index;
        if (starValue <= rating) {
            label.style.color = '#fbbf24';
        } else {
            label.style.color = '#d1d5db';
        }
    });
}

function clearStarHighlight() {
    const starRating = document.getElementById('experience-rating');
    const labels = starRating.querySelectorAll('label');

    labels.forEach(label => {
        label.style.color = '#d1d5db';
    });
}

function initializeRecommendationRating() {
    const recommendationInputs = document.querySelectorAll('input[name="recommendation"]');

    recommendationInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateRecommendationDisplay(this.value);
        });
    });
}

function updateRecommendationDisplay(rating) {
    const value = parseInt(rating);
    let category = '';

    if (value <= 3) {
        category = 'Detractor';
    } else if (value <= 6) {
        category = 'Passive';
    } else {
        category = 'Promoter';
    }

    // You could show this feedback to the user
    console.log(`Rating: ${value}/10 - Category: ${category}`);
}

function resetRatings() {
    // Reset star rating
    const starInputs = document.querySelectorAll('input[name="experience_rating"]');
    starInputs.forEach(input => input.checked = false);
    clearStarHighlight();
    document.getElementById('rating-text').textContent = 'Click to rate your experience';

    // Reset recommendation rating
    const recInputs = document.querySelectorAll('input[name="recommendation"]');
    recInputs.forEach(input => input.checked = false);
}

// ===== CHARACTER COUNT =====
function initializeCharacterCount() {
    const messageField = document.getElementById('message');
    const charCountElement = document.getElementById('char-count');

    if (messageField && charCountElement) {
        messageField.addEventListener('input', updateCharacterCount);

        // Initial count
        updateCharacterCount();
    }
}

function updateCharacterCount() {
    const messageField = document.getElementById('message');
    const charCountElement = document.getElementById('char-count');
    const charCountContainer = document.querySelector('.character-count');

    if (messageField && charCountElement) {
        const currentLength = messageField.value.length;
        charCountElement.textContent = currentLength;

        // Update styling based on length
        charCountContainer.classList.remove('warning', 'error');

        if (currentLength > 900) {
            charCountContainer.classList.add('error');
        } else if (currentLength > 800) {
            charCountContainer.classList.add('warning');
        }

        // Prevent typing if limit exceeded
        if (currentLength >= 1000) {
            messageField.value = messageField.value.substring(0, 1000);
            charCountElement.textContent = '1000';
        }
    }
}

// ===== FAQ FUNCTIONALITY =====
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
}

function toggleFAQ(questionButton) {
    const faqItem = questionButton.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ===== AUTO-FILL FUNCTIONALITY =====
function initializeAutoFill() {
    // Check if user is logged in and has profile data
    const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
    const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');

    if (isLoggedIn && Object.keys(profileData).length > 0) {
        // Pre-fill form with user data
        const firstNameField = document.getElementById('first_name');
        const lastNameField = document.getElementById('last_name');
        const emailField = document.getElementById('email');

        if (firstNameField && profileData.firstName) {
            firstNameField.value = profileData.firstName;
        }

        if (lastNameField && profileData.lastName) {
            lastNameField.value = profileData.lastName;
        }

        if (emailField && profileData.email) {
            emailField.value = profileData.email;
        }

        // Show notification
        showNotification('Form pre-filled with your profile information', 'info', 3000);
    }
}

// ===== SUCCESS MODAL =====
function initializeSuccessModal() {
    const successModal = document.getElementById('success-modal');

    if (successModal) {
        const closeButtons = successModal.querySelectorAll('.modal-close, .modal-ok, .modal-backdrop');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                hideSuccessModal();
            });
        });
    }
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
}

function hideSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// ===== UTILITY FUNCTIONS =====
function getFormData() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    return data;
}

function getContactSubmissions() {
    return JSON.parse(localStorage.getItem('contact_submissions') || '[]');
}

function clearContactSubmissions() {
    localStorage.removeItem('contact_submissions');
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.getElementById('contact-form');
        if (form && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    }

    // Escape to close modals
    if (e.key === 'Escape') {
        hideSuccessModal();
    }
});

// ===== EXPORT FUNCTIONS =====
window.toggleFAQ = toggleFAQ;
window.showSuccessModal = showSuccessModal;
window.hideSuccessModal = hideSuccessModal;

// ===== ANALYTICS =====
function trackFormInteraction(action, field) {
    // This would track user interactions for analytics
    console.log(`Contact form interaction: ${action} on ${field}`);
}

// Add interaction tracking
document.addEventListener('focus', function(e) {
    if (e.target.closest('#contact-form')) {
        trackFormInteraction('focus', e.target.name || e.target.id);
    }
}, true);

document.addEventListener('change', function(e) {
    if (e.target.closest('#contact-form')) {
        trackFormInteraction('change', e.target.name || e.target.id);
    }
});
