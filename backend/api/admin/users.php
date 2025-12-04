<?php
/**
 * Admin Users API
 */

// CORS Headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once '../../config/config.php';
require_once '../../config/db.php';
require_once '../../includes/session.php';

try {
    startSecureSession();
    
    // Check authentication
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }
    
    // Check admin role
    if ($_SESSION['user_role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Session error: ' . $e->getMessage()]);
    exit;
}

// GET - Danh sách hoặc chi tiết user
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    try {
        // Nếu có id, trả về chi tiết user
        if (isset($_GET['id'])) {
            $userId = (int)$_GET['id'];
            
            $stmt = $pdo->prepare("
                SELECT id, email, fullname, phone, role, email_verified, 
                       status, created_at, updated_at, last_login
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
            
            // Normalize for frontend
            $user['full_name'] = $user['fullname'];
            unset($user['fullname']);
            
            echo json_encode($user);
            exit;
        }
        
        // Lấy danh sách users với search, filter, pagination
        $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? min(MAX_PAGE_SIZE, max(1, (int)$_GET['limit'])) : DEFAULT_PAGE_SIZE;
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';
        $role = isset($_GET['role']) ? $_GET['role'] : '';
        $status = isset($_GET['status']) ? $_GET['status'] : '';
        
        $offset = ($page - 1) * $limit;
        
        // Build WHERE clause
        $whereConditions = [];
        $params = [];
        
        if (!empty($search)) {
            $whereConditions[] = "(email LIKE ? OR fullname LIKE ? OR phone LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        if (!empty($role) && in_array($role, ['customer', 'admin'])) {
            $whereConditions[] = "role = ?";
            $params[] = $role;
        }
        
        if (!empty($status) && in_array($status, ['active', 'locked'])) {
            $whereConditions[] = "status = ?";
            $params[] = $status;
        }
        
        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
        
        // Count total
        $countSql = "SELECT COUNT(*) as total FROM users $whereClause";
        $stmt = $pdo->prepare($countSql);
        $stmt->execute($params);
        $total = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Get users
        $sql = "
            SELECT id, email, fullname, phone, role, email_verified,
                   status, created_at, last_login
            FROM users 
            $whereClause
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
        ";
        
        $stmt = $pdo->prepare($sql);
        
        // Bind WHERE params
        $paramIndex = 1;
        foreach ($params as $param) {
            $stmt->bindValue($paramIndex++, $param);
        }
        
        // Bind LIMIT and OFFSET as integers
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Normalize fullname to full_name for frontend
        foreach ($users as &$user) {
            $user['full_name'] = $user['fullname'];
            unset($user['fullname']);
        }
        
        echo json_encode([
            'data' => $users,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'totalPages' => ceil($total / $limit)
            ]
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Database error',
            'message' => $e->getMessage(),
            'code' => $e->getCode()
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Server error',
            'message' => $e->getMessage()
        ]);
    }
}

// PUT - Cập nhật user
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid request data']);
        exit;
    }
    
    $userId = (int)$data['id'];
    $action = $data['action'] ?? '';
    
    try {
        // Không cho phép tự cập nhật chính mình
        if ($userId === $_SESSION['user_id']) {
            http_response_code(400);
            echo json_encode(['error' => 'Không thể tự cập nhật chính mình']);
            exit;
        }
        
        // Kiểm tra user tồn tại
        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            exit;
        }
        
        switch ($action) {
            case 'toggle_status':
                // Toggle active/locked
                $newStatus = $data['status'] ?? 'active';
                if (!in_array($newStatus, ['active', 'locked'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid status']);
                    exit;
                }
                
                $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
                $stmt->execute([$newStatus, $userId]);
                
                $message = $newStatus === 'locked' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản';
                echo json_encode(['success' => true, 'message' => $message]);
                break;
                
            case 'reset_password':
                // Reset password to default
                $defaultPassword = 'password123';
                $hashedPassword = password_hash($defaultPassword, PASSWORD_BCRYPT);
                
                $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
                $stmt->execute([$hashedPassword, $userId]);
                
                echo json_encode([
                    'success' => true, 
                    'message' => 'Đã reset mật khẩu thành công. Mật khẩu mới: ' . $defaultPassword
                ]);
                break;
                
            case 'change_role':
                // Change user role
                $newRole = $data['role'] ?? 'customer';
                if (!in_array($newRole, ['customer', 'admin'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid role']);
                    exit;
                }
                
                $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
                $stmt->execute([$newRole, $userId]);
                
                echo json_encode(['success' => true, 'message' => 'Đã thay đổi vai trò thành công']);
                break;
                
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
        }
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
