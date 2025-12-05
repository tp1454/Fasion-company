<?php
/**
 * Register API
 * Đăng ký tài khoản mới
 */

// CORS Headers - Must be first!
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400'); // Cache preflight for 24 hours
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once '../../config/db.php';
require_once '../../includes/validation.php';

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
$errors = [];

// Validate email
$emailError = validateEmail($data['email'] ?? '');
if ($emailError) {
    $errors['email'] = $emailError;
}

// Validate password
$passwordError = validatePassword($data['password'] ?? '');
if ($passwordError) {
    $errors['password'] = $passwordError;
}

// Validate full name
$nameError = validateRequired($data['full_name'] ?? '', 'Họ tên');
if ($nameError) {
    $errors['full_name'] = $nameError;
}

// Validate phone (optional)
if (!empty($data['phone'])) {
    $phoneError = validatePhone($data['phone']);
    if ($phoneError) {
        $errors['phone'] = $phoneError;
    }
}

// Validate password confirmation
if (empty($data['password_confirm'])) {
    $errors['password_confirm'] = 'Vui lòng xác nhận mật khẩu';
} elseif ($data['password'] !== $data['password_confirm']) {
    $errors['password_confirm'] = 'Mật khẩu xác nhận không khớp';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['errors' => $errors]);
    exit;
}

// Check if email already exists
try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$data['email']]);
    
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['errors' => ['email' => 'Email đã được sử dụng']]);
        exit;
    }
    
    // Hash password
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    
    // Insert new user
    $stmt = $pdo->prepare("
        INSERT INTO users (email, password_hash, fullname, phone, role)
        VALUES (?, ?, ?, ?, 'customer')
    ");

    $stmt->execute([
        $data['email'],
        $hashedPassword,
        $data['full_name'],
        $data['phone'] ?? null
    ]);    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Đăng ký thành công. Vui lòng đăng nhập.'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Lỗi khi tạo tài khoản: ' . $e->getMessage()]);
}
