<?php
include './navbar.php';
require_once '../Includes/config.php';

// Initialize variables
$error = '';
$success = '';

/*
// Check if user is logged in (you should have session management)
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
*/

$user_id = 1;
// Fetch user data
$user = [];
$profile = [];
$skills = [];
$social_links = [];

// READ operation - Fetch user data
try {
    // Fetch user info
    $stmt = $pdo->prepare("SELECT * FROM users WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        throw new Exception("User not found");
    }
    
    // Fetch profile info
    $stmt = $pdo->prepare("SELECT * FROM profiles WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Fetch skills
    $stmt = $pdo->prepare("SELECT * FROM skills WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $skills = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Fetch social links
    $stmt = $pdo->prepare("SELECT * FROM social_links WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $social_links = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
} catch (Exception $e) {
    $error = "Error fetching profile data: " . $e->getMessage();
}

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // UPDATE profile information
    if (isset($_POST['update_profile'])) {
        try {
            $first_name = $_POST['first_name'];
            $last_name = $_POST['last_name'];
            $phone = $_POST['phone'];
            $location = $_POST['location'];
            $birthday = $_POST['date_of_birth'];
            $bio = $_POST['bio'];
            
            // Update users table
            $stmt = $pdo->prepare("UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE user_id = ?");
            $stmt->execute([$first_name, $last_name, $phone, $user_id]);
            
            // Update or insert into profiles table
            if ($profile) {
                $stmt = $pdo->prepare("UPDATE profiles SET bio = ?, location = ?, birthday = ? WHERE user_id = ?");
                $stmt->execute([$bio, $location, $birthday, $user_id]);
            } else {
                $stmt = $pdo->prepare("INSERT INTO profiles (user_id, bio, location, birthday) VALUES (?, ?, ?, ?)");
                $stmt->execute([$user_id, $bio, $location, $birthday]);
            }
            
            $success = "Profile updated successfully!";
            // Refresh the page to show updated data
            header("Location: profile.php");
            exit();
            
        } catch (Exception $e) {
            $error = "Error updating profile: " . $e->getMessage();
        }
    }
    
    // UPDATE skills
    if (isset($_POST['update_skills'])) {
        try {
            // First delete existing skills
            $stmt = $pdo->prepare("DELETE FROM skills WHERE user_id = ?");
            $stmt->execute([$user_id]);
            
            // Add new skills
            if (!empty($_POST['programming_skills'])) {
                foreach ($_POST['programming_skills'] as $skill) {
                    $stmt = $pdo->prepare("INSERT INTO skills (user_id, skill_name, skill_category) VALUES (?, ?, 'Programming Language')");
                    $stmt->execute([$user_id, $skill]);
                }
            }
            
            if (!empty($_POST['framework_skills'])) {
                foreach ($_POST['framework_skills'] as $skill) {
                    $stmt = $pdo->prepare("INSERT INTO skills (user_id, skill_name, skill_category) VALUES (?, ?, 'Framework')");
                    $stmt->execute([$user_id, $skill]);
                }
            }
            
            if (!empty($_POST['tool_skills'])) {
                foreach ($_POST['tool_skills'] as $skill) {
                    $stmt = $pdo->prepare("INSERT INTO skills (user_id, skill_name, skill_category) VALUES (?, ?, 'Tool')");
                    $stmt->execute([$user_id, $skill]);
                }
            }
            
            $success = "Skills updated successfully!";
            // Refresh the page to show updated data
            header("Location: profile.php");
            exit();
            
        } catch (Exception $e) {
            $error = "Error updating skills: " . $e->getMessage();
        }
    }
}

// Function to categorize skills for display
function categorizeSkills($skills) {
    $categorized = [
        'Programming Language' => [],
        'Framework' => [],
        'Tool' => [],
        'Other' => []
    ];
    
    foreach ($skills as $skill) {
        $categorized[$skill['skill_category']][] = $skill['skill_name'];
    }
    
    return $categorized;
}

$categorized_skills = categorizeSkills($skills);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Profile</title>
    <link rel="stylesheet" href="../Styles/styles.css">
    <link rel="stylesheet" href="../Styles/profile.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>

    <!-- Display error/success messages -->
    <?php if ($error): ?>
        <div class="alert alert-danger"><?php echo htmlspecialchars($error); ?></div>
    <?php endif; ?>
    
    <?php if ($success): ?>
        <div class="alert alert-success"><?php echo htmlspecialchars($success); ?></div>
    <?php endif; ?>

    <!-- Main Content -->
    <main class="profile-main">
        <div class="container">
            <!-- Profile Header -->
            <div class="profile-header">
                <div class="profile-header-content">
                    <div class="profile-avatar-section">
                        <div class="profile-avatar">
                            <img id="profile-avatar-img" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" alt="Profile Avatar">
                            <button class="avatar-upload-btn" onclick="triggerAvatarUpload()">
                                <i class="fas fa-camera"></i>
                            </button>
                            <input type="file" id="avatar-upload" accept="image/*" style="display: none;">
                        </div>
                        <div class="profile-status">
                            <span class="status-indicator online"></span>
                            <span class="status-text">Online</span>
                        </div>
                    </div>

                    <div class="profile-info">
                        <h1 class="profile-name" id="profile-name"><?php echo htmlspecialchars($user['first_name'] . ' ' . htmlspecialchars($user['last_name'])) ?></h1>
                        <p class="profile-title" id="profile-title"><?php echo htmlspecialchars($profile['title'] ?? 'Student'); ?></p>
                        <p class="profile-university" id="profile-university"><?php echo htmlspecialchars($user['university']); ?></p>
                        <div class="profile-badges">
                            <span class="badge badge-primary"><?php echo htmlspecialchars($user['academic_year']); ?></span>
                            <span class="badge badge-success">Verified</span>
                            <span class="badge badge-info">Active</span>
                        </div>
                    </div>

                    <div class="profile-actions">
                        <button class="btn btn-primary" onclick="editProfile()">
                            <i class="fas fa-edit"></i>
                            Edit Profile
                        </button>
                        <button class="btn btn-secondary" onclick="downloadProfile()">
                            <i class="fas fa-download"></i>
                            Download CV
                        </button>
                    </div>
                </div>
            </div>

            <!-- Profile Content -->
            <div class="profile-content">
                <div class="profile-sidebar">
                    <!-- Quick Stats -->
                    <div class="profile-card">
                        <h3>Quick Stats</h3>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <i class="fas fa-calendar-check"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-value">156</div>
                                    <div class="stat-label">Days Active</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <i class="fas fa-trophy"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-value"><?php echo htmlspecialchars($profile['gpa'] ?? 'N/A'); ?></div>
                                    <div class="stat-label">GPA</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <i class="fas fa-book"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-value">12</div>
                                    <div class="stat-label">Courses</div>
                                </div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-value">28</div>
                                    <div class="stat-label">Connections</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="profile-card">
                        <h3>Contact Information</h3>
                        <div class="contact-info">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span id="contact-email"><?php echo htmlspecialchars($user['email']); ?></span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span id="contact-phone"><?php echo htmlspecialchars($user['phone'] ?? 'N/A'); ?></span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span id="contact-location"><?php echo htmlspecialchars($profile['location'] ?? 'N/A'); ?></span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-birthday-cake"></i>
                                <span id="contact-birthday"><?php echo isset($profile['birthday']) ? date('F j, Y', strtotime($profile['birthday'])) : 'N/A'; ?></span>
                            </div>
                        </div>
                    </div>

                    <!-- Social Links -->
                    <div class="profile-card">
                        <h3>Social Links</h3>
                        <div class="social-links">
                            <?php foreach ($social_links as $link): ?>
                                <a href="<?php echo htmlspecialchars($link['url']); ?>" class="social-link" target="_blank">
                                    <i class="fab fa-<?php echo htmlspecialchars($link['platform']); ?>"></i>
                                    <span><?php echo ucfirst(htmlspecialchars($link['platform'])); ?></span>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>

                <div class="profile-main-content">
                    <!-- Academic Information -->
                    <div class="profile-card">
                        <div class="card-header">
                            <h3>Academic Information</h3>
                            <button class="btn btn-sm btn-secondary" onclick="editAcademicInfo()">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                        </div>
                        <div class="academic-info">
                            <div class="info-row">
                                <div class="info-item">
                                    <label>Student ID</label>
                                    <span id="student-id"><?php echo htmlspecialchars($user['student_id']); ?></span>
                                </div>
                                <div class="info-item">
                                    <label>Academic Year</label>
                                    <span id="academic-year"><?php echo htmlspecialchars($user['academic_year']); ?></span>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="info-item">
                                    <label>Major</label>
                                    <span id="major"><?php echo htmlspecialchars($user['major']); ?></span>
                                </div>
                                <div class="info-item">
                                    <label>Minor</label>
                                    <span id="minor"><?php echo htmlspecialchars($profile['minor'] ?? 'N/A'); ?></span>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="info-item">
                                    <label>Expected Graduation</label>
                                    <span id="graduation"><?php echo htmlspecialchars($profile['expected_graduation'] ?? 'N/A'); ?></span>
                                </div>
                                <div class="info-item">
                                    <label>Advisor</label>
                                    <span id="advisor"><?php echo htmlspecialchars($profile['advisor'] ?? 'N/A'); ?></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bio Section -->
                    <div class="profile-card">
                        <div class="card-header">
                            <h3>About Me</h3>
                            <button class="btn btn-sm btn-secondary" onclick="editBio()">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                        </div>
                        <div class="bio-content">
                            <p id="bio-text">
                                <?php echo htmlspecialchars($profile['bio'] ?? 'No bio available.'); ?>
                            </p>
                        </div>
                    </div>

                    <!-- Skills -->
                    <div class="profile-card">
                        <div class="card-header">
                            <h3>Skills & Technologies</h3>
                            <button class="btn btn-sm btn-secondary" onclick="editSkills()">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                        </div>
                        <div class="skills-content">
                            <?php if (!empty($categorized_skills['Programming Language'])): ?>
                                <div class="skills-category">
                                    <h4>Programming Languages</h4>
                                    <div class="skills-list">
                                        <?php foreach ($categorized_skills['Programming Language'] as $skill): ?>
                                            <span class="skill-tag"><?php echo htmlspecialchars($skill); ?></span>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            
                            <?php if (!empty($categorized_skills['Framework'])): ?>
                                <div class="skills-category">
                                    <h4>Frameworks & Libraries</h4>
                                    <div class="skills-list">
                                        <?php foreach ($categorized_skills['Framework'] as $skill): ?>
                                            <span class="skill-tag"><?php echo htmlspecialchars($skill); ?></span>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            
                            <?php if (!empty($categorized_skills['Tool'])): ?>
                                <div class="skills-category">
                                    <h4>Tools & Platforms</h4>
                                    <div class="skills-list">
                                        <?php foreach ($categorized_skills['Tool'] as $skill): ?>
                                            <span class="skill-tag"><?php echo htmlspecialchars($skill); ?></span>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="profile-card">
                        <h3>Recent Activity</h3>
                        <div class="activity-feed">
                            <div class="activity-item">
                                <div class="activity-icon">
                                    <i class="fas fa-graduation-cap"></i>
                                </div>
                                <div class="activity-content">
                                    <p><strong>Completed</strong> Advanced Machine Learning course</p>
                                    <span class="activity-time">2 days ago</span>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon">
                                    <i class="fas fa-code"></i>
                                </div>
                                <div class="activity-content">
                                    <p><strong>Submitted</strong> Final project for Web Development</p>
                                    <span class="activity-time">1 week ago</span>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon">
                                    <i class="fas fa-trophy"></i>
                                </div>
                                <div class="activity-content">
                                    <p><strong>Won</strong> 1st place in University Hackathon</p>
                                    <span class="activity-time">2 weeks ago</span>
                                </div>
                            </div>
                            <div class="activity-item">
                                <div class="activity-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="activity-content">
                                    <p><strong>Joined</strong> AI Research Group</p>
                                    <span class="activity-time">1 month ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Edit Profile Modal -->
    <div class="modal" id="edit-profile-modal">
        <div class="modal-backdrop"></div>
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h3>Edit Profile</h3>
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="edit-profile-form" class="edit-form" method="POST" action="profile.php">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-first-name" class="form-label">First Name</label>
                            <input type="text" id="edit-first-name" name="first_name" class="form-input" value="<?php echo htmlspecialchars($user['first_name']); ?>">
                        </div>
                        <div class="form-group">
                            <label for="edit-last-name" class="form-label">Last Name</label>
                            <input type="text" id="edit-last-name" name="last_name" class="form-input" value="<?php echo htmlspecialchars($user['last_name']); ?>">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit-bio" class="form-label">Bio</label>
                        <textarea id="edit-bio" name="bio" class="form-textarea" rows="4"><?php echo htmlspecialchars($profile['bio'] ?? ''); ?></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-phone" class="form-label">Phone</label>
                            <input type="tel" id="edit-phone" name="phone" class="form-input" value="<?php echo htmlspecialchars($user['phone'] ?? ''); ?>">
                        </div>
                        <div class="form-group">
                            <label for="edit-dob" class="form-label">Date of Birth</label>
                            <input type="date" id="edit-dob" name="date_of_birth" class="form-input" value="<?php echo isset($profile['birthday']) ? htmlspecialchars($profile['birthday']) : ''; ?>">
                        </div>
                        <div class="form-group">
                            <label for="edit-location" class="form-label">Location</label>
                            <input type="text" id="edit-location" name="location" class="form-input" value="<?php echo htmlspecialchars($profile['location'] ?? ''); ?>">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                        <button type="submit" name="update_profile" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Skills Modal -->
    <div class="modal" id="edit-skills-modal">
        <div class="modal-backdrop"></div>
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h3>Edit Skills & Technologies</h3>
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="edit-skills-form" class="edit-form" method="POST" action="profile.php">
                    <div class="skills-edit-section">
                        <div class="form-group">
                            <label class="form-label">Programming Languages</label>
                            <div class="skills-input-container">
                                <input type="text" id="skill-programming-input" class="form-input" placeholder="Add programming language">
                                <button type="button" class="btn btn-sm btn-primary" onclick="addSkill('programming')">
                                    <i class="fas fa-plus"></i> Add
                                </button>
                            </div>
                            <div class="skills-tags-container" id="programming-tags-container">
                                <?php foreach ($categorized_skills['Programming Language'] as $skill): ?>
                                    <input type="hidden" name="programming_skills[]" value="<?php echo htmlspecialchars($skill); ?>">
                                    <span class="skill-tag"><?php echo htmlspecialchars($skill); ?> <i class="fas fa-times" onclick="removeSkill(this, 'programming')"></i></span>
                                <?php endforeach; ?>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Frameworks & Libraries</label>
                            <div class="skills-input-container">
                                <input type="text" id="skill-frameworks-input" class="form-input" placeholder="Add framework/library">
                                <button type="button" class="btn btn-sm btn-primary" onclick="addSkill('frameworks')">
                                    <i class="fas fa-plus"></i> Add
                                </button>
                            </div>
                            <div class="skills-tags-container" id="frameworks-tags-container">
                                <?php foreach ($categorized_skills['Framework'] as $skill): ?>
                                    <input type="hidden" name="framework_skills[]" value="<?php echo htmlspecialchars($skill); ?>">
                                    <span class="skill-tag"><?php echo htmlspecialchars($skill); ?> <i class="fas fa-times" onclick="removeSkill(this, 'frameworks')"></i></span>
                                <?php endforeach; ?>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Tools & Platforms</label>
                            <div class="skills-input-container">
                                <input type="text" id="skill-tools-input" class="form-input" placeholder="Add tool/platform">
                                <button type="button" class="btn btn-sm btn-primary" onclick="addSkill('tools')">
                                    <i class="fas fa-plus"></i> Add
                                </button>
                            </div>
                            <div class="skills-tags-container" id="tools-tags-container">
                                <?php foreach ($categorized_skills['Tool'] as $skill): ?>
                                    <input type="hidden" name="tool_skills[]" value="<?php echo htmlspecialchars($skill); ?>">
                                    <span class="skill-tag"><?php echo htmlspecialchars($skill); ?> <i class="fas fa-times" onclick="removeSkill(this, 'tools')"></i></span>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                        <button type="submit" name="update_skills" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="../Js/main.js"></script>
    <script src="../Js/theme.js"></script>
    <script src="../Js/profile.js"></script>
</body>
</html>

<?php
include './footer.php';
?>