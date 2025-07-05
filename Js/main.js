// ===== MAIN JAVASCRIPT FILE =====

document.addEventListener('DOMContentLoaded', function() {
    // ===== NAVIGATION FUNCTIONALITY =====
    initializeNavigation();

    // ===== SMOOTH SCROLLING =====
    initializeSmoothScrolling();

    // ===== FORM VALIDATION =====
    initializeFormValidation();

    // ===== ANIMATIONS ON SCROLL =====
    initializeScrollAnimations();
});

// ===== NAVIGATION FUNCTIONS =====
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Highlight active navigation link
    highlightActiveNavLink();
}

function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FORM VALIDATION =====
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name || field.id;

    // Clear previous errors
    clearFieldError(field);

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required.`);
        return false;
    }

    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address.');
            return false;
        }
    }

    // Password validation
    if (fieldType === 'password' && value) {
        if (value.length < 8) {
            showFieldError(field, 'Password must be at least 8 characters long.');
            return false;
        }
    }

    // Confirm password validation
    if (fieldName === 'confirm_password' || fieldName === 'confirmPassword') {
        const passwordField = field.form.querySelector('input[type="password"]:not([name*="confirm"])');
        if (passwordField && value !== passwordField.value) {
            showFieldError(field, 'Passwords do not match.');
            return false;
        }
    }

    return true;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        // Remove existing error
        const existingError = formGroup.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);

        // Add error styling to field
        field.style.borderColor = 'var(--error)';
    }
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        const errorElement = formGroup.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }
}

function getFieldLabel(field) {
    const label = field.closest('.form-group')?.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name || 'Field';
}

// ===== PASSWORD TOGGLE FUNCTIONALITY =====
function initializePasswordToggle() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    passwordInputs.forEach(input => {
        const toggleButton = createPasswordToggleButton();
        const inputContainer = input.parentNode;

        // Wrap input in container if not already wrapped
        if (!inputContainer.classList.contains('password-input-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'password-input-container';
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            wrapper.appendChild(toggleButton);
        }

        toggleButton.addEventListener('click', function() {
            togglePasswordVisibility(input, this);
        });
    });
}

function createPasswordToggleButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'password-toggle-btn';
    button.innerHTML = '<i class="fas fa-eye"></i>';
    button.setAttribute('aria-label', 'Toggle password visibility');
    return button;
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

// ===== MODAL FUNCTIONALITY =====
function showModal(title, message, type = 'info') {
    // Remove existing modal
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="modal-icon ${type}">
                    <i class="fas fa-${getModalIcon(type)}"></i>
                </div>
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-ok">OK</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        addModalStyles();
    }

    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    // Close modal functionality
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-ok, .modal-backdrop');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeModal(modal);
        });
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
        }
    });
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

function getModalIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function addModalStyles() {
    const styles = document.createElement('style');
    styles.id = 'modal-styles';
    styles.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .modal.show {
            opacity: 1;
            visibility: visible;
        }

        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }

        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: var(--bg-primary);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow: auto;
            transition: transform 0.3s ease;
        }

        .modal.show .modal-content {
            transform: translate(-50%, -50%) scale(1);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--gray-200);
        }

        .modal-title {
            margin: 0;
            color: var(--text-primary);
        }

        .modal-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: var(--spacing-sm);
            border-radius: var(--radius-sm);
            transition: all var(--transition-fast);
        }

        .modal-close:hover {
            background: var(--gray-100);
            color: var(--text-primary);
        }

        .modal-body {
            padding: var(--spacing-xl);
            text-align: center;
        }

        .modal-icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto var(--spacing-lg);
            font-size: var(--font-size-2xl);
        }

        .modal-icon.success {
            background: var(--secondary-100);
            color: var(--secondary-600);
        }

        .modal-icon.error {
            background: #fee2e2;
            color: var(--error);
        }

        .modal-icon.warning {
            background: #fef3c7;
            color: var(--warning);
        }

        .modal-icon.info {
            background: var(--primary-100);
            color: var(--primary-600);
        }

        .modal-footer {
            padding: var(--spacing-lg);
            border-top: 1px solid var(--gray-200);
            text-align: right;
        }
    `;
    document.head.appendChild(styles);
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animationElements = document.querySelectorAll('.feature-card, .stat-item');
    animationElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add animation styles
    if (!document.querySelector('#scroll-animation-styles')) {
        addScrollAnimationStyles();
    }
}

function addScrollAnimationStyles() {
    const styles = document.createElement('style');
    styles.id = 'scroll-animation-styles';
    styles.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .animate-on-scroll:nth-child(1) { transition-delay: 0.1s; }
        .animate-on-scroll:nth-child(2) { transition-delay: 0.2s; }
        .animate-on-scroll:nth-child(3) { transition-delay: 0.3s; }
        .animate-on-scroll:nth-child(4) { transition-delay: 0.4s; }
        .animate-on-scroll:nth-child(5) { transition-delay: 0.5s; }
        .animate-on-scroll:nth-child(6) { transition-delay: 0.6s; }
    `;
    document.head.appendChild(styles);
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getModalIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add notification styles if not present
    if (!document.querySelector('#notification-styles')) {
        addNotificationStyles();
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto remove
    setTimeout(() => {
        removeNotification(notification);
    }, duration);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

function addNotificationStyles() {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-primary);
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            padding: var(--spacing-md);
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            max-width: 400px;
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification.hide {
            transform: translateX(100%);
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            flex: 1;
        }

        .notification-success {
            border-left: 4px solid var(--success);
        }

        .notification-error {
            border-left: 4px solid var(--error);
        }

        .notification-warning {
            border-left: 4px solid var(--warning);
        }

        .notification-info {
            border-left: 4px solid var(--info);
        }

        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: var(--spacing-xs);
            border-radius: var(--radius-sm);
        }

        .notification-close:hover {
            background: var(--gray-100);
        }
    `;
    document.head.appendChild(styles);
}

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.showModal = showModal;
window.showNotification = showNotification;
window.validateForm = validateForm;
