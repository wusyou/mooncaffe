<?php
session_start();
include '../db-connect.php';

// SECURITY CHECK
if (!isset($_SESSION['admin_logged_in'])) {
    echo "UNAUTHORIZED";
    exit;
}

// Validate input
if (!isset($_POST['is_open'])) {
    echo "INVALID";
    exit;
}

$is_open = intval($_POST['is_open']); // 1 or 0 only

// Update database
$query = "UPDATE store_status SET is_open = $is_open LIMIT 1";

if ($conn->query($query)) {
    echo "SUCCESS";
} else {
    echo "ERROR";
}
?>
