<?php
/**
 * Avatar Upload API
 * POST: Upload avatar
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
require_once '../../config/config.php';
require_once '../../includes/session.php';
require_once '../../includes/validation.php';

startSecureSession();
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$userId = $_SESSION['user_id'];

// Check if file was uploaded
if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] === UPLOAD_ERR_NO_FILE) {
    http_response_code(400);
    echo json_encode(['error' => 'Vui lòng chọn file ảnh']);
    exit;
}

// Validate file
$validationErrors = validateFileUpload($_FILES['avatar']);
if (!empty($validationErrors)) {
    http_response_code(400);
    echo json_encode(['errors' => ['avatar' => $validationErrors]]);
    exit;
}

try {
    // Get old avatar
    $stmt = $pdo->prepare("SELECT avatar FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    $oldAvatar = $user['avatar'];
    
    // Generate unique filename
    $extension = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
    $filename = 'avatar_' . $userId . '_' . time() . '.' . $extension;
    $filepath = AVATAR_DIR . $filename;
    
    // Move uploaded file
    if (!move_uploaded_file($_FILES['avatar']['tmp_name'], $filepath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Lỗi khi upload file']);
        exit;
    }
    
    // Update database
    $stmt = $pdo->prepare("
        UPDATE users 
        SET avatar = ?, updated_at = NOW()
        WHERE id = ?
    ");
    
    $stmt->execute([$filename, $userId]);
    
    // Delete old avatar if exists
    if ($oldAvatar && file_exists(AVATAR_DIR . $oldAvatar)) {
        unlink(AVATAR_DIR . $oldAvatar);
    }
    
    // Update session
    $_SESSION['user_avatar'] = $filename;
    
    echo json_encode([
        'success' => true,
        'message' => 'Upload avatar thành công',
        'avatar' => $filename,
        'avatar_url' => 'http://localhost/uploads/avatars/' . $filename
    ]);
    
} catch (PDOException $e) {
    // Delete uploaded file if database update fails
    if (isset($filepath) && file_exists($filepath)) {
        unlink($filepath);
    }
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
