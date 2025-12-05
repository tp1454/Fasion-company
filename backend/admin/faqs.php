<?php
/**
 * Admin - Danh sách FAQ
 * Công việc #2 - Fashion Company
 */

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/../config/db.php';

requireAdmin();

$message = '';
$messageType = '';

// Handle delete action
if (isset($_GET['delete'])) {
    try {
        $id = intval($_GET['delete']);
        $stmt = $pdo->prepare("DELETE FROM faqs WHERE id = ?");
        $stmt->execute([$id]);
        $message = 'Xóa FAQ thành công!';
        $messageType = 'success';
    } catch (Exception $e) {
        $message = 'Lỗi: ' . $e->getMessage();
        $messageType = 'error';
    }
}

// Handle toggle active
if (isset($_GET['toggle'])) {
    try {
        $id = intval($_GET['toggle']);
        $stmt = $pdo->prepare("UPDATE faqs SET is_active = NOT is_active WHERE id = ?");
        $stmt->execute([$id]);
        $message = 'Cập nhật trạng thái thành công!';
        $messageType = 'success';
    } catch (Exception $e) {
        $message = 'Lỗi: ' . $e->getMessage();
        $messageType = 'error';
    }
}

// Pagination
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$limit = 15;
$offset = ($page - 1) * $limit;

// Search
$search = trim($_GET['search'] ?? '');
$category = trim($_GET['category'] ?? '');

// Build query
$conditions = [];
$params = [];

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
$totalPages = ceil($total / $limit);

// Get data
$sql = "SELECT * FROM faqs $whereClause ORDER BY order_num ASC, created_at DESC LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get categories
$catStmt = $pdo->query("SELECT DISTINCT category FROM faqs WHERE category IS NOT NULL ORDER BY category");
$categories = $catStmt->fetchAll(PDO::FETCH_COLUMN);

echo getAdminHeader('Quản lý FAQ');
?>

<div class="page-header d-print-none">
    <div class="container-xl">
        <div class="row g-2 align-items-center">
            <div class="col">
                <h2 class="page-title">Quản lý Câu hỏi / Đáp</h2>
            </div>
            <div class="col-auto ms-auto">
                <a href="faq-add.php" class="btn btn-primary">
                    <i class="ti ti-plus"></i> Thêm câu hỏi mới
                </a>
            </div>
        </div>
    </div>
</div>

