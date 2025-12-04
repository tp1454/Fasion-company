<?php
/**
 * Admin - Quản lý trang Giới thiệu
 * Công việc #2 - Fashion Company
 */

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/../config/db.php';

requireAdmin();

$message = '';
$messageType = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Validate inputs
        $title = trim($_POST['title'] ?? '');
        $content = $_POST['content'] ?? '';
        $mission = $_POST['mission'] ?? '';
        $vision = $_POST['vision'] ?? '';
        $history = $_POST['history'] ?? '';
        $values = $_POST['values'] ?? '';
        
        if (empty($title)) {
            throw new Exception('Tiêu đề không được để trống');
        }
        
        // Get existing images
        $existingImages = json_decode($_POST['existing_images'] ?? '[]', true);
        
        // Handle new image uploads
        $uploadedImages = [];
        if (isset($_FILES['images']) && is_array($_FILES['images']['name'])) {
            $uploadDir = __DIR__ . '/../uploads/about';
            
            foreach ($_FILES['images']['name'] as $key => $filename) {
                if ($_FILES['images']['error'][$key] === UPLOAD_ERR_OK) {
                    $file = [
                        'name' => $_FILES['images']['name'][$key],
                        'type' => $_FILES['images']['type'][$key],
                        'tmp_name' => $_FILES['images']['tmp_name'][$key],
                        'error' => $_FILES['images']['error'][$key],
                        'size' => $_FILES['images']['size'][$key]
                    ];
                    
                    $result = uploadFile($file, $uploadDir);
                    if ($result['success']) {
                        $uploadedImages[] = $result['filename'];
                    }
                }
            }
        }
        
        // Combine existing and new images
        $allImages = array_merge($existingImages, $uploadedImages);
        $imagesJson = json_encode($allImages);
        
        // Check if record exists
        $checkStmt = $pdo->query("SELECT id FROM about LIMIT 1");
        $existing = $checkStmt->fetch();
        
        if ($existing) {
            // Update
            $stmt = $pdo->prepare("
                UPDATE about SET 
                    title = ?,
                    content = ?,
                    mission = ?,
                    vision = ?,
                    history = ?,
                    values = ?,
                    images = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            $stmt->execute([
                $title, $content, $mission, $vision, 
                $history, $values, $imagesJson, $existing['id']
            ]);
        } else {
            // Insert
            $stmt = $pdo->prepare("
                INSERT INTO about (title, content, mission, vision, history, values, images)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $title, $content, $mission, $vision, 
                $history, $values, $imagesJson
            ]);
        }
        
        $message = 'Cập nhật thành công!';
        $messageType = 'success';
        
    } catch (Exception $e) {
        $message = 'Lỗi: ' . $e->getMessage();
        $messageType = 'error';
    }
}

// Handle image deletion
if (isset($_GET['delete_image'])) {
    try {
        $imageToDelete = $_GET['delete_image'];
        
        // Get current data
        $stmt = $pdo->query("SELECT images FROM about LIMIT 1");
        $aboutData = $stmt->fetch();
        
        if ($aboutData) {
            $images = json_decode($aboutData['images'], true) ?: [];
            $images = array_filter($images, function($img) use ($imageToDelete) {
                return $img !== $imageToDelete;
            });
            
            // Update database
            $updateStmt = $pdo->prepare("UPDATE about SET images = ? WHERE id = (SELECT id FROM about LIMIT 1)");
            $updateStmt->execute([json_encode(array_values($images))]);
            
            // Delete physical file
            $filepath = __DIR__ . '/../uploads/about/' . $imageToDelete;
            deleteFile($filepath);
            
            $message = 'Xóa ảnh thành công!';
            $messageType = 'success';
        }
    } catch (Exception $e) {
        $message = 'Lỗi khi xóa ảnh: ' . $e->getMessage();
        $messageType = 'error';
    }
}

// Fetch current data
$stmt = $pdo->query("SELECT * FROM about ORDER BY id DESC LIMIT 1");
$aboutData = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$aboutData) {
    $aboutData = [
        'title' => '',
        'content' => '',
        'mission' => '',
        'vision' => '',
        'history' => '',
        'values' => '',
        'images' => '[]'
    ];
}

$images = json_decode($aboutData['images'], true) ?: [];

echo getAdminHeader('Quản lý Giới thiệu');
?>

<div class="page-header d-print-none">
    <div class="container-xl">
        <div class="row g-2 align-items-center">
            <div class="col">
                <h2 class="page-title">Quản lý trang Giới thiệu</h2>
            </div>
        </div>
    </div>
</div>

<div class="page-body">
    <div class="container-xl">
        <?php if ($message): ?>
            <?php echo $messageType === 'success' ? showSuccess($message) : showError($message); ?>
        <?php endif; ?>
        
        <form method="POST" enctype="multipart/form-data">
            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Thông tin giới thiệu</h3>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label class="form-label required">Tiêu đề</label>
                                <input type="text" class="form-control" name="title" 
                                       value="<?= htmlspecialchars($aboutData['title']) ?>" required>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Nội dung chính</label>
                                <textarea class="form-control wysiwyg" name="content" rows="8"><?= htmlspecialchars($aboutData['content']) ?></textarea>
                                <small class="form-hint">Nội dung giới thiệu chung về công ty</small>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Sứ mệnh</label>
                                <textarea class="form-control wysiwyg" name="mission" rows="6"><?= htmlspecialchars($aboutData['mission']) ?></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Tầm nhìn</label>
                                <textarea class="form-control wysiwyg" name="vision" rows="6"><?= htmlspecialchars($aboutData['vision']) ?></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Lịch sử hình thành</label>
                                <textarea class="form-control wysiwyg" name="history" rows="8"><?= htmlspecialchars($aboutData['history']) ?></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Giá trị cốt lõi</label>
                                <textarea class="form-control wysiwyg" name="values" rows="6"><?= htmlspecialchars($aboutData['values']) ?></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Hình ảnh</h3>
                        </div>
                        <div class="card-body">
                            <!-- Existing Images -->
                            <?php if (!empty($images)): ?>
                                <div class="mb-3">
                                    <label class="form-label">Hình ảnh hiện tại</label>
                                    <input type="hidden" name="existing_images" value='<?= htmlspecialchars(json_encode($images)) ?>'>
                                    <div class="row g-2">
                                        <?php foreach ($images as $image): ?>
                                            <div class="col-6">
                                                <div class="card">
                                                    <img src="/Fashion-company/backend/uploads/about/<?= htmlspecialchars($image) ?>" 
                                                         class="card-img-top preview-image" alt="Image">
                                                    <div class="card-body p-2">
                                                        <a href="?delete_image=<?= urlencode($image) ?>" 
                                                           class="btn btn-sm btn-danger w-100"
                                                           onclick="return confirm('Xác nhận xóa ảnh này?')">
                                                            <i class="ti ti-trash"></i> Xóa
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            
                            <!-- Upload New Images -->
                            <div class="mb-3">
                                <label class="form-label">Thêm hình ảnh mới</label>
                                <input type="file" class="form-control" name="images[]" 
                                       accept="image/jpeg,image/png,image/gif" multiple>
                                <small class="form-hint">Chọn nhiều file (JPG, PNG, GIF, tối đa 5MB/file)</small>
                            </div>
                            
                            <button type="submit" class="btn btn-primary w-100">
                                <i class="ti ti-device-floppy"></i> Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

<?php echo getAdminFooter(); ?>
