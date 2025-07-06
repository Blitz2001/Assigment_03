<?php
require_once '../Includes/config.php';

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Check if form is submitted
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

    // Get user_id if logged in (you need to implement session handling)
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;

    // Validate inputs
    if (empty($first_name)) {
        $response['errors']['first_name'] = 'First name is required';
    }

    if (empty($last_name)) {
        $response['errors']['last_name'] = 'Last name is required';
    }

    if (empty($email)) {
        $response['errors']['email'] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = 'Please enter a valid email address';
    }

    if (empty($subject)) {
        $response['errors']['subject'] = 'Subject is required';
    }

    if (empty($message)) {
        $response['errors']['message'] = 'Message is required';
    } elseif (strlen($message) < 10) {
        $response['errors']['message'] = 'Message should be at least 10 characters long';
    }

    // If no errors, proceed with database insertion
    if (empty($response['errors'])) {
        try {
            // Prepare SQL statement
            $stmt = $conn->prepare("INSERT INTO contact_submissions 
                                  (user_id, first_name, last_name, email, subject, priority, message, 
                                   experience_rating, recommendation_score, wants_updates, wants_newsletter)
                                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            
            // Bind parameters
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
            
            // Execute query
            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = 'Your message has been sent successfully!';
                
                // Handle newsletter subscription if requested
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
                $response['message'] = 'Error submitting your message. Please try again.';
            }
            
            $stmt->close();
        } catch (Exception $e) {
            $response['message'] = 'Database error: ' . $e->getMessage();
        }
    }
} else {
    $response['message'] = 'Invalid request method';
}

// Close database connection
$conn->close();

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
exit;
?>