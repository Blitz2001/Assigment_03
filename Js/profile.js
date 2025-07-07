// ===== PROFILE PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize profile functionality
    initializeProfile();

    // Check if user is logged in
    checkAuthStatus();

    // Attach event listeners to buttons
    attachButtonHandlers();
<<<<<<< HEAD

    // Social Links Edit Button
    const editSocialBtn = document.querySelector('.js-edit-social');
    if (editSocialBtn) {
        editSocialBtn.addEventListener('click', function() {
            document.getElementById('edit-social-modal').classList.add('active');
        });
    }
=======
>>>>>>> c89e32f3b0aee1fe3295f9c3b861477dd9301f29
});

// ===== AUTHENTICATION CHECK =====
function checkAuthStatus() {
    // Authentication is handled server-side by PHP sessions
    // This function is kept for compatibility but not used
}

// ===== BUTTON HANDLERS =====
function attachButtonHandlers() {
    // Edit Profile Button
    const editProfileBtn = document.querySelector('.js-edit-profile');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', editProfile);
    }

    // Edit Skills Button
    const editSkillsBtn = document.querySelector('.js-edit-skills');
    if (editSkillsBtn) {
        editSkillsBtn.addEventListener('click', editSkills);
    }

    // Edit Academic Button
    const editAcademicBtn = document.querySelector('.js-edit-academic');
    if (editAcademicBtn) {
        editAcademicBtn.addEventListener('click', editAcademicInfo);
    }

    // Edit Bio Button
    const editBioBtn = document.querySelector('.js-edit-bio');
    if (editBioBtn) {
        editBioBtn.addEventListener('click', editBio);
    }

    // Save buttons are handled by form submission to PHP

    // Download Profile Button
    const downloadProfileBtn = document.querySelector('.js-download-profile');
    if (downloadProfileBtn) {
        downloadProfileBtn.addEventListener('click', downloadProfile);
    }

    // Logout Button
    const logoutBtn = document.querySelector('.js-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// ===== BUTTON HANDLERS =====
function attachButtonHandlers() {
    // Edit Profile Button
    const editProfileBtn = document.querySelector('.js-edit-profile');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', editProfile);
    }

    // Edit Skills Button
    const editSkillsBtn = document.querySelector('.js-edit-skills');
    if (editSkillsBtn) {
        editSkillsBtn.addEventListener('click', editSkills);
    }

    // Edit Academic Button
    const editAcademicBtn = document.querySelector('.js-edit-academic');
    if (editAcademicBtn) {
        editAcademicBtn.addEventListener('click', editAcademicInfo);
    }

    // Edit Bio Button
    const editBioBtn = document.querySelector('.js-edit-bio');
    if (editBioBtn) {
        editBioBtn.addEventListener('click', editBio);
    }

    // Save Profile Button
    const saveProfileBtn = document.querySelector('.js-save-profile');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', saveProfile);
    }

    // Save Skills Button
    const saveSkillsBtn = document.querySelector('.js-save-skills');
    if (saveSkillsBtn) {
        saveSkillsBtn.addEventListener('click', saveSkills);
    }

    // Download Profile Button
    const downloadProfileBtn = document.querySelector('.js-download-profile');
    if (downloadProfileBtn) {
        downloadProfileBtn.addEventListener('click', downloadProfile);
    }

    // Logout Button
    const logoutBtn = document.querySelector('.js-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// ===== PROFILE INITIALIZATION =====
function initializeProfile() {
    // Initialize avatar upload
    initializeAvatarUpload();

    // Initialize edit modals
    initializeEditModals();

    // Initialize profile actions
    initializeProfileActions();
}

// ===== PROFILE DATA MANAGEMENT =====
function loadProfileData() {
    // Profile data is loaded server-side by PHP
    // This function is kept for compatibility but not used
}

function loadDemoProfileData() {
    // Demo data is not needed for PHP version
    // This function is kept for compatibility but not used
}

function updateProfileDisplay(data) {
    // This function is not needed for PHP version as data is populated server-side
    // Keeping it for compatibility but it won't be used
}

function updateProfileStats(data) {
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = data.daysActive || '156';
        statValues[1].textContent = data.gpa || '3.8';
        statValues[2].textContent = data.coursesCompleted || '12';
        statValues[3].textContent = data.connections || '28';
    }
}

// ===== AVATAR UPLOAD =====
function initializeAvatarUpload() {
    const avatarUpload = document.getElementById('avatar-upload');

    if (avatarUpload) {
        avatarUpload.addEventListener('change', handleAvatarUpload);
    }
}

