<?php
    include "../db-connect.php";

    $result = $conn->query("SELECT is_open FROM store_status WHERE id = 1");

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();

        if ($row['is_open'] == 1) {
            echo json_encode(["status" => "open"]);
        } else {
            echo json_encode(["status" => "closed"]);
        }

    } else {
        echo json_encode(["status" => "closed"]);
    }
?>
