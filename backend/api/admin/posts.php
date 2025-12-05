<?php
// CORS - allow frontend dev origin(s) and handle preflight
$allowedOrigins = [
    'http://localhost:5173',   // Vite dev server
    'http://localhost'         // Apache
];

if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    }
}

// Respond to preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // No body needed for preflight
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/session.php';
require_once __DIR__ . '/../../includes/validation.php';

// Basic admin gate: you can replace with existing auth logic
// Use shared session helpers
startSecureSession();
requireAdmin();

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json; charset=utf-8');

try {
    if ($method === 'GET') {
        // list with pagination & search
        $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 10;
        $offset = ($page - 1) * $limit;
        $search = isset($_GET['search']) ? trim($_GET['search']) : '';

        $where = [];
        $params = [];
        if ($search !== '') {
            $where[] = '(title LIKE :q OR content LIKE :q)';
            $params[':q'] = "%{$search}%";
        }

        $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $totalStmt = $pdo->prepare("SELECT COUNT(*) FROM posts {$whereSql}");
        $totalStmt->execute($params);
        $total = (int)$totalStmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT * FROM posts {$whereSql} ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v, PDO::PARAM_STR);
        }
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'data' => $data,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => max(1, (int)ceil($total / $limit))
            ]
        ]);
        exit;
    }

    // read input for POST/PUT/DELETE
    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    if ($method === 'POST') {
        // create post
        $title = trim($input['title'] ?? '');
        $content = trim($input['content'] ?? '');
        $thumbnail = trim($input['thumbnail'] ?? '');

        if ($title === '' || $content === '') {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => 'Title and content are required']);
            exit;
        }

        $stmt = $pdo->prepare('INSERT INTO posts (title, content, thumbnail, created_at) VALUES (:title, :content, :thumbnail, NOW())');
        $stmt->execute([':title' => $title, ':content' => $content, ':thumbnail' => $thumbnail]);
        $id = (int)$pdo->lastInsertId();
        echo json_encode(['success' => true, 'id' => $id]);
        exit;
    }

    if ($method === 'PUT') {
        // update post by id
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing id']);
            exit;
        }

        $title = isset($input['title']) ? trim($input['title']) : null;
        $content = isset($input['content']) ? trim($input['content']) : null;
        $thumbnail = array_key_exists('thumbnail', $input) ? trim($input['thumbnail']) : null;

        $fields = [];
        $params = [':id' => $id];
        if ($title !== null) { $fields[] = 'title = :title'; $params[':title'] = $title; }
        if ($content !== null) { $fields[] = 'content = :content'; $params[':content'] = $content; }
        if ($thumbnail !== null) { $fields[] = 'thumbnail = :thumbnail'; $params[':thumbnail'] = $thumbnail; }

        if (empty($fields)) {
            echo json_encode(['success' => false, 'message' => 'Nothing to update']);
            exit;
        }

        $sql = 'UPDATE posts SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['success' => true]);
        exit;
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing id']);
            exit;
        }

        // soft delete: move to status 'archived' if column exists, otherwise hard delete
        try {
            // try soft-update
            $pdo->exec("ALTER TABLE posts ADD COLUMN IF NOT EXISTS status ENUM('published','draft','archived') DEFAULT 'published'");
        } catch (Exception $e) {
            // ignore alter errors
        }

        $stmt = $pdo->prepare('UPDATE posts SET status = "archived" WHERE id = :id');
        $stmt->execute([':id' => $id]);
        if ($stmt->rowCount() === 0) {
            // fallback hard delete
            $stmt2 = $pdo->prepare('DELETE FROM posts WHERE id = :id');
            $stmt2->execute([':id' => $id]);
        }

        echo json_encode(['success' => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
