<?php
// Start PHP Backend Code
require_once '../Includes/config.php';

// Initialize variables
$errors = [];
$success = false;
$is_ajax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get and sanitize form data
    $first_name = trim($_POST['first_name'] ?? '');
    $last_name = trim($_POST['last_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $subject = trim($_POST['subject'] ?? '');
    $priority = trim($_POST['priority'] ?? 'medium');
    $message = trim($_POST['message'] ?? '');
    $experience_rating = isset($_POST['experience_rating']) ? (int)$_POST['experience_rating'] : null;
    $recommendation_score = isset($_POST['recommendation']) ? (int)$_POST['recommendation'] : null;
    $wants_updates = isset($_POST['updates']) ? 1 : 0;
    $wants_newsletter = isset($_POST['newsletter']) ? 1 : 0;
    $user_id = $_SESSION['user_id'] ?? null;
    
    // Validate inputs
    if (empty($first_name)) $errors['first_name'] = 'First name is required';
    if (empty($last_name)) $errors['last_name'] = 'Last name is required';
    if (empty($email)) {
        $errors['email'] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Please enter a valid email address';
    }
    if (empty($subject)) $errors['subject'] = 'Subject is required';
    if (empty($message)) {
        $errors['message'] = 'Message is required';
    } elseif (strlen($message) < 10) {
        $errors['message'] = 'Message should be at least 10 characters long';
    }

    // If no errors, process the submission
    if (empty($errors)) {
        try {
            $stmt = $conn->prepare("INSERT INTO contact_submissions 
                                  (user_id, first_name, last_name, email, subject, priority, message, 
                                   experience_rating, recommendation_score, wants_updates, wants_newsletter)
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            $stmt->bind_param("issssssiiii", 
                $user_id,
                $first_name,
                $last_name,
                $email,
                $subject,
                $priority,
                $message,
                $experience_rating,
                $recommendation_score,
                $wants_updates,
                $wants_newsletter
            );
            
            if ($stmt->execute()) {
                $success = true;
                
                // Handle newsletter subscription
                if ($wants_newsletter) {
                    $newsletter_stmt = $conn->prepare("INSERT INTO newsletter_subscriptions 
                                                      (email, user_id, is_active) 
                                                      VALUES (?, ?, 1)
                                                      ON DUPLICATE KEY UPDATE is_active = 1");
                    $newsletter_stmt->bind_param("si", $email, $user_id);
                    $newsletter_stmt->execute();
                    $newsletter_stmt->close();
                }
            } else {
                $errors['database'] = 'Error submitting your message. Please try again.';
            }
            
            $stmt->close();
        } catch (Exception $e) {
            $errors['database'] = 'Database error: ' . $e->getMessage();
        }
    }
    
    // Handle AJAX response
    if ($is_ajax) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'errors' => $errors,
            'message' => $success ? 'Your message has been sent successfully!' : ($errors['database'] ?? 'Please correct the errors below')
        ]);
        exit;
    }
    
    // Reset form on success for non-AJAX submission
    if ($success && !$is_ajax) {
        $first_name = $last_name = $email = $message = '';
        $subject = $priority = '';
        $experience_rating = $recommendation_score = null;
        $wants_updates = $wants_newsletter = 0;
    }
}

