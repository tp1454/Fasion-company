<?php
/**
 * Validation Helper Functions
 * Các hàm validation dữ liệu
 */

// Validate email
function validateEmail($email) {
    if (empty($email)) {
        return 'Email không được để trống';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return 'Email không hợp lệ';
    }
    return null;
}

// Validate password
function validatePassword($password) {
    if (empty($password)) {
        return 'Mật khẩu không được để trống';
    }
    if (strlen($password) < 6) {
        return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return null;
}

// Validate required field
function validateRequired($value, $fieldName) {
    if (empty($value)) {
        return $fieldName . ' không được để trống';
    }
    return null;
}

// Validate phone number
function validatePhone($phone) {
    if (empty($phone)) {
        return null; // Phone is optional
    }
    // Vietnamese phone number format
    if (!preg_match('/^(0|\+84)[0-9]{9}$/', $phone)) {
        return 'Số điện thoại không hợp lệ';
    }
    return null;
}

// Validate file upload (for avatar)
function validateFileUpload($file, $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], $maxSize = 2097152) {
    $errors = [];
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'Lỗi khi upload file';
        return $errors;
    }
    
    // Check file size (default 2MB)
    if ($file['size'] > $maxSize) {
        $errors[] = 'File quá lớn (tối đa ' . ($maxSize / 1024 / 1024) . 'MB)';
    }
    
    // Check file type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        $errors[] = 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF)';
    }
    
    // Check if it's actually an image
    $imageInfo = getimagesize($file['tmp_name']);
    if ($imageInfo === false) {
        $errors[] = 'File không phải là ảnh hợp lệ';
    }
    
    return $errors;
}

// Sanitize input
function sanitizeInput($data) {
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = sanitizeInput($value);
        }
        return $data;
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Validate string length
function validateLength($value, $min, $max, $fieldName) {
    $length = strlen($value);
    if ($length < $min) {
        return $fieldName . ' phải có ít nhất ' . $min . ' ký tự';
    }
    if ($length > $max) {
        return $fieldName . ' không được quá ' . $max . ' ký tự';
    }
    return null;
}

// Generate CSRF token
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Verify CSRF token
function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
