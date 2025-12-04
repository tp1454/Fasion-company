<?php
/**
 * Session Management Functions
 * Quản lý session an toàn cho authentication
 */

// Start session với secure settings
function startSecureSession() {
    if (session_status() === PHP_SESSION_NONE) {
        // Cấu hình bảo mật cho session
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_secure', isset($_SERVER['HTTPS']));
        ini_set('session.use_only_cookies', 1);
        ini_set('session.cookie_samesite', 'Lax');
        
        // Đặt thời gian timeout (30 phút)
        ini_set('session.gc_maxlifetime', 1800);
        
        session_start();
        
        // Regenerate session ID định kỳ để tránh session fixation
        if (!isset($_SESSION['last_regeneration'])) {
            $_SESSION['last_regeneration'] = time();
        } elseif (time() - $_SESSION['last_regeneration'] > 300) { // 5 phút
            session_regenerate_id(true);
            $_SESSION['last_regeneration'] = time();
        }
    }
}

// Kiểm tra user đã đăng nhập chưa
function isLoggedIn() {
    return isset($_SESSION['user_id']) && isset($_SESSION['user_email']);
}

// Kiểm tra user có phải admin không
function isAdmin() {
    return isLoggedIn() && isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

// Lấy thông tin user hiện tại
function getCurrentUser() {
    if (!isLoggedIn()) return null;
    
    return [
        'id' => $_SESSION['user_id'],
        'email' => $_SESSION['user_email'],
        'name' => $_SESSION['user_name'] ?? '',
        'role' => $_SESSION['user_role'] ?? 'customer',
        'avatar' => $_SESSION['user_avatar'] ?? null
    ];
}

// Đăng nhập user (lưu vào session)
function loginUser($user) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_name'] = $user['full_name'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['user_avatar'] = $user['avatar'] ?? null;
    $_SESSION['login_time'] = time();
    
    // Regenerate session ID khi đăng nhập
    session_regenerate_id(true);
}

// Đăng xuất user
function logoutUser() {
    // Xóa tất cả session variables
    $_SESSION = array();
    
    // Xóa session cookie
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }
    
    // Hủy session
    session_destroy();
}

// Require login (trả về 401 nếu chưa đăng nhập)
function requireLogin() {
    if (!isLoggedIn()) {
        http_response_code(401);
        echo json_encode(['error' => 'Authentication required']);
        exit;
    }
}

// Require admin (trả về 403 nếu không phải admin)
function requireAdmin() {
    requireLogin();
    if (!isAdmin()) {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        exit;
    }
}

// Kiểm tra session timeout
function checkSessionTimeout() {
    if (isLoggedIn()) {
        $timeout = 1800; // 30 phút
        if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time'] > $timeout)) {
            logoutUser();
            http_response_code(401);
            echo json_encode(['error' => 'Session expired']);
            exit;
        }
    }
}

// Update session activity time
function updateSessionActivity() {
    if (isLoggedIn()) {
        $_SESSION['last_activity'] = time();
    }
}
