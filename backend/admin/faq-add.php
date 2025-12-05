<?php
/**
 * Admin - Thêm FAQ mới
 * Công việc #2 - Fashion Company
 */

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/../config/db.php';

requireAdmin();

$message = '';
$messageType = '';
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Validate
        $question = trim($_POST['question'] ?? '');
        $answer = trim($_POST['answer'] ?? '');
        $category = trim($_POST['category'] ?? 'Chung');
        $order_num = intval($_POST['order_num'] ?? 0);
        $is_active = isset($_POST['is_active']) ? 1 : 0;
        
        if (empty($question) || strlen($question) < 10) {
            $errors[] = 'Câu hỏi phải có ít nhất 10 ký tự';
        }
        
        if (empty($answer) || strlen($answer) < 10) {
            $errors[] = 'Câu trả lời phải có ít nhất 10 ký tự';
        }
        
        if (empty($errors)) {
            // Insert
            $stmt = $pdo->prepare("
                INSERT INTO faqs (question, answer, category, order_num, is_active)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$question, $answer, $category, $order_num, $is_active]);
            
            $message = 'Thêm câu hỏi thành công!';
            $messageType = 'success';
            
            // Redirect after 2 seconds
            header("refresh:2;url=faqs.php");
        }
        
    } catch (Exception $e) {
        $message = 'Lỗi: ' . $e->getMessage();
        $messageType = 'error';
    }
}

// Get existing categories
$catStmt = $pdo->query("SELECT DISTINCT category FROM faqs WHERE category IS NOT NULL ORDER BY category");
$categories = $catStmt->fetchAll(PDO::FETCH_COLUMN);

echo getAdminHeader('Thêm FAQ mới');
?>

<div class="page-header d-print-none">
    <div class="container-xl">
        <div class="row g-2 align-items-center">
            <div class="col">
                <h2 class="page-title">Thêm câu hỏi / đáp mới</h2>
            </div>
            <div class="col-auto ms-auto">
                <a href="faqs.php" class="btn btn-secondary">
                    <i class="ti ti-arrow-left"></i> Quay lại
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
        
        <?php if (!empty($errors)): ?>
            <div class="alert alert-danger">
                <ul class="mb-0">
                    <?php foreach ($errors as $error): ?>
                        <li><?= htmlspecialchars($error) ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
        
        <form method="POST">
            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Thông tin câu hỏi</h3>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label required">Câu hỏi</label>
                                <input type="text" class="form-control" name="question" 
                                       value="<?= htmlspecialchars($_POST['question'] ?? '') ?>" 
                                       required maxlength="500"
                                       placeholder="Nhập câu hỏi...">
                                <small class="form-hint">Tối thiểu 10 ký tự, tối đa 500 ký tự</small>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label required">Câu trả lời</label>
                                <textarea class="form-control wysiwyg" name="answer" rows="10" required><?= htmlspecialchars($_POST['answer'] ?? '') ?></textarea>
                                <small class="form-hint">Tối thiểu 10 ký tự. Có thể sử dụng HTML</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Cài đặt</h3>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label">Danh mục</label>
                                <input type="text" class="form-control" name="category" 
                                       value="<?= htmlspecialchars($_POST['category'] ?? 'Chung') ?>"
                                       list="categoryList"
                                       placeholder="Nhập hoặc chọn danh mục">
                                <datalist id="categoryList">
                                    <?php foreach ($categories as $cat): ?>
                                        <option value="<?= htmlspecialchars($cat) ?>">
                                    <?php endforeach; ?>
                                </datalist>
                                <small class="form-hint">Nhập tên danh mục hoặc chọn từ danh sách</small>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Thứ tự hiển thị</label>
                                <input type="number" class="form-control" name="order_num" 
                                       value="<?= htmlspecialchars($_POST['order_num'] ?? '0') ?>" 
                                       min="0">
                                <small class="form-hint">Số càng nhỏ sẽ hiển thị trước</small>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" name="is_active" 
                                           <?= (isset($_POST['is_active']) || !isset($_POST['question'])) ? 'checked' : '' ?>>
                                    <span class="form-check-label">Hiển thị trên website</span>
                                </label>
                            </div>
                            
                            <hr>
                            
                            <button type="submit" class="btn btn-primary w-100">
                                <i class="ti ti-device-floppy"></i> Lưu câu hỏi
                            </button>
                        </div>
                    </div>
                    
                    <div class="card mt-3">
                        <div class="card-header">
                            <h3 class="card-title">Hướng dẫn</h3>
                        </div>
                        <div class="card-body">
                            <ul class="list-unstyled mb-0 small text-muted">
                                <li class="mb-2">
                                    <i class="ti ti-check text-success"></i>
                                    Câu hỏi nên rõ ràng, dễ hiểu
                                </li>
                                <li class="mb-2">
                                    <i class="ti ti-check text-success"></i>
                                    Câu trả lời nên đầy đủ, chi tiết
                                </li>
                                <li class="mb-2">
                                    <i class="ti ti-check text-success"></i>
                                    Sử dụng danh mục để phân loại
                                </li>
                                <li class="mb-2">
                                    <i class="ti ti-check text-success"></i>
                                    Thứ tự giúp sắp xếp hiển thị
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<?php echo getAdminFooter(); ?>
