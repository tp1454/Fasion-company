<?php
/**
 * Change Password API
 * PUT: Đổi mật khẩu
 */

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';
require_once '../../includes/session.php';
require_once '../../includes/validation.php';

startSecureSession();
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$userId = $_SESSION['user_id'];
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Validation
$errors = [];

if (empty($data['current_password'])) {
    $errors['current_password'] = 'Vui lòng nhập mật khẩu hiện tại';
}

$newPasswordError = validatePassword($data['new_password'] ?? '');
if ($newPasswordError) {
    $errors['new_password'] = $newPasswordError;
}

if (empty($data['new_password_confirm'])) {
    $errors['new_password_confirm'] = 'Vui lòng xác nhận mật khẩu mới';
} elseif ($data['new_password'] !== $data['new_password_confirm']) {
    $errors['new_password_confirm'] = 'Mật khẩu xác nhận không khớp';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['errors' => $errors]);
    exit;
}

try {
    // Get current password from database
    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        exit;
    }
    
    // Verify current password
    if (!password_verify($data['current_password'], $user['password_hash'])) {
        http_response_code(400);
        echo json_encode(['errors' => ['current_password' => 'Mật khẩu hiện tại không đúng']]);
        exit;
    }
    
    // Hash new password
    $hashedPassword = password_hash($data['new_password'], PASSWORD_BCRYPT);
    
    // Update password
    $stmt = $pdo->prepare("
        UPDATE users 
        SET password_hash = ?
        WHERE id = ?
    ");
    
    $stmt->execute([$hashedPassword, $userId]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Đổi mật khẩu thành công'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
