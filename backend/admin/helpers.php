<?php
/**
 * Admin Helper Functions
 * Công việc #2 - Fashion Company
 */

/**
 * Kiểm tra xem user có phải admin không
 * TODO: Thay thế bằng hệ thống auth thực tế
 */
function requireAdmin() {
    session_start();
    // Tạm thời comment để test, uncomment khi có hệ thống auth
    // if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    //     header('Location: /Fashion-company/backend/admin/login.php');
    //     exit;
    // }
}

/**
 * Upload file helper
 */
function uploadFile($file, $targetDir, $allowedTypes = ['jpg', 'jpeg', 'png', 'gif']) {
    $errors = [];
    
    // Check if file was uploaded
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => 'Lỗi upload file'];
    }
    
    // Check file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        return ['success' => false, 'message' => 'File quá lớn (tối đa 5MB)'];
    }
    
    // Get file extension
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    // Check allowed types
    if (!in_array($extension, $allowedTypes)) {
        return ['success' => false, 'message' => 'Loại file không được phép'];
    }
    
    // Check MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    $allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($mimeType, $allowedMimes)) {
        return ['success' => false, 'message' => 'MIME type không hợp lệ'];
    }
    
    // Create unique filename
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $targetPath = $targetDir . '/' . $filename;
    
    // Create directory if not exists
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0755, true);
    }
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return ['success' => true, 'filename' => $filename];
    } else {
        return ['success' => false, 'message' => 'Không thể lưu file'];
    }
}

/**
 * Delete file helper
 */
function deleteFile($filepath) {
    if (file_exists($filepath)) {
        return unlink($filepath);
    }
    return false;
}

/**
 * Get admin header HTML
 */
function getAdminHeader($title = 'Admin Panel') {
    return <<<HTML
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title - Fashion Company Admin</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/core@latest/dist/css/tabler.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
    <style>
        .preview-image { max-width: 200px; max-height: 200px; object-fit: cover; }
    </style>
</head>
<body>
    <div class="page">
        <aside class="navbar navbar-vertical navbar-expand-lg navbar-dark">
            <div class="container-fluid">
                <h1 class="navbar-brand navbar-brand-autodark">
                    <a href="/Fashion-company/backend/admin/">
                        Fashion Admin
                    </a>
                </h1>
                <div class="collapse navbar-collapse" id="navbar-menu">
                    <ul class="navbar-nav pt-lg-3">
                        <li class="nav-item">
                            <a class="nav-link" href="/Fashion-company/backend/admin/">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <i class="ti ti-home"></i>
                                </span>
                                <span class="nav-link-title">Dashboard</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/Fashion-company/backend/admin/about.php">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <i class="ti ti-info-circle"></i>
                                </span>
                                <span class="nav-link-title">Giới thiệu</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/Fashion-company/backend/admin/faqs.php">
                                <span class="nav-link-icon d-md-none d-lg-inline-block">
                                    <i class="ti ti-help"></i>
                                </span>
                                <span class="nav-link-title">Câu hỏi / Đáp</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
        <div class="page-wrapper">
HTML;
}

/**
 * Get admin footer HTML
 */
function getAdminFooter() {
    return <<<HTML
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/@tabler/core@latest/dist/js/tabler.min.js"></script>
    <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
    <script>
        // Initialize TinyMCE for textareas with class 'wysiwyg'
        if (typeof tinymce !== 'undefined') {
            tinymce.init({
                selector: 'textarea.wysiwyg',
                height: 400,
                menubar: false,
                plugins: 'lists link image code',
                toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code',
                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px }'
            });
        }
    </script>
</body>
</html>
HTML;
}

/**
 * Display success message
 */
function showSuccess($message) {
    return <<<HTML
    <div class="alert alert-success alert-dismissible" role="alert">
        <div class="d-flex">
            <div><i class="ti ti-check icon alert-icon"></i></div>
            <div>$message</div>
        </div>
        <a class="btn-close" data-bs-dismiss="alert" aria-label="close"></a>
    </div>
HTML;
}

/**
 * Display error message
 */
function showError($message) {
    return <<<HTML
    <div class="alert alert-danger alert-dismissible" role="alert">
        <div class="d-flex">
            <div><i class="ti ti-alert-circle icon alert-icon"></i></div>
            <div>$message</div>
        </div>
        <a class="btn-close" data-bs-dismiss="alert" aria-label="close"></a>
    </div>
HTML;
}
