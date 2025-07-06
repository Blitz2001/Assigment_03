<?php

$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "assigment_03";

$conn = new mysqli($db_server, $db_user, $db_pass, $db_name); // Create connection

// Check connection
if ($conn->connect_error) 
{
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

// Check for remember me cookie
if(!isset($_SESSION["loggedin"]) && isset($_COOKIE["remember_token"])) {
    $remember_token = $_COOKIE["remember_token"];
    
    $sql = "SELECT user_id, first_name, last_name, email FROM users WHERE remember_token = ? AND remember_token_expires > NOW()";
    
    if($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("s", $remember_token);
        
        if($stmt->execute()) {
            $stmt->store_result();
            
            if($stmt->num_rows == 1) {
                $stmt->bind_result($id, $first_name, $last_name, $email);
                $stmt->fetch();
                
                // Start a new session
                session_regenerate_id();
                $_SESSION["loggedin"] = true;
                $_SESSION["user_id"] = $id;
                $_SESSION["email"] = $email;
                $_SESSION["first_name"] = $first_name;
                $_SESSION["last_name"] = $last_name;
                
                // Redirect to profile page
                header("location: profile.php");
                exit();
            }
        }
        $stmt->close();
    }
}

// Function to redirect with message
function redirectWithMessage($url, $type, $message) {
    $_SESSION['message'] = $message;
    $_SESSION['message_type'] = $type;
    header("Location: $url");
    exit();
}

function redirect($url) {
    header("Location: $url");
    exit();
}


function sanitizeInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}
?>
