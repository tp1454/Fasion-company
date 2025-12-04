<?php
/**
 * Application Configuration
 * Cấu hình chung cho ứng dụng
 */

// App settings
define('APP_NAME', 'Fashion Company');
define('APP_URL', 'http://localhost');
define('APP_ENV', 'development'); // development, production

// Upload settings
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('AVATAR_DIR', UPLOAD_DIR . 'avatars/');
define('MAX_UPLOAD_SIZE', 2097152); // 2MB

// Session settings
define('SESSION_TIMEOUT', 1800); // 30 minutes

// Pagination settings
define('DEFAULT_PAGE_SIZE', 10);
define('MAX_PAGE_SIZE', 100);

// Password settings
define('MIN_PASSWORD_LENGTH', 6);
define('PASSWORD_HASH_COST', 10);

// Error reporting
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Create upload directories if they don't exist
if (!file_exists(AVATAR_DIR)) {
    mkdir(AVATAR_DIR, 0755, true);
}

// Helper function to get base URL
function getBaseURL() {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    return $protocol . '://' . $host;
}

// Helper function to get avatar URL
function getAvatarURL($avatar) {
    if (empty($avatar)) {
        return null;
    }
    return getBaseURL() . '/uploads/avatars/' . $avatar;
}
