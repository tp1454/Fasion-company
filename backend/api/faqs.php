<?php
/**
 * API FAQ (Frequently Asked Questions)
 * Endpoint: /api/faqs.php
 * Methods: GET, POST, PUT, DELETE
 * 
 * Công việc #2 - Fashion Company
 */

// CORS Headers - Must be first!
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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
 * Kiểm tra quyền admin
 */
function isAdmin() {
    $headers = getallheaders();
    return isset($headers['Authorization']) && !empty($headers['Authorization']);
}

/**
 * Validate FAQ data
 */
function validateFAQ($data, $isUpdate = false) {
    $errors = [];
    
    if (empty($data['question']) || strlen(trim($data['question'])) < 10) {
        $errors[] = 'Câu hỏi phải có ít nhất 10 ký tự';
    }
    
    if (isset($data['question']) && strlen($data['question']) > 500) {
        $errors[] = 'Câu hỏi không được vượt quá 500 ký tự';
    }
    
    if (empty($data['answer']) || strlen(trim($data['answer'])) < 10) {
        $errors[] = 'Câu trả lời phải có ít nhất 10 ký tự';
    }
    
    if (isset($data['order_num']) && !is_numeric($data['order_num'])) {
        $errors[] = 'Thứ tự phải là số';
    }
    
    return $errors;
}

/**
 * Sanitize HTML
 */
function sanitizeHtml($html) {
    $allowed_tags = '<p><br><strong><b><em><i><u><ul><ol><li><a><h3><h4>';
    return strip_tags($html, $allowed_tags);
}

try {
    switch ($method) {
        case 'GET':
            // GET single FAQ or list with pagination and search
            if (isset($_GET['id'])) {
                // Get single FAQ by ID
                $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
                if (!$id) {
                    http_response_code(400);
                    echo json_encode([
                        'success' => false,
                        'message' => 'Invalid FAQ ID'
                    ], JSON_UNESCAPED_UNICODE);
                    exit;
                }
                
                $stmt = $pdo->prepare("SELECT * FROM faqs WHERE id = ?");
                $stmt->execute([$id]);
                $faq = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($faq) {
                    // Tăng lượt xem
                    $updateViews = $pdo->prepare("UPDATE faqs SET views = views + 1 WHERE id = ?");
                    $updateViews->execute([$id]);
                    
                    http_response_code(200);
                    echo json_encode([
                        'success' => true,
                        'data' => $faq
                    ], JSON_UNESCAPED_UNICODE);
                } else {
                    http_response_code(404);
                    echo json_encode([
                        'success' => false,
                        'message' => 'FAQ not found'
                    ], JSON_UNESCAPED_UNICODE);
                }
            } else {
                // Get list with pagination and search
                $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
                $limit = isset($_GET['limit']) ? max(1, min(100, intval($_GET['limit']))) : 10;
                $offset = ($page - 1) * $limit;
                $search = isset($_GET['search']) ? trim($_GET['search']) : '';
                $category = isset($_GET['category']) ? trim($_GET['category']) : '';
                $showInactive = isAdmin(); // Only admin can see inactive FAQs
                
                // Build query
                $conditions = [];
                $params = [];
                
                if (!$showInactive) {
                    $conditions[] = "is_active = 1";
                }
                
                if (!empty($search)) {
                    $conditions[] = "(question LIKE ? OR answer LIKE ?)";
                    $searchTerm = '%' . $search . '%';
                    $params[] = $searchTerm;
                    $params[] = $searchTerm;
                }
                
                if (!empty($category)) {
                    $conditions[] = "category = ?";
                    $params[] = $category;
                }
                
                $whereClause = !empty($conditions) ? 'WHERE ' . implode(' AND ', $conditions) : '';
                
                // Get total count
                $countSql = "SELECT COUNT(*) as total FROM faqs $whereClause";
                $countStmt = $pdo->prepare($countSql);
                $countStmt->execute($params);
                $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
                
                // Get paginated data
                $sql = "SELECT * FROM faqs $whereClause ORDER BY order_num ASC, created_at DESC LIMIT $limit OFFSET $offset";
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Get categories for filter
                $catStmt = $pdo->query("SELECT DISTINCT category FROM faqs WHERE category IS NOT NULL ORDER BY category");
                $categories = $catStmt->fetchAll(PDO::FETCH_COLUMN);
                
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $faqs,
                    'pagination' => [
                        'page' => $page,
                        'limit' => $limit,
                        'total' => (int)$total,
                        'totalPages' => ceil($total / $limit)
                    ],
                    'categories' => $categories
                ], JSON_UNESCAPED_UNICODE);
            }
            break;
            
        case 'POST':
            // Create new FAQ (admin only)
            if (!isAdmin()) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
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
            
            // Validate
            $errors = validateFAQ($data);
            if (!empty($errors)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $errors
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Sanitize
            $question = htmlspecialchars(trim($data['question']), ENT_QUOTES, 'UTF-8');
            $answer = sanitizeHtml($data['answer']);
            $category = htmlspecialchars(trim($data['category'] ?? 'Chung'), ENT_QUOTES, 'UTF-8');
            $order_num = isset($data['order_num']) ? intval($data['order_num']) : 0;
            $is_active = isset($data['is_active']) ? (bool)$data['is_active'] : true;
            
            // Insert
            $stmt = $pdo->prepare("
                INSERT INTO faqs (question, answer, category, order_num, is_active)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$question, $answer, $category, $order_num, $is_active]);
            
            $newId = $pdo->lastInsertId();
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Tạo FAQ thành công',
                'id' => $newId
            ], JSON_UNESCAPED_UNICODE);
            break;
            
        case 'PUT':
            // Update FAQ (admin only)
            if (!isAdmin()) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'FAQ ID is required'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
            if (!$id) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid FAQ ID'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
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
            
            // Validate
            $errors = validateFAQ($data, true);
            if (!empty($errors)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $errors
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Check if FAQ exists
            $checkStmt = $pdo->prepare("SELECT id FROM faqs WHERE id = ?");
            $checkStmt->execute([$id]);
            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'FAQ not found'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Sanitize
            $question = htmlspecialchars(trim($data['question']), ENT_QUOTES, 'UTF-8');
            $answer = sanitizeHtml($data['answer']);
            $category = htmlspecialchars(trim($data['category'] ?? 'Chung'), ENT_QUOTES, 'UTF-8');
            $order_num = isset($data['order_num']) ? intval($data['order_num']) : 0;
            $is_active = isset($data['is_active']) ? (bool)$data['is_active'] : true;
            
            // Update
            $stmt = $pdo->prepare("
                UPDATE faqs SET 
                    question = ?,
                    answer = ?,
                    category = ?,
                    order_num = ?,
                    is_active = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            $stmt->execute([$question, $answer, $category, $order_num, $is_active, $id]);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Cập nhật FAQ thành công'
            ], JSON_UNESCAPED_UNICODE);
            break;
            
        case 'DELETE':
            // Delete FAQ (admin only)
            if (!isAdmin()) {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Unauthorized. Admin access required.'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'FAQ ID is required'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
            if (!$id) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid FAQ ID'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Check if FAQ exists
            $checkStmt = $pdo->prepare("SELECT id FROM faqs WHERE id = ?");
            $checkStmt->execute([$id]);
            if (!$checkStmt->fetch()) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'FAQ not found'
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
            
            // Delete
            $stmt = $pdo->prepare("DELETE FROM faqs WHERE id = ?");
            $stmt->execute([$id]);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Xóa FAQ thành công'
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
