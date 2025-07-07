<?php
// config.php
$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "assigment_03";

try {
    $pdo = new PDO("mysql:host=$db_server;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

<<<<<<< HEAD
// Add MySQLi connection for compatibility
$conn = new mysqli($db_server, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

=======
>>>>>>> c89e32f3b0aee1fe3295f9c3b861477dd9301f29
function redirect($url) {
    header("Location: $url");
    exit();
}

function sanitizeInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}
<<<<<<< HEAD


=======
>>>>>>> c89e32f3b0aee1fe3295f9c3b861477dd9301f29
?>