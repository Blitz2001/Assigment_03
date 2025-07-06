<?php
include './navbar.php';
require_once '../Includes/config.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Home</title>
    <link rel="stylesheet" href="../Styles/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body></body>

 <!-- Hero Section -->
    <main class="main-content">
        <section class="hero">
            <div class="hero-container">
                <div class="hero-content">
                    <h1 class="hero-title">
                        Welcome to <span class="gradient-text">StudentHub</span>
                    </h1>
                    <p class="hero-description">
                        Your comprehensive platform for student management, profile creation, and seamless communication.
                        Join thousands of students who trust StudentHub for their academic journey.
                    </p>
                    <div class="hero-actions">
                        <a href="register.html" class="btn btn-primary">
                            <i class="fas fa-rocket"></i>
                            Get Started
                        </a>
                        <a href="#features" class="btn btn-secondary">
                            <i class="fas fa-play"></i>
                            Learn More
                        </a>
                    </div>
                </div>
                <div class="hero-visual">
                    <div class="hero-card">
                        <div class="card-header">
                            <div class="card-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div class="card-content">
                            <div class="feature-preview">
                                <i class="fas fa-user-graduate"></i>
                                <span>Student Dashboard</span>
                            </div>
                            <div class="feature-preview">
                                <i class="fas fa-chart-line"></i>
                                <span>Progress Tracking</span>
                            </div>
                            <div class="feature-preview">
                                <i class="fas fa-comments"></i>
                                <span>Communication Tools</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features" id="features">
            <div class="container">
                <div class="section-header">
                    <h2>Why Choose StudentHub?</h2>
                    <p>Discover the powerful features that make student management effortless</p>
                </div>

                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3>Secure Authentication</h3>
                        <p>Advanced security measures protect your personal information with encrypted login systems.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <h3>Mobile Responsive</h3>
                        <p>Access your profile and features seamlessly across all devices - desktop, tablet, and mobile.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3>Profile Management</h3>
                        <p>Create comprehensive student profiles with easy-to-use forms and instant updates.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-headset"></i>
                        </div>
                        <h3>24/7 Support</h3>
                        <p>Get help whenever you need it through our integrated contact system and support team.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-chart-bar"></i>
                        </div>
                        <h3>Analytics Dashboard</h3>
                        <p>Track your progress and engagement with detailed analytics and reporting tools.</p>
                    </div>

                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-cogs"></i>
                        </div>
                        <h3>Customizable</h3>
                        <p>Personalize your experience with theme options and customizable dashboard layouts.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="stats">
            <div class="container">
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">10,000+</div>
                        <div class="stat-label">Active Students</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">99.9%</div>
                        <div class="stat-label">Uptime</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">24/7</div>
                        <div class="stat-label">Support</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">150+</div>
                        <div class="stat-label">Universities</div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="../Js/main.js"></script>
    <script src="../Js/theme.js"></script>

<?php
include './footer.php';
?>