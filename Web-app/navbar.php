<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StudentHub - Home</title>
    <link rel="stylesheet" href="../Styles/styles.css">
    <link rel="stylesheet" href="../Styles/home.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Navigation Header -->
    <header class="navbar">
        <nav class="nav-container">
            <div class="nav-brand">
                <a href="index.php">
                    <i class="fas fa-graduation-cap"></i>
                    <span>StudentHub</span>
                </a>
            </div>

            <ul class="nav-menu" id="nav-menu">
                <li class="nav-item">
                    <a href="index.php" class="nav-link active">
                        <i class="fas fa-home"></i>
                        Home
                    </a>
                </li>

                <li class="nav-item">
                    <a href="profile.php" class="nav-link">
                        <i class="fas fa-user"></i>
                        Profile
                    </a>
                </li>
                <li class="nav-item">
                    <a href="contact.php" class="nav-link">
                        <i class="fas fa-envelope"></i>
                        Contact
                    </a>
                </li>

                                <li class="nav-item">
                    <a href="login.php" class="nav-link">
                        <i class="fas fa-sign-in-alt"></i>
                        Login
                    </a>
                </li>
                <li class="nav-item">
                    <a href="register.php" class="nav-link">
                        <i class="fas fa-user-plus"></i>
                        Register
                    </a>
                </li>
            </ul>

            <div class="nav-actions">
                <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                    <i class="fas fa-moon"></i>
                </button>

                
                <div class="hamburger" id="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                

                
            </div>
        </nav>
    </header>
</body>
</html>