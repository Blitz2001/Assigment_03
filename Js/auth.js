// ===== AUTHENTICATION JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication functionality
    initializeAuth();
});

function initializeAuth() {
    // Initialize password toggle functionality
    initializePasswordToggle();

    // Initialize form validation
    initializeAuthFormValidation();

    // Initialize social auth buttons
    initializeSocialAuth();

    // Initialize phone number formatting
    initializePhoneFormatting();

    // Initialize form auto-save (for better UX)
    initializeFormAutoSave();

    // Initialize form animations
    initializeFormAnimations();
}

// ===== PASSWORD TOGGLE =====
function initializePasswordToggle() {
    const passwordContainers = document.querySelectorAll('.password-input-container');

    passwordContainers.forEach(container => {
        const input = container.querySelector('input[type="password"], input[type="text"]');
        const toggleBtn = container.querySelector('.password-toggle-btn');

        if (input && toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                togglePasswordVisibility(input, this);
            });
        }
    });
}

function togglePasswordVisibility(input, button) {
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
        button.setAttribute('aria-label', 'Hide password');
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
        button.setAttribute('aria-label', 'Show password');
    }
}

// ===== ENHANCED FORM VALIDATION =====
function initializeAuthFormValidation() {
    const forms = document.querySelectorAll('.auth-form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateAuthForm(this)) {
                submitAuthForm(this);
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateAuthField(this);
            });

            input.addEventListener('input', function() {
                clearAuthFieldError(this);
                // Real-time validation for some fields
                if (this.type === 'email' || this.type === 'password' || this.name === 'confirm_password') {
                    setTimeout(() => validateAuthField(this), 500);
                }
            });
        });

        // Password confirmation real-time validation
        const confirmPassword = form.querySelector('input[name="confirm_password"]');
        const password = form.querySelector('input[name="password"]');

        if (confirmPassword && password) {
            confirmPassword.addEventListener('input', function() {
                validatePasswordMatch(password, this);
            });

            password.addEventListener('input', function() {
                if (confirmPassword.value) {
                    validatePasswordMatch(this, confirmPassword);
                }
            });
        }
    });
}

function validateAuthForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required]');

    inputs.forEach(input => {
        if (!validateAuthField(input)) {
            isValid = false;
        }
    });

    // Additional form-specific validations
    if (form.id === 'register-form') {
        if (!validateRegistrationSpecific(form)) {
            isValid = false;
        }
    }

    return isValid;
}

function validateAuthField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;

    // Clear previous validation states
    clearAuthFieldError(field);

    // Check required fields
    if (field.hasAttribute('required') && !value) {
        showAuthFieldError(field, `${getFieldDisplayName(field)} is required.`);
        return false;
    }

    // Skip validation if field is empty and not required
    if (!value && !field.hasAttribute('required')) {
        return true;
    }

    // Email validation
    if (fieldType === 'email') {
        if (!validateEmail(value)) {
            showAuthFieldError(field, 'Please enter a valid email address.');
            return false;
        }
    }

    // Password validation
    if (fieldType === 'password' && fieldName === 'password') {
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
            showAuthFieldError(field, passwordValidation.message);
            return false;
        }
    }

    // Confirm password validation
    if (fieldName === 'confirm_password') {
        const passwordField = field.form.querySelector('input[name="password"]');
        if (passwordField && value !== passwordField.value) {
            showAuthFieldError(field, 'Passwords do not match.');
            return false;
        }
    }

    // Student ID validation
    if (fieldName === 'student_id') {
        if (!validateStudentId(value)) {
            showAuthFieldError(field, 'Student ID must be 6-12 characters long and contain only letters and numbers.');
            return false;
        }
    }

    // Phone validation
    if (fieldType === 'tel' && value) {
        if (!validatePhone(value)) {
            showAuthFieldError(field, 'Please enter a valid phone number.');
            return false;
        }
    }

    // Show success state
    showAuthFieldSuccess(field);
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const minLength = 8;

    if (password.length < minLength) {
        return {
            isValid: false,
            message: `Password must be at least ${minLength} characters long.`
        };
    }

    // Additional password strength checks
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = 0;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;

    // For this assignment, we'll keep it simple - just length requirement
    return {
        isValid: true,
        strength: strength,
        message: 'Password meets requirements.'
    };
}

function validateStudentId(studentId) {
    const studentIdRegex = /^[A-Za-z0-9]{6,12}$/;
    return studentIdRegex.test(studentId);
}