function triggerAvatarUpload() {
    document.getElementById('avatar-upload').click();
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file.', 'error');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB.', 'error');
        return;
    }

    // Create file reader
    const reader = new FileReader();

    reader.onload = function(e) {
        const imageUrl = e.target.result;

        // Update avatar display
        document.getElementById('profile-avatar-img').src = imageUrl;

        // Save to profile data
        const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');
        profileData.avatar = imageUrl;
        localStorage.setItem('profile_data', JSON.stringify(profileData));

        showNotification('Profile picture updated successfully!', 'success');
    };

    reader.readAsDataURL(file);
}

// ===== EDIT FUNCTIONALITY =====
function initializeEditModals() {
    // Close buttons for all modals
    document.querySelectorAll('.modal-close, .modal-cancel, .modal-backdrop').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Prevent modal content from closing when clicking inside
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
<<<<<<< HEAD

    // Close modal when clicking on backdrop
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
    });
=======
>>>>>>> c89e32f3b0aee1fe3295f9c3b861477dd9301f29
}

// PROFILE EDIT FUNCTIONS
function editProfile() {
    // Show modal - the form is already populated with PHP data
    document.getElementById('edit-profile-modal').classList.add('active');
}

<<<<<<< HEAD
// Profile form will submit directly to PHP, no JavaScript save needed
=======
function saveProfile() {
    const form = document.getElementById('edit-profile-form');
    const formData = new FormData(form);

    // Get current profile data
    const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');

    // Update with form data
    profileData.firstName = formData.get('first_name') || profileData.firstName;
    profileData.lastName = formData.get('last_name') || profileData.lastName;
    profileData.bio = formData.get('bio') || profileData.bio;
    profileData.phone = formData.get('phone') || profileData.phone;
    profileData.location = formData.get('location') || profileData.location;
    profileData.birthday = formData.get('date_of_birth') || profileData.birthday;

    // Save updated data
    localStorage.setItem('profile_data', JSON.stringify(profileData));

    // Update display
    updateProfileDisplay(profileData);

    // Hide modal
    document.getElementById('edit-profile-modal').classList.remove('active');

    // Show success message
    showNotification('Profile updated successfully!', 'success');
}
>>>>>>> c89e32f3b0aee1fe3295f9c3b861477dd9301f29

// SKILLS EDIT FUNCTIONS
function editSkills() {
    // Show the modal - skills are already populated with PHP data
    document.getElementById('edit-skills-modal').classList.add('active');
    
    // Debug: Check if containers exist
    console.log('Programming container:', document.getElementById('programming-tags-container'));
    console.log('Frameworks container:', document.getElementById('frameworks-tags-container'));
    console.log('Tools container:', document.getElementById('tools-tags-container'));
}

