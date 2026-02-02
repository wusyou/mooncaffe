<?php
    session_start();

    // Static credentials
    $valid_username = "admin";
    $valid_password = "12345";

    // Read POST values
    $username = $_POST["username"] ?? "";
    $password = $_POST["password"] ?? "";

    // Validate
    if ($username === $valid_username && $password === $valid_password) {
        $_SESSION["admin_logged_in"] = true;
        header("Location: admin-dashboard.php"); // change later
        exit;
    }

    // Failed login
    header("Location: admin-login.php?error=1");
    exit;
?>