// Include navbar
include './navbar.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Contact</title>
    <link rel="stylesheet" href="../Styles/styles.css">
    <link rel="stylesheet" href="../Styles/contact.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Main Content -->
    <main class="contact-main">
        <div class="container">
            <!-- Contact Header -->
            <div class="contact-header">
                <h1>Get in Touch</h1>
                <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>

            <div class="contact-content">
                <!-- Contact Information -->
                <div class="contact-info-section">
                    <div class="contact-info-card">
                        <h2>Contact Information</h2>
                        <p>Reach out to us through any of these channels. We're here to help!</p>

                        <div class="contact-methods">
                            <div class="contact-method">
                                <div class="contact-icon">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <div class="contact-details">
                                    <h4>Email Support</h4>
                                    <p>support@studenthub.com</p>
                                    <span>We typically respond within 24 hours</span>
                                </div>
                            </div>

                            <div class="contact-method">
                                <div class="contact-icon">
                                    <i class="fas fa-phone"></i>
                                </div>
                                <div class="contact-details">
                                    <h4>Phone Support</h4>
                                    <p>+1 (555) 123-4567</p>
                                    <span>Monday - Friday, 9 AM - 6 PM EST</span>
                                </div>
                            </div>

                            <div class="contact-method">
                                <div class="contact-icon">
                                    <i class="fas fa-map-marker-alt"></i>
                                </div>
                                <div class="contact-details">
                                    <h4>Office Address</h4>
                                    <p>123 Education Street<br>Cambridge, MA 02139</p>
                                    <span>Visit us during business hours</span>
                                </div>
                            </div>

                            <div class="contact-method">
                                <div class="contact-icon">
                                    <i class="fas fa-comments"></i>
                                </div>
                                <div class="contact-details">
                                    <h4>Live Chat</h4>
                                    <p>Available on our website</p>
                                    <span>24/7 automated support</span>
                                </div>
                            </div>
                        </div>

                        <div class="social-contact">
                            <h4>Follow Us</h4>
                            <div class="social-links">
                                <a href="#" class="social-link" aria-label="Facebook">
                                    <i class="fab fa-facebook"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="Twitter">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="LinkedIn">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="Instagram">
                                    <i class="fab fa-instagram"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- FAQ Section -->
                    <div class="faq-section">
                        <h3>Frequently Asked Questions</h3>
                        <div class="faq-list">
                            <div class="faq-item">
                                <button class="faq-question" onclick="toggleFAQ(this)">
                                    <span>How do I reset my password?</span>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                                <div class="faq-answer">
                                    <p>You can reset your password by clicking the "Forgot Password" link on the login page. We'll send you a reset link via email.</p>
                                </div>
                            </div>

                            <div class="faq-item">
                                <button class="faq-question" onclick="toggleFAQ(this)">
                                    <span>How do I update my profile information?</span>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                                <div class="faq-answer">
                                    <p>Navigate to your profile page and click the "Edit Profile" button. You can update your personal information, academic details, and more.</p>
                                </div>
                            </div>

                            <div class="faq-item">
                                <button class="faq-question" onclick="toggleFAQ(this)">
                                    <span>Is my data secure on StudentHub?</span>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                                <div class="faq-answer">
                                    <p>Yes, we use industry-standard encryption and security measures to protect your personal information. Your data is never shared with third parties without your consent.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="contact-form-section">
                    <div class="contact-form-card">
                        <div class="form-header">
                            <h2>Send us a Message</h2>
                            <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                            
                            <?php if ($success && !$is_ajax): ?>
                                <div class="success-message">
                                    <div class="success-content">
                                        <i class="fas fa-check-circle"></i>
                                        <span>Your message has been sent successfully!</span>
                                    </div>
                                </div>
                            <?php endif; ?>
                            
                            <?php if (isset($errors['database']) && !$is_ajax): ?>
                                <div class="error-message">
                                    <div class="error-content">
                                        <i class="fas fa-exclamation-circle"></i>
                                        <span><?php echo htmlspecialchars($errors['database']); ?></span>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>

                        <form class="contact-form" id="contact-form" method="POST">
                            <div class="form-row">
                                <div class="form-group <?php echo isset($errors['first_name']) ? 'error' : ''; ?>">
                                    <label for="first_name" class="form-label">
                                        <i class="fas fa-user"></i>
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        class="form-input"
                                        required
                                        placeholder="Your first name"
                                        value="<?php echo htmlspecialchars($first_name ?? ''); ?>"
                                    >
                                    <?php if (isset($errors['first_name'])): ?>
                                        <small class="error-message"><?php echo htmlspecialchars($errors['first_name']); ?></small>
                                    <?php endif; ?>
                                </div>

                                <div class="form-group <?php echo isset($errors['last_name']) ? 'error' : ''; ?>">
                                    <label for="last_name" class="form-label">
                                        <i class="fas fa-user"></i>
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        class="form-input"
                                        required
                                        placeholder="Your last name"
                                        value="<?php echo htmlspecialchars($last_name ?? ''); ?>"
                                    >
                                    <?php if (isset($errors['last_name'])): ?>
                                        <small class="error-message"><?php echo htmlspecialchars($errors['last_name']); ?></small>
                                    <?php endif; ?>
                                </div>
                            </div> 
                            
                            <!-- end -->

                            <div class="form-group <?php echo isset($errors['email']) ? 'error' : ''; ?>">
                                <label for="email" class="form-label">
                                    <i class="fas fa-envelope"></i>
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    class="form-input"
                                    required
                                    placeholder="your.email@example.com"
                                    value="<?php echo htmlspecialchars($email ?? ''); ?>"
                                >
                                <?php if (isset($errors['email'])): ?>
                                    <small class="error-message"><?php echo htmlspecialchars($errors['email']); ?></small>
                                <?php endif; ?>
                            </div>

                            <div class="form-group <?php echo isset($errors['subject']) ? 'error' : ''; ?>">
                                <label for="subject" class="form-label">
                                    <i class="fas fa-tag"></i>
                                    Subject *
                                </label>
                                <select id="subject" name="subject" class="form-select" required>
                                    <option value="">Select a subject</option>
                                    <option value="general" <?php echo ($subject ?? '') === 'general' ? 'selected' : ''; ?>>General Inquiry</option>
                                    <option value="technical" <?php echo ($subject ?? '') === 'technical' ? 'selected' : ''; ?>>Technical Support</option>
                                    <option value="account" <?php echo ($subject ?? '') === 'account' ? 'selected' : ''; ?>>Account Issues</option>
                                    <option value="feature" <?php echo ($subject ?? '') === 'feature' ? 'selected' : ''; ?>>Feature Request</option>
                                    <option value="bug" <?php echo ($subject ?? '') === 'bug' ? 'selected' : ''; ?>>Bug Report</option>
                                    <option value="billing" <?php echo ($subject ?? '') === 'billing' ? 'selected' : ''; ?>>Billing Question</option>
                                    <option value="other" <?php echo ($subject ?? '') === 'other' ? 'selected' : ''; ?>>Other</option>
                                </select>
                                <?php if (isset($errors['subject'])): ?>
                                    <small class="error-message"><?php echo htmlspecialchars($errors['subject']); ?></small>
                                <?php endif; ?>
                            </div>

                            <div class="form-group">
                                <label for="priority" class="form-label">
                                    <i class="fas fa-exclamation-circle"></i>
                                    Priority Level
                                </label>
                                <select id="priority" name="priority" class="form-select">
                                    <option value="low" <?php echo ($priority ?? '') === 'low' ? 'selected' : ''; ?>>Low - General question</option>
                                    <option value="medium" <?php echo ($priority ?? 'medium') === 'medium' ? 'selected' : ''; ?>>Medium - Standard inquiry</option>
                                    <option value="high" <?php echo ($priority ?? '') === 'high' ? 'selected' : ''; ?>>High - Urgent issue</option>
                                    <option value="critical" <?php echo ($priority ?? '') === 'critical' ? 'selected' : ''; ?>>Critical - Service disruption</option>
                                </select>
                            </div>

                            <div class="form-group <?php echo isset($errors['message']) ? 'error' : ''; ?>">
                                <label for="message" class="form-label">
                                    <i class="fas fa-comment-alt"></i>
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    class="form-textarea"
                                    required
                                    placeholder="Please describe your inquiry in detail..."
                                    rows="6"
                                    minlength="10"
                                ><?php echo htmlspecialchars($message ?? ''); ?></textarea>
                                <div class="character-count">
                                    <span id="char-count"><?php echo strlen($message ?? ''); ?></span> / 1000 characters
                                </div>
                                <?php if (isset($errors['message'])): ?>
                                    <small class="error-message"><?php echo htmlspecialchars($errors['message']); ?></small>
                                <?php endif; ?>
                            </div>

                            <!-- Rating Section -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-star"></i>
                                    Rate Your Experience with StudentHub
                                </label>
                                <div class="rating-container">
                                    <div class="star-rating" id="experience-rating">
                                        <?php for ($i = 5; $i >= 1; $i--): ?>
                                            <input type="radio" id="star<?php echo $i; ?>" name="experience_rating" value="<?php echo $i; ?>"
                                                <?php echo ($experience_rating ?? 0) == $i ? 'checked' : ''; ?>>
                                            <label for="star<?php echo $i; ?>" class="star">
                                                <i class="fas fa-star"></i>
                                            </label>
                                        <?php endfor; ?>
                                    </div>
                                    <div class="rating-text" id="rating-text">Click to rate your experience</div>
                                </div>
                            </div>

                            <!-- Service Rating -->
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-thumbs-up"></i>
                                    How likely are you to recommend StudentHub?
                                </label>
                                <div class="recommendation-rating">
                                    <div class="rating-scale">
                                        <div class="scale-labels">
                                            <span>Not likely</span>
                                            <span>Very likely</span>
                                        </div>
                                        <div class="scale-numbers">
                                            <?php for ($i = 1; $i <= 10; $i++): ?>
                                                <input type="radio" id="rec<?php echo $i; ?>" name="recommendation" value="<?php echo $i; ?>"
                                                    <?php echo ($recommendation_score ?? 0) == $i ? 'checked' : ''; ?>>
                                                <label for="rec<?php echo $i; ?>"><?php echo $i; ?></label>
                                            <?php endfor; ?>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="checkbox-group">
                                    <input type="checkbox" id="updates" name="updates" value="1"
                                        <?php echo ($wants_updates ?? 0) ? 'checked' : ''; ?>>
                                    <label for="updates" class="checkbox-label">
                                        I would like to receive updates about new features and improvements
                                    </label>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="checkbox-group">
                                    <input type="checkbox" id="newsletter" name="newsletter" value="1"
                                        <?php echo ($wants_newsletter ?? 0) ? 'checked' : ''; ?>>
                                    <label for="newsletter" class="checkbox-label">
                                        Subscribe to our monthly newsletter
                                    </label>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary btn-full">
                                <i class="fas fa-paper-plane"></i>
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="../Js/main.js"></script>
    <script src="../Js/theme.js"></script>
    <script src="../Js/contact.js"></script>
</body>
</html>

<?php include './footer.php'; ?>