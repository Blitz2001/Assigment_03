<?php
// Include config file
require_once "../Includes/config.php";

// Initialize variables
$errors = [];
$input = [
    'first_name' => '',
    'last_name' => '',
    'email' => '',
    'student_id' => '',
    'university' => '',
    'major' => '',
    'year' => '',
    'phone' => ''
];

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate and sanitize inputs
    $input['first_name'] = sanitizeInput($_POST['first_name'] ?? '');
    $input['last_name'] = sanitizeInput($_POST['last_name'] ?? '');
    $input['email'] = sanitizeInput($_POST['email'] ?? '');
    $input['student_id'] = sanitizeInput($_POST['student_id'] ?? '');
    $input['university'] = sanitizeInput($_POST['university'] ?? '');
    $input['major'] = sanitizeInput($_POST['major'] ?? '');
    $input['year'] = sanitizeInput($_POST['year'] ?? '');
    $input['phone'] = sanitizeInput($_POST['phone'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $terms = $_POST['terms'] ?? false;

    // Validate inputs (same validation code as before)
    // ...

    // If no errors, proceed with registration
    if (empty($errors)) {
        // Begin transaction
        $conn->begin_transaction();

        try {
            // Hash password
            $password_hash = password_hash($password, PASSWORD_DEFAULT);

            // Insert user - CORRECTED QUERY
            $stmt = $conn->prepare("INSERT INTO users 
                                  (first_name, last_name, email, password_hash, student_id, university, major, academic_year, phone, is_verified, created_at, updated_at) 
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())");
            
            $stmt->bind_param("sssssssss", 
                $input['first_name'],
                $input['last_name'],
                $input['email'],
                $password_hash,
                $input['student_id'],
                $input['university'],
                $input['major'],
                $input['year'],
                $input['phone']
            );
            
            if (!$stmt->execute()) {
                throw new Exception("Error creating user: " . $stmt->error);
            }
            
            $user_id = $conn->insert_id;
            $stmt->close();

            // Create profile
            $year_mapping = [
                'Freshman' => 4,
                'Sophomore' => 3,
                'Junior' => 2,
                'Senior' => 1,
                'Graduate' => 2,
                'PhD' => 4
            ];
            
            $years_to_add = $year_mapping[$input['year']] ?? 4;
            $graduation_year = date('Y') + $years_to_add;
            $profile_title = $input['year'] . " in " . $input['major'];
            
            $stmt = $conn->prepare("INSERT INTO profiles (user_id, title, expected_graduation) 
                                   VALUES (?, ?, ?)");
            $stmt->bind_param("iss", $user_id, $profile_title, $graduation_year);
            
            if (!$stmt->execute()) {
                throw new Exception("Error creating profile: " . $stmt->error);
            }
            $stmt->close();

            // Commit transaction
            $conn->commit();

            // Set session variables
            $_SESSION['registration_success'] = true;
            $_SESSION['registered_email'] = $input['email'];

            // Redirect to login page
            header("Location: login.php");
            exit();

        } catch (Exception $e) {
            // Rollback transaction on error
            $conn->rollback();
            $errors['general'] = "Registration failed. Please try again later.";
            error_log("Registration error: " . $e->getMessage());
        }
    }
}

// Include header and navigation
include './navbar.php';
?>




<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Register</title>
    <link rel="stylesheet" href="../Styles/styles.css">
    <link rel="stylesheet" href="../Styles/auth.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <main class="auth-main">
        <div class="auth-container">
            <div class="auth-visual">
                <div class="auth-visual-content">
                    <h2>Join Our Community</h2>
                    <p>Create your account and unlock access to powerful student management tools and features.</p>
                    <!-- Visual content remains the same -->
                </div>
            </div>

            <div class="auth-form-section">
                <div class="auth-form-container">
                    <div class="auth-header">
                        <h1>Create Account</h1>
                        <p>Enter your information to create your StudentHub account</p>
                    </div>

                    <?php if (!empty($errors['general'])): ?>
                        <div class="alert alert-danger"><?php echo $errors['general']; ?></div>
                    <?php endif; ?>

                    <form class="auth-form" id="register-form" action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="POST">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="first_name" class="form-label">
                                    <i class="fas fa-user"></i>
                                    First Name *
                                </label>
                                <input type="text" id="first_name" name="first_name" 
                                       class="form-input <?php echo !empty($errors['first_name']) ? 'is-invalid' : ''; ?>"
                                       value="<?php echo $input['first_name']; ?>"
                                       required placeholder="Enter your first name">
                                <?php if (!empty($errors['first_name'])): ?>
                                    <div class="form-error"><?php echo $errors['first_name']; ?></div>
                                <?php endif; ?>
                            </div>

                            <div class="form-group">
                                <label for="last_name" class="form-label">
                                    <i class="fas fa-user"></i>
                                    Last Name *
                                </label>
                                <input type="text" id="last_name" name="last_name" 
                                       class="form-input <?php echo !empty($errors['last_name']) ? 'is-invalid' : ''; ?>"
                                       value="<?php echo $input['last_name']; ?>"
                                       required placeholder="Enter your last name">
                                <?php if (!empty($errors['last_name'])): ?>
                                    <div class="form-error"><?php echo $errors['last_name']; ?></div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="email" class="form-label">
                                <i class="fas fa-envelope"></i>
                                Email Address *
                            </label>
                            <input type="email" id="email" name="email" 
                                   class="form-input <?php echo !empty($errors['email']) ? 'is-invalid' : ''; ?>"
                                   value="<?php echo $input['email']; ?>"
                                   required placeholder="Enter your email address">
                            <?php if (!empty($errors['email'])): ?>
                                <div class="form-error"><?php echo $errors['email']; ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="form-group">
                            <label for="student_id" class="form-label">
                                <i class="fas fa-id-card"></i>
                                Student ID *
                            </label>
                            <input type="text" id="student_id" name="student_id" 
                                   class="form-input <?php echo !empty($errors['student_id']) ? 'is-invalid' : ''; ?>"
                                   value="<?php echo $input['student_id']; ?>"
                                   required placeholder="Enter your student ID">
                            <?php if (!empty($errors['student_id'])): ?>
                                <div class="form-error"><?php echo $errors['student_id']; ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="form-group">
                            <label for="university" class="form-label">
                                <i class="fas fa-university"></i>
                                University *
                            </label>
                            <select id="university" name="university" 
                                    class="form-select <?php echo !empty($errors['university']) ? 'is-invalid' : ''; ?>" required>
                                <option value="">Select your university</option>
                                <option value="Harvard University" <?php echo $input['university'] == "Harvard University" ? 'selected' : ''; ?>>Harvard University</option>
                                <option value="Stanford University" <?php echo $input['university'] == "Stanford University" ? 'selected' : ''; ?>>Stanford University</option>
                                <option value="Massachusetts Institute of Technology" <?php echo $input['university'] == "Massachusetts Institute of Technology" ? 'selected' : ''; ?>>Massachusetts Institute of Technology</option>
                                <option value="Yale University" <?php echo $input['university'] == "Yale University" ? 'selected' : ''; ?>>Yale University</option>
                                <option value="Princeton University" <?php echo $input['university'] == "Princeton University" ? 'selected' : ''; ?>>Princeton University</option>
                            </select>
                            <?php if (!empty($errors['university'])): ?>
                                <div class="form-error"><?php echo $errors['university']; ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="form-group">
                            <label for="major" class="form-label">
                                <i class="fas fa-book"></i>
                                Major/Field of Study *
                            </label>
                            <input type="text" id="major" name="major" 
                                   class="form-input <?php echo !empty($errors['major']) ? 'is-invalid' : ''; ?>"
                                   value="<?php echo $input['major']; ?>"
                                   required placeholder="e.g., Computer Science">
                            <?php if (!empty($errors['major'])): ?>
                                <div class="form-error"><?php echo $errors['major']; ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="year" class="form-label">
                                    <i class="fas fa-calendar"></i>
                                    Academic Year *
                                </label>
                                <select id="year" name="year" 
                                        class="form-select <?php echo !empty($errors['year']) ? 'is-invalid' : ''; ?>" required>
                                    <option value="">Select year</option>
                                    <option value="Freshman" <?php echo $input['year'] == "Freshman" ? 'selected' : ''; ?>>Freshman (1st Year)</option>
                                    <option value="Sophomore" <?php echo $input['year'] == "Sophomore" ? 'selected' : ''; ?>>Sophomore (2nd Year)</option>
                                    <option value="Junior" <?php echo $input['year'] == "Junior" ? 'selected' : ''; ?>>Junior (3rd Year)</option>
                                    <option value="Senior" <?php echo $input['year'] == "Senior" ? 'selected' : ''; ?>>Senior (4th Year)</option>
                                    <option value="Graduate" <?php echo $input['year'] == "Graduate" ? 'selected' : ''; ?>>Graduate Student</option>
                                    <option value="PhD" <?php echo $input['year'] == "PhD" ? 'selected' : ''; ?>>PhD Candidate</option>
                                </select>
                                <?php if (!empty($errors['year'])): ?>
                                    <div class="form-error"><?php echo $errors['year']; ?></div>
                                <?php endif; ?>
                            </div>

                            <div class="form-group">
                                <label for="phone" class="form-label">
                                    <i class="fas fa-phone"></i>
                                    Phone Number
                                </label>
                                <input type="tel" id="phone" name="phone" 
                                       class="form-input <?php echo !empty($errors['phone']) ? 'is-invalid' : ''; ?>"
                                       value="<?php echo $input['phone']; ?>"
                                       placeholder="(555) 123-4567">
                                <?php if (!empty($errors['phone'])): ?>
                                    <div class="form-error"><?php echo $errors['phone']; ?></div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="password" class="form-label">
                                <i class="fas fa-lock"></i>
                                Password *
                            </label>
                            <div class="password-input-container">
                                <input type="password" id="password" name="password" 
                                       class="form-input <?php echo !empty($errors['password']) ? 'is-invalid' : ''; ?>"
                                       required placeholder="Create a strong password" minlength="8">
                                <button type="button" class="password-toggle-btn" aria-label="Toggle password visibility">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="password-requirements">
                                <small>Password must be at least 8 characters long</small>
                            </div>
                            <?php if (!empty($errors['password'])): ?>
                                <div class="form-error"><?php echo $errors['password']; ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="form-group">
                            <label for="confirm_password" class="form-label">
                                <i class="fas fa-lock"></i>
                                Confirm Password *
                            </label>
                            <div class="password-input-container">
                                <input type="password" id="confirm_password" name="confirm_password" 
                                       class="form-input <?php echo !empty($errors['confirm_password']) ? 'is-invalid' : ''; ?>"
                                       required placeholder="Confirm your password">
                                <button type="button" class="password-toggle-btn" aria-label="Toggle password visibility">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <?php if (!empty($errors['confirm_password'])): ?>
                                <div class="form-error"><?php echo $errors['confirm_password']; ?></div>
                            <?php endif; ?>
                        </div>

                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="terms" name="terms" 
                                       class="<?php echo !empty($errors['terms']) ? 'is-invalid' : ''; ?>" 
                                       required <?php echo isset($_POST['terms']) ? 'checked' : ''; ?>>
                                <label for="terms" class="checkbox-label">
                                    I agree to the <a href="#" class="link">Terms of Service</a> and <a href="#" class="link">Privacy Policy</a> *
                                </label>
                                <?php if (!empty($errors['terms'])): ?>
                                    <div class="form-error"><?php echo $errors['terms']; ?></div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary btn-full">
                            <i class="fas fa-user-plus"></i>
                            Create Account
                        </button>
                    </form>

                    <div class="auth-footer">
                        <p>Already have an account? <a href="login.php" class="link">Sign in here</a></p>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loading-overlay">
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Creating your account...</p>
        </div>
    </div>

    <script src="../Js/main.js"></script>
    <script src="../Js/theme.js"></script>
    <script src="../Js/auth.js"></script>
</body>
</html>

<?php
include './footer.php';
?>