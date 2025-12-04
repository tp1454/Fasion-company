<?php
/**
 * User Profile API
 * GET: Lấy thông tin profile
 * PUT: Cập nhật thông tin profile
 */

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
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

$userId = $_SESSION['user_id'];

// GET - Lấy thông tin profile
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("
            SELECT id, email, fullname, phone, role, avatar, created_at
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            exit;
        }
        
        // Normalize field names for frontend
        $response = [
            'id' => $user['id'],
            'email' => $user['email'],
            'full_name' => $user['fullname'],
            'role' => $user['role'],
            'created_at' => $user['created_at'],
            'phone' => $user['phone'],
            'avatar' => $user['avatar'],
            'avatar_url' => $user['avatar'] ? 'http://localhost/Fashion-company/backend/uploads/avatars/' . $user['avatar'] : null,
            'status' => 'active',
            'email_verified' => 1
        ];
        
        echo json_encode($response);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

// PUT - Cập nhật thông tin profile
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        exit;
    }
    
    // Validation
    $errors = [];
    
    $nameError = validateRequired($data['full_name'] ?? '', 'Họ tên');
    if ($nameError) {
        $errors['full_name'] = $nameError;
    }
    
    if (!empty($data['phone'])) {
        $phoneError = validatePhone($data['phone']);
        if ($phoneError) {
            $errors['phone'] = $phoneError;
        }
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("
            UPDATE users 
            SET fullname = ?, phone = ?
            WHERE id = ?
        ");
        
        $stmt->execute([
            $data['full_name'],
            $data['phone'] ?? null,
            $userId
        ]);
        
        // Update session
        $_SESSION['user_name'] = $data['full_name'];
        
        echo json_encode([
            'success' => true,
            'message' => 'Cập nhật thông tin thành công'
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
