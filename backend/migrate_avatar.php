<?php
require_once 'config/db.php';

try {
    $sql = "ALTER TABLE users ADD COLUMN avatar VARCHAR(255) NULL AFTER phone";
    $pdo->exec($sql);
    echo "Migration thành công! Đã thêm cột avatar vào bảng users.\n";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Cột avatar đã tồn tại.\n";
    } else {
        echo "Lỗi: " . $e->getMessage() . "\n";
    }
}
