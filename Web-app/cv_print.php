<?php
session_start();
require_once '../Includes/config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Fetch user info
$stmt = $pdo->prepare("SELECT * FROM users WHERE user_id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Fetch profile info
$stmt = $pdo->prepare("SELECT * FROM profiles WHERE user_id = ?");
$stmt->execute([$user_id]);
$profile = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$profile) {
    $profile = [
        'bio' => '',
        'title' => 'Student',
        'advisor' => 'N/A',
        'minor' => 'N/A',
        'expected_graduation' => 'N/A',
        'gpa' => 'N/A',
        'location' => 'N/A',
        'birthday' => null
    ];
}

// Fetch skills
$stmt = $pdo->prepare("SELECT * FROM skills WHERE user_id = ?");
$stmt->execute([$user_id]);
$skills = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch social links
$stmt = $pdo->prepare("SELECT * FROM social_links WHERE user_id = ?");
$stmt->execute([$user_id]);
$social_links = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Format academic year
$academic_year_map = [
    'Freshman' => 'Freshman (1st Year)',
    'Sophomore' => 'Sophomore (2nd Year)',
    'Junior' => 'Junior (3rd Year)',
    'Senior' => 'Senior (4th Year)',
    'Graduate' => 'Graduate Student',
    'PhD' => 'PhD Candidate'
];
$academic_year = $academic_year_map[$user['academic_year']] ?? $user['academic_year'];

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
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Download CV - StudentHub</title>
    <link rel="stylesheet" href="../Styles/styles.css">
    <link rel="stylesheet" href="../Styles/profile.css">
    <style>
        @media print {
            /* Remove only the actions, not the header background */
            .profile-actions,
            .btn,
            .avatar-upload-btn,
            .no-print {
                display: none !important;
            }
            .profile-card {
                box-shadow: none !important;
                border: 1px solid var(--gray-300) !important;
                break-inside: avoid;
            }
        }
        .cv-container { max-width: 900px; margin: 30px auto; background: #fff; box-shadow: 0 0 8px #ccc; padding: 32px; border-radius: 12px; }
        .profile-header, .profile-content { margin-bottom: 32px; }
        .profile-avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #eee; }
        .profile-title { font-size: 2rem; font-weight: 600; margin-top: 12px; }
        .profile-info-list { list-style: none; padding: 0; margin: 0; }
        .profile-info-list li { margin-bottom: 8px; }
        .section-title { font-size: 1.3rem; font-weight: 500; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
        .skills-list { margin: 0; padding: 0; list-style: none; }
        .skills-list li { display: inline-block; background: #f0f0f0; border-radius: 4px; padding: 4px 10px; margin: 2px 6px 2px 0; font-size: 0.98rem; }
        .social-link { margin-right: 12px; }
    </style>
    <script>
        window.onload = function() {
            window.print();
        };
    </script>
</head>
<body>
<div class="cv-container">
    <div class="profile-header">
        <div class="profile-header-content">
            <div class="profile-avatar-section">
                <div class="profile-avatar">
                    <img id="profile-avatar-img" src="<?php echo htmlspecialchars($profile['avatar'] ?? '../Styles/default-avatar.png'); ?>" alt="Profile Avatar">
                </div>
            </div>
            <div class="profile-info" style="text-align:center;">
                <h1 class="profile-name"><?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></h1>
                <p class="profile-title"><?php echo htmlspecialchars($profile['title']); ?></p>
                <p class="profile-university"><?php echo htmlspecialchars($user['university']); ?></p>
            </div>
            <div></div> <!-- Empty for grid alignment -->
        </div>
    </div>
    <ul class="profile-info-list">
        <li><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></li>
        <li><strong>Phone:</strong> <?php echo htmlspecialchars($user['phone'] ?? 'N/A'); ?></li>
        <li><strong>Location:</strong> <?php echo htmlspecialchars($profile['location'] ?? 'N/A'); ?></li>
        <li><strong>Birthday:</strong> <?php echo isset($profile['birthday']) ? date('F j, Y', strtotime($profile['birthday'])) : 'N/A'; ?></li>
    </ul>
    <div class="section-title">Academic Information</div>
    <ul class="profile-info-list">
        <li><strong>Student ID:</strong> <?php echo htmlspecialchars($user['student_id']); ?></li>
        <li><strong>Academic Year:</strong> <?php echo htmlspecialchars($academic_year); ?></li>
        <li><strong>Major:</strong> <?php echo htmlspecialchars($user['major']); ?></li>
        <li><strong>Minor:</strong> <?php echo htmlspecialchars($profile['minor'] ?? 'N/A'); ?></li>
        <li><strong>Expected Graduation:</strong> <?php echo htmlspecialchars($profile['expected_graduation'] ?? 'N/A'); ?></li>
        <li><strong>Advisor:</strong> <?php echo htmlspecialchars($profile['advisor'] ?? 'N/A'); ?></li>
        <li><strong>GPA:</strong> <?php echo htmlspecialchars($profile['gpa'] ?? 'N/A'); ?></li>
    </ul>
    <div class="section-title">About Me</div>
    <div><?php echo nl2br(htmlspecialchars($profile['bio'])); ?></div>
    <div class="section-title">Skills</div>
    <?php foreach ($categorized_skills as $category => $skills): ?>
        <?php if (!empty($skills)): ?>
            <div><strong><?php echo htmlspecialchars($category); ?>:</strong></div>
            <ul class="skills-list">
                <?php foreach ($skills as $skill): ?>
                    <li><?php echo htmlspecialchars($skill); ?></li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    <?php endforeach; ?>
    <div class="section-title">Social Links</div>
    <div>
        <?php foreach ($social_links as $link): ?>
            <a href="<?php echo htmlspecialchars($link['url']); ?>" class="social-link" target="_blank">
                <?php echo ucfirst(htmlspecialchars($link['platform'])); ?>
            </a>
        <?php endforeach; ?>
    </div>
    <div class="no-print" style="text-align:center; margin-top:32px;">
        <a href="profile.php" class="btn btn-secondary">Back to Profile</a>
    </div>
</div>
</body>
</html> 