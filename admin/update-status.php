<?php
include '../db-connect.php';

// Check if form submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $order_id = $_POST['order_id'];
    $new_status = $_POST['status'];

    // Update query
    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE order_id = ?");
    $stmt->bind_param("ss", $new_status, $order_id);
    $stmt->execute();

    $stmt->close();
    $conn->close();

    // Redirect back to dashboard
    header("Location: admin-dashboard.php");
    exit;
}
?>
