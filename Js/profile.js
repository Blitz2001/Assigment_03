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
        daysActive: 156,
        skills: {
            programming: ['Python', 'JavaScript', 'Java', 'C++', 'TypeScript'],
            frameworks: ['React', 'Node.js', 'Django', 'TensorFlow', 'Express.js'],
            tools: ['Git', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL']
        }
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

    // Update skills if they exist
    if (data.skills) {
        updateSkillsDisplay(
            data.skills.programming || [],
            data.skills.frameworks || [],
            data.skills.tools || []
        );
    }
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
    // Profile modal close buttons
    const editModal = document.getElementById('edit-profile-modal');
    if (editModal) {
        const closeButtons = editModal.querySelectorAll('.modal-close, .modal-cancel, .modal-backdrop');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                editModal.classList.remove('active');
            });
        });

        // Prevent modal from closing when clicking inside
        editModal.querySelector('.modal-content').addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Skills modal close buttons
    const skillsModal = document.getElementById('edit-skills-modal');
    if (skillsModal) {
        const closeButtons = skillsModal.querySelectorAll('.modal-close, .modal-cancel, .modal-backdrop');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                skillsModal.classList.remove('active');
            });
        });

        // Prevent modal from closing when clicking inside
        skillsModal.querySelector('.modal-content').addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// PROFILE EDIT FUNCTIONS
function editProfile() {
    const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');

    // Populate edit form
    document.getElementById('edit-first-name').value = profileData.firstName || '';
    document.getElementById('edit-last-name').value = profileData.lastName || '';
    document.getElementById('edit-bio').value = profileData.bio || '';
    document.getElementById('edit-phone').value = profileData.phone || '';
    document.getElementById('edit-location').value = profileData.location || '';
    document.getElementById('edit-dob').value = profileData.birthday || '';

    // Show modal
    document.getElementById('edit-profile-modal').classList.add('active');
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
    profileData.birthday = formData.get('date_of_birth');

    // Save updated data
    localStorage.setItem('profile_data', JSON.stringify(profileData));

    // Update display
    updateProfileDisplay(profileData);

    // Hide modal
    document.getElementById('edit-profile-modal').classList.remove('active');

    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

// SKILLS EDIT FUNCTIONS
function editSkills() {
    const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');
    const skills = profileData.skills || {
        programming: [],
        frameworks: [],
        tools: []
    };

    // Populate the edit modal
    populateSkillsContainer('programming', skills.programming || []);
    populateSkillsContainer('frameworks', skills.frameworks || []);
    populateSkillsContainer('tools', skills.tools || []);

    // Show the modal
    document.getElementById('edit-skills-modal').classList.add('active');
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
    const input = document.getElementById(`skill-${type}-input`);
    const skill = input.value.trim();
    
    if (skill) {
        const container = document.getElementById(`${type}-tags-container`);
        const tag = document.createElement('div');
        tag.className = 'editable-skill-tag';
        tag.innerHTML = `
            ${skill}
            <button onclick="removeSkill('${type}', this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(tag);
        input.value = '';
    }
}

function removeSkill(type, button) {
    button.parentElement.remove();
}

function saveSkills() {
    // Get all skills from the modal
    const programmingSkills = Array.from(document.getElementById('programming-tags-container').children)
        .map(tag => tag.textContent.trim().replace('×', '').trim());
    
    const frameworksSkills = Array.from(document.getElementById('frameworks-tags-container').children)
        .map(tag => tag.textContent.trim().replace('×', '').trim());
    
    const toolsSkills = Array.from(document.getElementById('tools-tags-container').children)
        .map(tag => tag.textContent.trim().replace('×', '').trim());

    // Update profile data
    const profileData = JSON.parse(localStorage.getItem('profile_data') || '{}');
    profileData.skills = {
        programming: programmingSkills,
        frameworks: frameworksSkills,
        tools: toolsSkills
    };

    // Save to localStorage
    localStorage.setItem('profile_data', JSON.stringify(profileData));

    // Update the display
    updateSkillsDisplay(programmingSkills, frameworksSkills, toolsSkills);

    // Close the modal
    document.getElementById('edit-skills-modal').classList.remove('active');

    // Show success message
    showNotification('Skills updated successfully!', 'success');
}

function updateSkillsDisplay(programming, frameworks, tools) {
    // Update programming languages
    const programmingContainer = document.querySelector('.skills-category:nth-child(1) .skills-list');
    programmingContainer.innerHTML = programming.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');

    // Update frameworks
    const frameworksContainer = document.querySelector('.skills-category:nth-child(2) .skills-list');
    frameworksContainer.innerHTML = frameworks.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');

    // Update tools
    const toolsContainer = document.querySelector('.skills-category:nth-child(3) .skills-list');
    toolsContainer.innerHTML = tools.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');
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
        window.location.href = 'index.html';
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