function validatePhone(phone) {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it's a valid length (10-15 digits)
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

function validatePasswordMatch(passwordField, confirmField) {
    if (passwordField.value !== confirmField.value) {
        showAuthFieldError(confirmField, 'Passwords do not match.');
        return false;
    } else if (confirmField.value) {
        showAuthFieldSuccess(confirmField);
        return true;
    }
    return true;
}

function validateRegistrationSpecific(form) {
    let isValid = true;

    // Check terms agreement
    const termsCheckbox = form.querySelector('input[name="terms"]');
    if (termsCheckbox && !termsCheckbox.checked) {
        showNotification('Please agree to the Terms of Service and Privacy Policy.', 'error');
        isValid = false;
    }

    return isValid;
}

function showAuthFieldError(field, message) {
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

function showAuthFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    // Remove existing feedback
    const existingFeedback = formGroup.querySelectorAll('.form-error, .form-success');
    existingFeedback.forEach(el => el.remove());

    // Add success styling
    field.classList.remove('invalid');
    field.classList.add('valid');
}

function clearAuthFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    const feedback = formGroup.querySelectorAll('.form-error, .form-success');
    feedback.forEach(el => el.remove());

    field.classList.remove('valid', 'invalid');
}

function getFieldDisplayName(field) {
    const label = field.closest('.form-group')?.querySelector('.form-label');
    if (label) {
        return label.textContent.replace(/\*/g, '').replace(/\s*$/, '').split('\n')[1]?.trim() ||
               label.textContent.replace(/\*/g, '').trim();
    }
    return field.name || 'Field';
}

// ===== FORM SUBMISSION =====
function submitAuthForm(form) {
    const formData = new FormData(form);
    const isRegistration = form.id === 'register-form';

    // Show loading state
    showLoadingOverlay(isRegistration ? 'Creating your account...' : 'Signing you in...');

    // Simulate form submission (replace with actual PHP endpoint)
    setTimeout(() => {
        hideLoadingOverlay();

        if (isRegistration) {
            handleRegistrationSuccess();
        } else {
            handleLoginSuccess();
        }
    }, 2000);

    // In real implementation, you would do:
    /*
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingOverlay();
        if (data.success) {
            if (isRegistration) {
                handleRegistrationSuccess();
            } else {
                handleLoginSuccess();
            }
        } else {
            showNotification(data.message || 'An error occurred. Please try again.', 'error');
        }
    })
    .catch(error => {
        hideLoadingOverlay();
        showNotification('Network error. Please check your connection and try again.', 'error');
    });
    */
}

function handleRegistrationSuccess() {
    showModal(
        'Account Created Successfully!',
        'Welcome to StudentHub! Your account has been created. You can now log in and start using all our features.',
        'success'
    );

    // Redirect to login page after modal is closed
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 3000);
}

function handleLoginSuccess() {
    showModal(
        'Welcome Back!',
        'You have successfully logged in. Redirecting to your profile...',
        'success'
    );

    // Redirect to profile page
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 2000);
}

// ===== LOADING OVERLAY =====
function showLoadingOverlay(message = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        const messageElement = overlay.querySelector('p');
        if (messageElement) {
            messageElement.textContent = message;
        }
        overlay.classList.add('show');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

// ===== SOCIAL AUTHENTICATION =====
function initializeSocialAuth() {
    const googleBtn = document.querySelector('.btn-google');
    const githubBtn = document.querySelector('.btn-github');

    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            handleSocialAuth('google');
        });
    }

    if (githubBtn) {
        githubBtn.addEventListener('click', function() {
            handleSocialAuth('github');
        });
    }
}

function handleSocialAuth(provider) {
    showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication would be implemented here.`, 'info');

    // In real implementation:
    /*
    window.location.href = `/auth/${provider}`;
    */
}

// ===== PHONE NUMBER FORMATTING =====
function initializePhoneFormatting() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
}

function formatPhoneNumber(input) {
    // Remove all non-digit characters
    let value = input.value.replace(/\D/g, '');

    // Limit to 10 digits for US phone numbers
    if (value.length > 10) {
        value = value.slice(0, 10);
    }

    // Format as (XXX) XXX-XXXX
    if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }

    input.value = value;
}

// ===== FORM AUTO-SAVE =====
function initializeFormAutoSave() {
    const form = document.querySelector('.auth-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input:not([type="password"]):not([type="checkbox"]), select');

    inputs.forEach(input => {
        // Load saved value
        const savedValue = localStorage.getItem(`form_${input.name}`);
        if (savedValue && input.type !== 'email') { // Don't auto-fill email for security
            input.value = savedValue;
        }

        // Save on input
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                localStorage.setItem(`form_${this.name}`, this.value);
            } else {
                localStorage.removeItem(`form_${this.name}`);
            }
        });
    });

    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(`form_${input.name}`);
        });
    });
}

// ===== FORM ANIMATIONS =====
function initializeFormAnimations() {
    const formGroups = document.querySelectorAll('.auth-form .form-group');

    // Animate form groups on page load
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
    });

    // Add focus animations
    const inputs = document.querySelectorAll('.form-input, .form-select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.form-group')?.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.closest('.form-group')?.classList.remove('focused');
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    return data;
}

function validateFormData(data, requiredFields) {
    const errors = [];

    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field} is required`);
        }
    });

    return errors;
}

// ===== EXPORT FUNCTIONS =====
window.validateAuthForm = validateAuthForm;
window.submitAuthForm = submitAuthForm;
window.showLoadingOverlay = showLoadingOverlay;
window.hideLoadingOverlay = hideLoadingOverlay;
