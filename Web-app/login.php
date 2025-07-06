<?php
include './navbar.php';

// Initialize the session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if(isset($_SESSION['registration_success'])) {
    echo '<div class="alert alert-success">Registration successful! Please log in.</div>';
    unset($_SESSION['registration_success']);
}

// Include config file
require_once '../Includes/config.php';

// Define variables and initialize with empty values
$email = $password = "";
$email_err = $password_err = $login_err = "";

// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST") {

    // Check if email is empty
    if(empty(trim($_POST["email"]))) {
        $email_err = "Please enter your email.";
    } else {
        $email = trim($_POST["email"]);
    }

    // Check if password is empty
    if(empty(trim($_POST["password"]))) {
        $password_err = "Please enter your password.";
    } else {
        $password = trim($_POST["password"]);
    }

    // Validate credentials
    if(empty($email_err) && empty($password_err)) {
        // Prepare a select statement
        $sql = "SELECT user_id, first_name, last_name, email, password_hash FROM users WHERE email = ?";
        
        if($stmt = $conn->prepare($sql)) {
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param("s", $param_email);
            
            // Set parameters
            $param_email = $email;
            
            // Attempt to execute the prepared statement
            if($stmt->execute()) {
                // Store result
                $stmt->store_result();
                
                // Check if email exists, if yes then verify password
                if($stmt->num_rows == 1) {                    
                    // Bind result variables
                    $stmt->bind_result($id, $first_name, $last_name, $email, $hashed_password);
                    if($stmt->fetch()) {
                        if(password_verify($password, $hashed_password)) {
                            // Password is correct, so start a new session
                            session_regenerate_id();
                            
                            // Store data in session variables
                            $_SESSION["loggedin"] = true;
                            $_SESSION["user_id"] = $id;
                            $_SESSION["email"] = $email;                            
                            $_SESSION["first_name"] = $first_name;
                            $_SESSION["last_name"] = $last_name;
                            
                            // Redirect user to profile page
                            header("location: profile.php");
                            exit();
                        } else {
                            // Password is not valid, display a generic error message
                            $login_err = "Invalid email or password.";
                        }
                    }
                } else {
                    // Email doesn't exist, display a generic error message
                    $login_err = "Invalid email or password.";
                }
            } else {
                echo "Oops! Something went wrong. Please try again later.";
            }

            // Close statement
            $stmt->close();
        }
    }
    
    // Close connection
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Login</title>
    <link rel="stylesheet" href="../Styles/styles.css">
    <link rel="stylesheet" href="../Styles/auth.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Main Content -->
    <main class="auth-main">
        <div class="auth-container">
            <div class="auth-visual">
                <div class="auth-visual-content">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your StudentHub account to access your profile, manage your information, and connect with the community.</p>

                    <div class="auth-features">
                        <div class="auth-feature">
                            <div class="auth-feature-icon">
                                <i class="fas fa-lock"></i>
                            </div>
                            <div class="auth-feature-content">
                                <h4>Secure Login</h4>
                                <p>Your account is protected with advanced security measures</p>
                            </div>
                        </div>

                        <div class="auth-feature">
                            <div class="auth-feature-icon">
                                <i class="fas fa-tachometer-alt"></i>
                            </div>
                            <div class="auth-feature-content">
                                <h4>Quick Access</h4>
                                <p>Instant access to your dashboard and profile</p>
                            </div>
                        </div>

                        <div class="auth-feature">
                            <div class="auth-feature-icon">
                                <i class="fas fa-sync-alt"></i>
                            </div>
                            <div class="auth-feature-content">
                                <h4>Stay Synced</h4>
                                <p>Your data is always up-to-date across all devices</p>
                            </div>
                        </div>
                    </div>

                    <div class="auth-stats">
                        <div class="auth-stat">
                            <div class="auth-stat-number">10K+</div>
                            <div class="auth-stat-label">Active Users</div>
                        </div>
                        <div class="auth-stat">
                            <div class="auth-stat-number">99.9%</div>
                            <div class="auth-stat-label">Uptime</div>
                        </div>
                        <div class="auth-stat">
                            <div class="auth-stat-number">24/7</div>
                            <div class="auth-stat-label">Support</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="auth-form-section">
                <div class="auth-form-container">
                    <div class="auth-header">
                        <h1>Sign In</h1>
                        <p>Enter your credentials to access your account</p>
                    </div>

                        <form class="auth-form" id="login-form" action="login.php" method="POST">
                            <!-- Display login errors if any -->
                            <?php 
                            if(!empty($login_err)) {
                                echo '<div class="alert alert-danger">' . $login_err . '</div>';
                            }
                            ?>
                            
                            <div class="form-group">
                                <label for="email" class="form-label">
                                    <i class="fas fa-envelope"></i>
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    class="form-input <?php echo (!empty($email_err)) ? 'is-invalid' : ''; ?>"
                                    required
                                    placeholder="Enter your email address"
                                    autocomplete="email"
                                    value="<?php echo $email; ?>"
                                >
                                <span class="invalid-feedback"><?php echo $email_err; ?></span>
                            </div>

                            <div class="form-group">
                                <label for="password" class="form-label">
                                    <i class="fas fa-lock"></i>
                                    Password *
                                </label>
                                <div class="password-input-container">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        class="form-input <?php echo (!empty($password_err)) ? 'is-invalid' : ''; ?>"
                                        required
                                        placeholder="Enter your password"
                                        autocomplete="current-password"
                                    >
                                    <button type="button" class="password-toggle-btn" aria-label="Toggle password visibility">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <span class="invalid-feedback"><?php echo $password_err; ?></span>
                                </div>
                            </div>

                            <div class="form-options">
                                <a href="pass_reset.php" class="link forgot-password">Forgot password?</a>
                            </div>

                            <button type="submit" class="btn btn-primary btn-full">
                                <i class="fas fa-sign-in-alt"></i>
                                Sign In
                            </button>
                        </form>

                    <div class="auth-footer">
                        <p>Don't have an account? <a href="register.php" class="link">Create one here</a></p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loading-overlay">
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Signing you in...</p>
        </div>
    </div>

    <!-- Forgot Password Modal -->
    <div class="modal" id="forgot-password-modal">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Reset Password</h3>
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                <form id="forgot-password-form">
                    <div class="form-group">
                        <label for="reset-email" class="form-label">Email Address</label>
                        <input
                            type="email"
                            id="reset-email"
                            name="reset-email"
                            class="form-input"
                            required
                            placeholder="Enter your email"
                        >
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-submit">Send Reset Link</button>
            </div>
        </div>
    </div>

    <script src="../Js/main.js"></script>
    <script src="../Js/theme.js"></script>
    <script src="../Js/auth.js"></script>
    <script>
        // Forgot password functionality
        document.addEventListener('DOMContentLoaded', function() {
            const forgotPasswordLink = document.querySelector('.forgot-password');
            const forgotPasswordModal = document.getElementById('forgot-password-modal');

            if (forgotPasswordLink && forgotPasswordModal) {
                forgotPasswordLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    showForgotPasswordModal();
                });
            }

            // Modal close functionality
            const closeButtons = forgotPasswordModal.querySelectorAll('.modal-close, .modal-cancel, .modal-backdrop');
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    hideForgotPasswordModal();
                });
            });

            // Submit forgot password form
            const submitButton = forgotPasswordModal.querySelector('.modal-submit');
            if (submitButton) {
                submitButton.addEventListener('click', function() {
                    const email = document.getElementById('reset-email').value;
                    if (email) {
                        showNotification('Password reset link sent to your email!', 'success');
                        hideForgotPasswordModal();
                    } else {
                        showNotification('Please enter your email address.', 'error');
                    }
                });
            }
        });

        function showForgotPasswordModal() {
            const modal = document.getElementById('forgot-password-modal');
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }

        function hideForgotPasswordModal() {
            const modal = document.getElementById('forgot-password-modal');
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    </script>
</body>
</html>

<?php
include './footer.php';
?>