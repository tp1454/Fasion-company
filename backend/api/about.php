<?php
/**
 * API Giới thiệu (About)
 * Endpoint: /api/about.php
 * Methods: GET (lấy thông tin), PUT (cập nhật - admin only)
 * 
 * Công việc #2 - Fashion Company
 */

// CORS Headers - Must be first!
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400'); // Cache preflight for 24 hours
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . '/../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

/**
 * Hàm kiểm tra quyền admin (giả lập - cần tích hợp với hệ thống auth thực tế)
 */
function isAdmin() {
    // TODO: Implement proper authentication check
    // Hiện tại chỉ check header Authorization có tồn tại không
    $headers = getallheaders();
    return isset($headers['Authorization']) && !empty($headers['Authorization']);
}

/**
 * Hàm validate dữ liệu đầu vào
 */
function validateAboutData($data) {
    $errors = [];
    
    if (empty($data['title']) || strlen(trim($data['title'])) < 5) {
        $errors[] = 'Tiêu đề phải có ít nhất 5 ký tự';
    }
    
    if (isset($data['title']) && strlen($data['title']) > 255) {
        $errors[] = 'Tiêu đề không được vượt quá 255 ký tự';
    }
    
    return $errors;
}

/**
 * Hàm sanitize HTML content
 */
function sanitizeHtml($html) {
    // Cho phép các thẻ HTML an toàn
    $allowed_tags = '<p><br><strong><b><em><i><u><h2><h3><h4><ul><ol><li><a><img>';
    return strip_tags($html, $allowed_tags);
}

try {
    switch ($method) {
        case 'GET':
            // Lấy thông tin giới thiệu
            $stmt = $pdo->query("SELECT * FROM about ORDER BY id DESC LIMIT 1");
            $about = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($about) {
                // Parse images JSON
                if (!empty($about['images'])) {
                    $about['images'] = json_decode($about['images'], true);
                } else {
                    $about['images'] = [];
                }
                
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $about
                ], JSON_UNESCAPED_UNICODE);
            } else {
                // Nếu chưa có dữ liệu, trả về data mặc định
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => [
                        'id' => null,
                        'title' => 'Giới thiệu về Fashion Company',
                        'content' => '',
                        'mission' => '',
                        'vision' => '',
                        'history' => '',
                        'values' => '',
                        'images' => []
                    ]
                ], JSON_UNESCAPED_UNICODE);
            }
            break;
            
        case 'PUT':
            // Cập nhật thông tin giới thiệu (chỉ admin)
            if (!isAdmin()) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Lấy dữ liệu từ request body
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid JSON data'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Validate dữ liệu
            $errors = validateAboutData($data);
            if (!empty($errors)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $errors
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Sanitize dữ liệu
            $title = htmlspecialchars(trim($data['title']), ENT_QUOTES, 'UTF-8');
            $content = sanitizeHtml($data['content'] ?? '');
            $mission = sanitizeHtml($data['mission'] ?? '');
            $vision = sanitizeHtml($data['vision'] ?? '');
            $history = sanitizeHtml($data['history'] ?? '');
            $values = sanitizeHtml($data['values'] ?? '');
            
            // Xử lý images array
            $images = isset($data['images']) && is_array($data['images']) 
                ? json_encode($data['images']) 
                : json_encode([]);
            
            // Kiểm tra xem đã có record chưa
            $checkStmt = $pdo->query("SELECT id FROM about LIMIT 1");
            $existing = $checkStmt->fetch();
            
            if ($existing) {
                // Update existing record
                $stmt = $pdo->prepare("
                    UPDATE about SET 
                        title = ?,
                        content = ?,
                        mission = ?,
                        vision = ?,
                        history = ?,
                        `values` = ?,
                        images = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ");
                $stmt->execute([
                    $title, $content, $mission, $vision, 
                    $history, $values, $images, $existing['id']
                ]);
            } else {
                // Insert new record
                $stmt = $pdo->prepare("
                    INSERT INTO about (title, content, mission, vision, history, `values`, images)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $title, $content, $mission, $vision, 
                    $history, $values, $images
                ]);
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Cập nhật thông tin thành công'
            ], JSON_UNESCAPED_UNICODE);
            break;
            
        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Method not allowed'
            ], JSON_UNESCAPED_UNICODE);
            break;
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
