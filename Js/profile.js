// ===== PROFILE PAGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize profile functionality
    initializeProfile();

    // Check if user is logged in
    checkAuthStatus();
});

// ===== AUTHENTICATION CHECK =====
function checkAuthStatus() {
    // In a real application, this would check session/token
    const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';

    if (!isLoggedIn) {
        // Redirect to login page if not authenticated
        showModal(
            'Authentication Required',
            'Please log in to access your profile.',
            'info'
        );

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Load user profile data
    loadProfileData();
}

// ===== PROFILE INITIALIZATION =====
function initializeProfile() {
    // Initialize avatar upload
    initializeAvatarUpload();

    // Initialize edit modals
    initializeEditModals();

    // Initialize profile actions
    initializeProfileActions();

    // Load demo data if not logged in through proper flow
    if (!localStorage.getItem('profile_data')) {
        loadDemoProfileData();
    }
}

// ===== PROFILE DATA MANAGEMENT =====
function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');

    if (Object.keys(profileData).length === 0) {
        loadDemoProfileData();
        return;
    }

    // Populate profile fields
    updateProfileDisplay(profileData);
}

function loadDemoProfileData() {
    const demoData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.mit.edu',
        phone: '+1 (555) 123-4567',
        location: 'Cambridge, MA',
        university: 'Massachusetts Institute of Technology',
        studentId: 'MIT2024001',
        major: 'Computer Science',
        minor: 'Mathematics',
        year: 'Senior (4th Year)',
        graduation: 'May 2024',
        advisor: 'Dr. Sarah Johnson',
        bio: "I'm a passionate Computer Science student at MIT with a focus on artificial intelligence and machine learning. I enjoy working on innovative projects that solve real-world problems and am always eager to learn new technologies. In my free time, I contribute to open-source projects and participate in hackathons.",
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        birthday: 'March 15, 2001',
        gpa: '3.8',
        coursesCompleted: 12,
        connections: 28,
        daysActive: 156
    };

    localStorage.setItem('profile_data', JSON.stringify(demoData));
    updateProfileDisplay(demoData);
}

function updateProfileDisplay(data) {
    // Update header information
    document.getElementById('profile-name').textContent = `${data.firstName} ${data.lastName}`;
    document.getElementById('profile-title').textContent = `${data.major} Student`;
    document.getElementById('profile-university').textContent = data.university;

    // Update contact information
    document.getElementById('contact-email').textContent = data.email;
    document.getElementById('contact-phone').textContent = data.phone;
    document.getElementById('contact-location').textContent = data.location;
    document.getElementById('contact-birthday').textContent = data.birthday;

    // Update academic information
    document.getElementById('student-id').textContent = data.studentId;
    document.getElementById('academic-year').textContent = data.year;
    document.getElementById('major').textContent = data.major;
    document.getElementById('minor').textContent = data.minor;
    document.getElementById('graduation').textContent = data.graduation;
    document.getElementById('advisor').textContent = data.advisor;

    // Update bio
    document.getElementById('bio-text').textContent = data.bio;

    // Update avatar
    if (data.avatar) {
        document.getElementById('profile-avatar-img').src = data.avatar;
    }

    // Update stats
    updateProfileStats(data);
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
    const editModal = document.getElementById('edit-profile-modal');

    if (editModal) {
        // Close modal functionality
        const closeButtons = editModal.querySelectorAll('.modal-close, .modal-cancel, .modal-backdrop');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                hideEditModal();
            });
        });
    }
}

function editProfile() {
    const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');

    // Populate edit form
    document.getElementById('edit-first-name').value = profileData.firstName || '';
    document.getElementById('edit-last-name').value = profileData.lastName || '';
    document.getElementById('edit-bio').value = profileData.bio || '';
    document.getElementById('edit-phone').value = profileData.phone || '';
    document.getElementById('edit-location').value = profileData.location || '';

    showEditModal();
}

function showEditModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function hideEditModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function saveProfile() {
    const form = document.getElementById('edit-profile-form');
    const formData = new FormData(form);

    // Get current profile data
    const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');

    // Update with form data
    profileData.firstName = formData.get('first_name');
    profileData.lastName = formData.get('last_name');
    profileData.bio = formData.get('bio');
    profileData.phone = formData.get('phone');
    profileData.location = formData.get('location');

    // Save updated data
    localStorage.setItem('profile_data', JSON.stringify(profileData));

    // Update display
    updateProfileDisplay(profileData);

    // Hide modal
    hideEditModal();

    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

// ===== SPECIFIC EDIT FUNCTIONS =====
function editAcademicInfo() {
    showModal(
        'Edit Academic Information',
        'Academic information editing would be implemented here with a detailed form.',
        'info'
    );
}

function editBio() {
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
}

function editSkills() {
    showModal(
        'Edit Skills',
        'Skills editing would be implemented here with a comprehensive skill management interface.',
        'info'
    );
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

ACADEMIC INFORMATION
Student ID: ${data.studentId}
Academic Advisor: ${data.advisor}

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
        window.location.href = 'index.html';
    }, 2000);
}

// ===== REAL-TIME FEATURES =====
function updateOnlineStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');

    if (navigator.onLine) {
        statusIndicator.classList.remove('offline');
        statusIndicator.classList.add('online');
        statusText.textContent = 'Online';
    } else {
        statusIndicator.classList.remove('online');
        statusIndicator.classList.add('offline');
        statusText.textContent = 'Offline';
    }
}

// Listen for online/offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// ===== PROFILE ANALYTICS =====
function updateProfileStats() {
    // Simulate real-time stats updates
    const currentData = JSON.parse(localStorage.getItem('profile_data') || '{}');

    // Increment days active
    currentData.daysActive = (currentData.daysActive || 156) + 1;

    localStorage.setItem('profile_data', JSON.stringify(currentData));
    updateProfileDisplay(currentData);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + E to edit profile
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        editProfile();
    }

    // Escape to close modals
    if (e.key === 'Escape') {
        hideEditModal();
    }
});

// ===== PROFILE SEARCH =====
function searchProfile(query) {
    // This would implement profile search functionality
    console.log('Searching profile for:', query);
}

// ===== EXPORT FUNCTIONS =====
window.editProfile = editProfile;
window.editAcademicInfo = editAcademicInfo;
window.editBio = editBio;
window.editSkills = editSkills;
window.saveProfile = saveProfile;
window.downloadProfile = downloadProfile;
window.triggerAvatarUpload = triggerAvatarUpload;
window.logout = logout;

// ===== DEMO MODE SETUP =====
function setupDemoMode() {
    // Set demo login status
    localStorage.setItem('user_logged_in', 'true');

    // Show demo notification
    setTimeout(() => {
        showNotification('Demo mode active. All changes are saved locally.', 'info', 5000);
    }, 1000);
}

// Initialize demo mode if accessing directly
if (!localStorage.getItem('user_logged_in')) {
    setupDemoMode();
}