<div class="page-body">
    <div class="container-xl">
        <?php if ($message): ?>
            <?php echo $messageType === 'success' ? showSuccess($message) : showError($message); ?>
        <?php endif; ?>
        
        <!-- Search Form -->
        <div class="card mb-3">
            <div class="card-body">
                <form method="GET" class="row g-3">
                    <div class="col-md-5">
                        <input type="text" class="form-control" name="search" 
                               value="<?= htmlspecialchars($search) ?>" 
                               placeholder="Tìm kiếm câu hỏi...">
                    </div>
                    <div class="col-md-3">
                        <select class="form-select" name="category">
                            <option value="">Tất cả danh mục</option>
                            <?php foreach ($categories as $cat): ?>
                                <option value="<?= htmlspecialchars($cat) ?>" 
                                        <?= $category === $cat ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($cat) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <button type="submit" class="btn btn-primary">
                            <i class="ti ti-search"></i> Tìm kiếm
                        </button>
                        <?php if ($search || $category): ?>
                            <a href="faqs.php" class="btn btn-secondary">
                                <i class="ti ti-x"></i> Xóa bộ lọc
                            </a>
                        <?php endif; ?>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- FAQ Table -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Danh sách câu hỏi (<?= $total ?>)</h3>
            </div>
            <div class="table-responsive">
                <table class="table table-vcenter card-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Câu hỏi</th>
                            <th>Danh mục</th>
                            <th>Thứ tự</th>
                            <th>Lượt xem</th>
                            <th>Trạng thái</th>
                            <th class="w-1">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($faqs)): ?>
                            <tr>
                                <td colspan="7" class="text-center text-muted py-4">
                                    <i class="ti ti-mood-empty icon mb-2" style="font-size: 3rem;"></i>
                                    <p>Không có câu hỏi nào</p>
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($faqs as $faq): ?>
                                <tr>
                                    <td><?= $faq['id'] ?></td>
                                    <td>
                                        <div style="max-width: 400px;">
                                            <?= htmlspecialchars(substr($faq['question'], 0, 100)) ?>
                                            <?= strlen($faq['question']) > 100 ? '...' : '' ?>
                                        </div>
                                        <small class="text-muted">
                                            <?= date('d/m/Y H:i', strtotime($faq['created_at'])) ?>
                                        </small>
                                    </td>
                                    <td>
                                        <span class="badge bg-blue-lt">
                                            <?= htmlspecialchars($faq['category']) ?>
                                        </span>
                                    </td>
                                    <td><?= $faq['order_num'] ?></td>
                                    <td>
                                        <i class="ti ti-eye"></i> <?= $faq['views'] ?>
                                    </td>
                                    <td>
                                        <?php if ($faq['is_active']): ?>
                                            <span class="badge bg-success">Hiển thị</span>
                                        <?php else: ?>
                                            <span class="badge bg-secondary">Ẩn</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="btn-group">
                                            <a href="faq-edit.php?id=<?= $faq['id'] ?>" 
                                               class="btn btn-sm btn-primary" title="Sửa">
                                                <i class="ti ti-edit"></i>
                                            </a>
                                            <a href="?toggle=<?= $faq['id'] ?>" 
                                               class="btn btn-sm btn-secondary" 
                                               title="<?= $faq['is_active'] ? 'Ẩn' : 'Hiện' ?>">
                                                <i class="ti ti-eye-<?= $faq['is_active'] ? 'off' : 'check' ?>"></i>
                                            </a>
                                            <a href="?delete=<?= $faq['id'] ?>" 
                                               class="btn btn-sm btn-danger" title="Xóa"
                                               onclick="return confirm('Xác nhận xóa câu hỏi này?')">
                                                <i class="ti ti-trash"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <?php if ($totalPages > 1): ?>
                <div class="card-footer d-flex align-items-center">
                    <p class="m-0 text-muted">
                        Hiển thị <span><?= $offset + 1 ?></span> đến <span><?= min($offset + $limit, $total) ?></span> 
                        trong tổng số <span><?= $total ?></span> kết quả
                    </p>
                    <ul class="pagination m-0 ms-auto">
                        <?php if ($page > 1): ?>
                            <li class="page-item">
                                <a class="page-link" href="?page=<?= $page - 1 ?><?= $search ? '&search=' . urlencode($search) : '' ?><?= $category ? '&category=' . urlencode($category) : '' ?>">
                                    <i class="ti ti-chevron-left"></i> Trước
                                </a>
                            </li>
                        <?php endif; ?>
                        
                        <?php for ($i = max(1, $page - 2); $i <= min($totalPages, $page + 2); $i++): ?>
                            <li class="page-item <?= $i === $page ? 'active' : '' ?>">
                                <a class="page-link" href="?page=<?= $i ?><?= $search ? '&search=' . urlencode($search) : '' ?><?= $category ? '&category=' . urlencode($category) : '' ?>">
                                    <?= $i ?>
                                </a>
                            </li>
                        <?php endfor; ?>
                        
                        <?php if ($page < $totalPages): ?>
                            <li class="page-item">
                                <a class="page-link" href="?page=<?= $page + 1 ?><?= $search ? '&search=' . urlencode($search) : '' ?><?= $category ? '&category=' . urlencode($category) : '' ?>">
                                    Sau <i class="ti ti-chevron-right"></i>
                                </a>
                            </li>
                        <?php endif; ?>
                    </ul>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php echo getAdminFooter(); ?>
