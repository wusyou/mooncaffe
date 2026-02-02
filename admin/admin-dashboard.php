<?php
session_start();
include '../db-connect.php';

// SESSION CHECK
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: admin-login.html");
    exit;
}

// GET ALL ORDERS
$result = $conn->query("SELECT * FROM orders ORDER BY created_at DESC");

$storeQ = $conn->query("SELECT is_open FROM store_status LIMIT 1");
$storeData = $storeQ->fetch_assoc();
$isStoreOpen = $storeData['is_open'];

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="../photo/logo.png">
    <title>Admin Dashboard | Moon Caffe</title>
    <link rel="stylesheet" href="admin-style.css">
</head>
<body>

<!-- SIDEBAR -->
<div class="sidebar">
    <img src="../photo/logo.png" width="100px" style="margin-left: 60px;">
    <h2>Moon Caffe | Admin</h2><hr>
    <div class="store-status-box">
        <h3>Store Status</h3>

        <div class="store-row">
            <label class="switch">
                <input type="checkbox" id="storeToggle" <?= ($isStoreOpen ? 'checked' : '') ?>>
                <span class="slider"></span>
            </label>

            <span id="storeStatusText" class="status-text">
                <?= ($isStoreOpen ? 'OPEN' : 'CLOSED') ?>
            </span>
        </div>

    </div>
    <a href="admin-dashboard.php" class="active">Orders</a>
    <a href="admin-login.php" class="logout">Logout</a>
</div>

<!-- MAIN CONTENT -->
<div class="main-content">
    
    <div class="header">
        <h1>Order Management</h1>
        <p>Welcome, Admin!</p>
    </div>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                <?php while ($row = $result->fetch_assoc()): ?>

                    <?php 
                        // Decode items JSON into array
                        $itemsArray = json_decode($row['items'], true);

                        // Build readable item list
                        $itemList = "";
                        if (is_array($itemsArray)) {
                            foreach ($itemsArray as $item) {
                                $itemList .= $item["qty"] . "x " . $item["name"] . "<br>";
                            }
                        }
                    ?>

                    <tr>
                        <td><?= $row['order_id'] ?></td>
                        <td><?= $row['customer_name'] ?></td>
                        <td><?= $row['customer_contact'] ?></td>
                        <td><?= $row['customer_address'] ?></td>

                        <!-- ITEMS COLUMN -->
                        <td><?= $itemList ?></td>

                        <td>
                            <span class="status <?= strtolower(str_replace(' ', '-', $row['status'])) ?>">
                                <?= $row['status'] ?>
                            </span>
                        </td>

                        <td>₱<?= number_format($row['total'], 2) ?></td>
                        <td><?= $row['created_at'] ?></td>

                        <td class="action-cell">
                            <form method="POST" action="update-status.php" class="action-form">
                                
                                <select name="status">
                                    <option value="Pending"           <?= ($row['status'] == "Pending") ? "selected" : "" ?>>Pending</option>
                                    <option value="Preparing"         <?= ($row['status'] == "Preparing") ? "selected" : "" ?>>Preparing</option>
                                    <option value="Out for Delivery"  <?= ($row['status'] == "Out for Delivery") ? "selected" : "" ?>>Out for Delivery</option>
                                    <option value="Delivered"         <?= ($row['status'] == "Delivered") ? "selected" : "" ?>>Delivered</option>
                                </select>

                                <input type="hidden" name="order_id" value="<?= $row['order_id']; ?>">


                                <button type="submit" class="update-btn">Update</button>

                            </form>
                        </td>

                    </tr>

                <?php endwhile; ?>
                </tbody>


        </table>
    </div>

</div>

<script>
document.getElementById("storeToggle").addEventListener("change", function() {

    let isOpen = this.checked ? 1 : 0;

    // Update text instantly
    document.getElementById("storeStatusText").textContent = isOpen ? "OPEN" : "CLOSED";

    // Send update request silently to PHP
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "update-store-status.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("is_open=" + isOpen);
});
</script>

</body>
</html>