function populateSkillsContainer(type, skills) {
    const container = document.getElementById(`${type}-tags-container`);
    container.innerHTML = '';
    
    skills.forEach(skill => {
        const tag = document.createElement('div');
        tag.className = 'editable-skill-tag';
        tag.innerHTML = `
            ${skill}
            <button onclick="removeSkill('${type}', this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(tag);
    });
}

function addSkill(type) {
    console.log(`addSkill called with type: ${type}`);
    const input = document.getElementById(`skill-${type}-input`);
    const skill = input.value.trim();
    
    console.log(`Input value: "${skill}"`);
    
    if (skill) {
        const container = document.getElementById(`${type}-tags-container`);
        
        if (!container) {
            console.error(`Container not found for type: ${type}`);
            return;
        }
        
        console.log(`Container found:`, container);
        
        // Create hidden input for form submission
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = `${type}_skills[]`;
        hiddenInput.value = skill;
        
        // Create skill tag
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.innerHTML = `
            ${skill}
            <i class="fas fa-times" onclick="removeSkill(this, '${type}')"></i>
        `;
        
        container.appendChild(hiddenInput);
        container.appendChild(tag);
        input.value = '';
        
        console.log(`Added skill: ${skill} to ${type}`);
    } else {
        console.log('No skill value provided');
    }
}

function removeSkill(button, type) {
    const tag = button.parentElement;
    const container = tag.parentElement;
    
    // Find the corresponding hidden input that comes before this tag
    let hiddenInput = null;
    let currentElement = tag.previousElementSibling;
    
    // Look for the hidden input that comes before this tag
    while (currentElement) {
        if (currentElement.tagName === 'INPUT' && currentElement.name === `${type}_skills[]`) {
            hiddenInput = currentElement;
            break;
        }
        currentElement = currentElement.previousElementSibling;
    }
    
    // Remove the hidden input if found
    if (hiddenInput) {
        hiddenInput.remove();
    }
    
    // Remove the tag
    tag.remove();
}

// Skills form will submit directly to PHP, no JavaScript save needed

function updateSkillsDisplay(programming, frameworks, tools) {
    // Update programming languages
    const programmingContainer = document.querySelector('.skills-category:nth-child(1) .skills-list');
    if (programmingContainer) {
        programmingContainer.innerHTML = programming.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
    }

    // Update frameworks
    const frameworksContainer = document.querySelector('.skills-category:nth-child(2) .skills-list');
    if (frameworksContainer) {
        frameworksContainer.innerHTML = frameworks.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
    }

    // Update tools
    const toolsContainer = document.querySelector('.skills-category:nth-child(3) .skills-list');
    if (toolsContainer) {
        toolsContainer.innerHTML = tools.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
    }
}

// ===== SPECIFIC EDIT FUNCTIONS =====
function editAcademicInfo() {
    // Show the academic info modal
    document.getElementById('edit-academic-modal').classList.add('active');
}

function editBio() {
<<<<<<< HEAD
    // Show the edit profile modal for bio editing
    document.getElementById('edit-profile-modal').classList.add('active');
=======
    const currentBio = document.getElementById('bio-text').textContent;
    const newBio = prompt('Edit your bio:', currentBio);

    if (newBio !== null && newBio.trim() !== '') {
        // Update display
        document.getElementById('bio-text').textContent = newBio;

        // Save to profile data
        const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');
        profileData.bio = newBio;
        localStorage.setItem('profile_data', JSON.stringify(profileData));

        showNotification('Bio updated successfully!', 'success');
    }
>>>>>>> c89e32f3b0aee1fe3295f9c3b861477dd9301f29
}

// ===== PROFILE ACTIONS =====
function initializeProfileActions() {
    // Any additional profile action initialization
}

function downloadProfile() {
    const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');

    // Create a simple CV/resume content
    const cvContent = generateCVContent(profileData);

    // Create and download file
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profileData.firstName}_${profileData.lastName}_CV.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('CV downloaded successfully!', 'success');
}

function generateCVContent(data) {
    return `
CURRICULUM VITAE

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Location: ${data.location}

EDUCATION
University: ${data.university}
Major: ${data.major}
Minor: ${data.minor}
Academic Year: ${data.year}
Expected Graduation: ${data.graduation}
GPA: ${data.gpa}

ABOUT
${data.bio}

SKILLS
Programming: ${(data.skills?.programming || []).join(', ')}
Frameworks: ${(data.skills?.frameworks || []).join(', ')}
Tools: ${(data.skills?.tools || []).join(', ')}

ACHIEVEMENTS
- Current GPA: ${data.gpa}
- Courses Completed: ${data.coursesCompleted}
- Academic Connections: ${data.connections}
- Days Active on Platform: ${data.daysActive}

Generated on: ${new Date().toLocaleDateString()}
Generated by: StudentHub Platform
    `.trim();
}

function logout() {
    showModal(
        'Confirm Logout',
        'Are you sure you want to log out?',
        'warning'
    );

    // In a real application, you would handle the logout confirmation
    setTimeout(() => {
        localStorage.removeItem('user_logged_in');
        localStorage.removeItem('profile_data');
        window.location.href = 'index.php';
    }, 2000);
}

// ===== UTILITY FUNCTIONS =====
function showModal(title, message, type) {
    // This would show a generic modal - implementation depends on your UI framework
    console.log(`[${type}] ${title}: ${message}`);
}

function showNotification(message, type, duration = 3000) {
    // This would show a notification - implementation depends on your UI framework
    console.log(`[${type}] ${message}`);
}

// ===== EXPORT FUNCTIONS =====
window.editProfile = editProfile;
window.editAcademicInfo = editAcademicInfo;
window.editBio = editBio;
window.editSkills = editSkills;
window.saveProfile = saveProfile;
window.saveSkills = saveSkills;
window.addSkill = addSkill;
window.removeSkill = removeSkill;
window.downloadProfile = downloadProfile;
window.triggerAvatarUpload = triggerAvatarUpload;
window.logout = logout;