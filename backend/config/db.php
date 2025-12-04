<?php
// Update these values
$DB_HOST = '127.0.0.1';
$DB_PORT = '3307'; // XAMPP MySQL runs on port 3307
$DB_NAME = 'fashion_company';
$DB_USER = 'root';
$DB_PASS = ''; // Empty password

try {
    $pdo = new PDO("mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error'=>'DB connection failed: '.$e->getMessage()]);
    exit;
}
