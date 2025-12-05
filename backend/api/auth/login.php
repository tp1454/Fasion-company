<?php
/**
 * Login API
 * Đăng nhập vào hệ thống
 */

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/db.php';
require_once '../../includes/session.php';

startSecureSession();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get input data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Validation
if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email và mật khẩu không được để trống']);
    exit;
}

try {
    // Get user by email
    $stmt = $pdo->prepare("SELECT id, email, password_hash, fullname, role, avatar, status FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Verify password
    if (!$user || !password_verify($data['password'], $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Email hoặc mật khẩu không đúng']);
        exit;
    }
    
    // Check if account is locked (if column exists)
    if (isset($user['status']) && $user['status'] === 'locked') {
        http_response_code(403);
        echo json_encode(['error' => 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.']);
        exit;
    }
    
    // Normalize user data for session
    $normalizedUser = [
        'id' => $user['id'],
        'email' => $user['email'],
        'full_name' => $user['fullname'] ?? '',
        'role' => $user['role'],
        'avatar' => $user['avatar'] ?? null
    ];
    
    // Login user (save to session)
    loginUser($normalizedUser);
    
    // Return user data
    echo json_encode([
        'success' => true,
        'user' => $normalizedUser
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Lỗi server: ' . $e->getMessage()]);
}
