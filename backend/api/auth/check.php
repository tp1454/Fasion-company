<?php
/**
 * Check Authentication API
 * Kiểm tra trạng thái đăng nhập
 */

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../includes/session.php';

startSecureSession();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Check if user is logged in
if (isLoggedIn()) {
    $user = getCurrentUser();
    echo json_encode([
        'authenticated' => true,
        'user' => $user
    ]);
} else {
    echo json_encode([
        'authenticated' => false,
        'user' => null
    ]);
}
