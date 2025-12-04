<?php
require __DIR__ . '/../config/db.php';
header('Content-Type: application/json; charset=utf-8');

$stmt = $pdo->query('SELECT id, name, price, image FROM products ORDER BY created_at DESC LIMIT 100');
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($rows);
