-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 18, 2025 lúc 03:32 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `fashion_company`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `about`
--

CREATE TABLE `about` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL COMMENT 'Tiêu đề trang giới thiệu',
  `content` text DEFAULT NULL COMMENT 'Nội dung chính giới thiệu',
  `mission` text DEFAULT NULL COMMENT 'Sứ mệnh',
  `vision` text DEFAULT NULL COMMENT 'Tầm nhìn',
  `history` text DEFAULT NULL COMMENT 'Lịch sử hình thành',
  `values` text DEFAULT NULL COMMENT 'Giá trị cốt lõi',
  `images` text DEFAULT NULL COMMENT 'JSON array chứa danh sách đường dẫn hình ảnh',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu thông tin giới thiệu công ty';

--
-- Đang đổ dữ liệu cho bảng `about`
--

INSERT INTO `about` (`id`, `title`, `content`, `mission`, `vision`, `history`, `values`, `images`, `created_at`, `updated_at`) VALUES
(1, 'Giới thiệu về Fashion Company', '<h2>Chào mừng đến với Fashion Company</h2>\r\n<p>Fashion Company là một trong những thương hiệu thời trang hàng đầu Việt Nam, chuyên cung cấp các sản phẩm thời trang cao cấp cho nam và nữ. Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào mang đến cho khách hàng những sản phẩm chất lượng nhất với thiết kế độc đáo và phong cách hiện đại.</p>\r\n<p>Đội ngũ thiết kế của chúng tôi luôn cập nhật những xu hướng thời trang mới nhất từ khắp nơi trên thế giới, kết hợp với nét đẹp truyền thống Việt Nam để tạo ra những sản phẩm độc đáo và phù hợp với người Việt.</p>', '<h3>Sứ mệnh của chúng tôi</h3><p>Mang đến cho khách hàng những sản phẩm thời trang chất lượng cao, phong cách và giá cả hợp lý. Chúng tôi cam kết:</p><ul><li>Chất lượng sản phẩm luôn được đặt lên hàng đầu</li><li>Dịch vụ khách hàng tận tâm và chuyên nghiệp</li><li>Không ngừng đổi mới và sáng tạo trong thiết kế</li><li>Bảo vệ môi trường trong quá trình sản xuất</li></ul>', '<h3>Tầm nhìn<em> đến 2﻿</em>030</h3><p>Trở thành thương hiệu thời trang số 1 Việt Nam và vươn ra thị trường quốc tế. Chúng tôi hướng đến:</p><ul><li>Mở rộng hệ thống cửa hàng trên toàn quốc</li><li>Phát triển nền tảng thương mại điện tử mạnh mẽ</li><li>Hợp tác với các nhà thiết kế quốc tế</li><li>Xây dựng cộng đồng yêu thích thời trang bền vững</li></ul>', '<h3>Lịch sử hình thành</h3><p><strong>2013:</strong> Fashion Company được thành lập với cửa hàng đầu tiên tại TP.HCM</p><p><strong>2015:</strong> Mở rộng ra Hà Nội và các tỉnh thành lớn</p><p><strong>2017:</strong> Ra mắt website thương mại điện tử</p><p><strong>2019:</strong> Nhận giải thưởng \"Thương hiệu thời trang được yêu thích nhất\"</p><p><strong>2021:</strong> Mở nhà máy sản xuất riêng, đảm bảo chất lượng sản phẩm</p><p><strong>2023:</strong> Đạt mốc 50 cửa hàng trên toàn quốc</p><p><strong>2025:</strong> Khởi động dự án thời trang bền vững</p>', '<h3>Giá trị cốt lõi</h3><ul><li><strong>Chất lượng:</strong> Cam kết sản phẩm chất lượng cao, bền đẹp</li><li><strong>Sáng tạo:</strong> Luôn đổi mới trong thiết kế và phong cách</li><li><strong>Khách hàng:</strong> Đặt lợi ích khách hàng lên hàng đầu</li><li><strong>Trách nhiệm:</strong> Sản xuất thân thiện với môi trường</li><li><strong>Tận tâm:</strong> Phục vụ khách hàng với trái tim</li></ul>', '[\"http:\\/\\/localhost\\/Fashion-company\\/backend\\/uploads\\/about\\/about_691b530a2e001_1763398410.png\",\"about-2.jpg\",\"about-3.jpg\"]', '2025-11-16 16:13:20', '2025-11-17 16:53:35');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `slug` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` varchar(500) NOT NULL COMMENT 'Câu hỏi',
  `answer` text NOT NULL COMMENT 'Câu trả lời',
  `category` varchar(100) DEFAULT 'Chung' COMMENT 'Danh mục câu hỏi',
  `order_num` int(11) DEFAULT 0 COMMENT 'Thứ tự hiển thị',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Hiển thị hay không (0=ẩn, 1=hiện)',
  `views` int(11) DEFAULT 0 COMMENT 'Số lượt xem',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu câu hỏi thường gặp (FAQ)';

--
-- Đang đổ dữ liệu cho bảng `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `category`, `order_num`, `is_active`, `views`, `created_at`, `updated_at`) VALUES
(2, 'Làm thế nào để đặt hàng online?', '<p>Để đặt hàng online trên website Fashion Company, bạn thực hiện các bước sau:</p>\r\n<ol>\r\n<li>Đăng ký/Đăng nhập tài khoản</li>\r\n<li>Chọn sản phẩm và thêm vào giỏ hàng</li>\r\n<li>Vào giỏ hàng và nhấn \"Thanh toán\"</li>\r\n<li>Điền thông tin giao hàng và chọn phương thức thanh toán</li>\r\n<li>Xác nhận đơn hàng</li>\r\n</ol>\r\n<p>Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận đơn hàng.</p>', 'Mua hàng', 2, 1, 0, '2025-11-16 16:13:20', '2025-11-16 16:13:20'),
(3, 'Chính sách đổi trả như thế nào?', '<p>Fashion Company có chính sách đổi trả linh hoạt:</p>\r\n<ul>\r\n<li><strong>Thời gian:</strong> Trong vòng 7 ngày kể từ khi nhận hàng</li>\r\n<li><strong>Điều kiện:</strong> Sản phẩm còn nguyên tem mác, chưa qua sử dụng</li>\r\n<li><strong>Trường hợp được đổi trả:</strong> Lỗi do nhà sản xuất, sai size, sai màu</li>\r\n<li><strong>Chi phí:</strong> Miễn phí đổi hàng lần đầu, khách hàng chịu phí ship lần sau</li>\r\n</ul>\r\n<p>Liên hệ hotline hoặc đến trực tiếp cửa hàng để được hỗ trợ đổi trả.</p>', 'Chính sách', 3, 1, 0, '2025-11-16 16:13:20', '2025-11-16 16:13:20'),
(4, 'Có những phương thức thanh toán nào?', '<p>Fashion Company hỗ trợ nhiều phương thức thanh toán tiện lợi:</p>\r\n<ul>\r\n<li>Thanh toán khi nhận hàng (COD)</li>\r\n<li>Chuyển khoản ngân hàng</li>\r\n<li>Ví điện tử (Momo, ZaloPay, VNPay)</li>\r\n<li>Thẻ tín dụng/Thẻ ghi nợ (Visa, Master, JCB)</li>\r\n<li>Trả góp qua thẻ tín dụng (với đơn hàng từ 3 triệu)</li>\r\n</ul>', 'Thanh toán', 4, 1, 0, '2025-11-16 16:13:20', '2025-11-16 16:13:20'),
(5, 'Thời gian giao hàng là bao lâu?', '<p>Thời gian giao hàng phụ thuộc vào địa chỉ của bạn:</p>\r\n<ul>\r\n<li><strong>Nội thành TP.HCM, Hà Nội:</strong> 1-2 ngày làm việc</li>\r\n<li><strong>Các tỉnh thành lớn:</strong> 2-3 ngày làm việc</li>\r\n<li><strong>Vùng xa, vùng sâu:</strong> 3-5 ngày làm việc</li>\r\n</ul>\r\n<p>Đối với đơn hàng gấp, bạn có thể chọn dịch vụ giao hàng nhanh (có phụ phí).</p>', 'Vận chuyển', 5, 1, 0, '2025-11-16 16:13:20', '2025-11-16 16:13:20'),
(6, 'Làm sao để kiểm tra size phù hợp?', '<p>Fashion Company cung cấp bảng size chi tiết cho từng sản phẩm:</p>\r\n<ul>\r\n<li>Xem bảng size trong phần mô tả sản phẩm</li>\r\n<li>Đo số đo cơ thể theo hướng dẫn</li>\r\n<li>So sánh với bảng size để chọn size phù hợp</li>\r\n<li>Liên hệ tư vấn viên qua chat/hotline nếu chưa chắc chắn</li>\r\n</ul>\r\n<p><strong>Mẹo:</strong> Nếu số đo của bạn nằm giữa 2 size, nên chọn size lớn hơn để thoải mái.</p>', 'Sản phẩm', 6, 1, 0, '2025-11-16 16:13:20', '2025-11-16 16:13:20'),
(7, 'Có chương trình khuyến mãi nào không?', '<p>Fashion Company thường xuyên có các chương trình khuyến mãi hấp dẫn:</p>\r\n<ul>\r\n<li>Flash Sale cuối tuần</li>\r\n<li>Giảm giá đặc biệt vào các ngày lễ</li>\r\n<li>Ưu đãi cho thành viên mới</li>\r\n<li>Tích điểm đổi quà cho khách hàng thân thiết</li>\r\n<li>Voucher giảm giá qua email/SMS</li>\r\n</ul>\r\n<p>Theo dõi website và fanpage để không bỏ lỡ các chương trình khuyến mãi nhé!</p>', 'Khuyến mãi', 7, 1, 0, '2025-11-16 16:13:20', '2025-11-16 16:13:20'),
(8, 'Làm thế nào để trở thành thành viên VIP?', '<p>Chương trình thành viên của Fashion Company có 3 hạng:</p>\r\n<ul>\r\n<li><strong>Bạc:</strong> Tổng giá trị đơn hàng từ 5 triệu - Giảm 5%</li>\r\n<li><strong>Vàng:</strong> Tổng giá trị đơn hàng từ 10 triệu - Giảm 10%</li>\r\n<li><strong>Kim cương:</strong> Tổng giá trị đơn hàng từ 20 triệu - Giảm 15%</li>\r\n</ul>\r\n<p>Thành viên VIP còn được:</p>\r\n<ul>\r\n<li>Ưu tiên mua sản phẩm mới</li>\r\n<li>Miễn phí vận chuyển</li>\r\n<li>Quà tặng sinh nhật</li>\r\n<li>Tham gia sự kiện độc quyền</li>\r\n</ul>', 'Thành viên', 8, 1, 0, '2025-11-16 16:13:20', '2025-11-16 16:13:20'),
(9, 'Sản phẩm có bảo hành không?', '<p>Các sản phẩm tại Fashion Company được bảo hành như sau:</p>\r\n<ul>\r\n<li><strong>Quần áo:</strong> Đổi mới nếu bị lỗi trong vòng 30 ngày</li>\r\n<li><strong>Phụ kiện (túi, giày):</strong> Bảo hành 3-6 tháng</li>\r\n<li><strong>Đồ da:</strong> Bảo hành 6-12 tháng</li>\r\n</ul>\r\n<p>Bảo hành không áp dụng cho:</p>\r\n<ul>\r\n<li>Hư hỏng do sử dụng không đúng cách</li>\r\n<li>Sản phẩm đã qua giặt nhiều lần</li>\r\n<li>Hư hỏng do tác động bên ngoài</li>\r\n</ul>', 'Bảo hành', 9, 1, 0, '2025-11-16 16:13:20', '2025-11-16 16:13:20'),
(10, 'Có thể mua hàng với số lượng lớn không?', '<p>Fashion Company chào mừng các đơn hàng mua sỉ/số lượng lớn:</p>\r\n<ul>\r\n<li>Giảm giá đặc biệt cho đơn từ 20 sản phẩm trở lên</li>\r\n<li>Tư vấn miễn phí về phối hợp màu sắc, size</li>\r\n<li>Hỗ trợ đóng gói theo yêu cầu</li>\r\n<li>Ưu tiên giao hàng</li>\r\n</ul>\r\n<p>Vui lòng liên hệ phòng bán sỉ qua email: wholesale@fashioncompany.vn hoặc hotline: 1900-xxxx (máy lẻ 2) để được báo giá chi tiết.</p>', 'Mua sỉ', 10, 1, 0, '2025-11-16 16:13:20', '2025-11-16 16:13:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `stock` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(128) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `email_verified` tinyint(1) DEFAULT 0,
  `status` enum('active','locked') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `fullname`, `phone`, `avatar`, `role`, `email_verified`, `status`, `created_at`, `updated_at`, `last_login`) VALUES
(1, 'maristran72@gmail.com', '$2y$10$P/Cm.xuKH7lfarHpUHZK2exU9R5J2tqNmpwqFj5Yzk3Uk2wz.np.O', 'Trần Quốc Toàn', '0766983313', 'avatar_1_1763391369.png', 'admin', 0, 'active', '2025-11-17 11:58:45', '2025-11-17 14:56:09', NULL),
(2, 'maristran71@gmail.com', '$2y$10$xiLIl2wkXLLXafRIRD3Ry.JaLig9A6bdWq1GFszPK520tKDuwh.we', 'Trần Quốc B', '0766983312', NULL, 'customer', 0, 'active', '2025-11-17 13:38:38', '2025-11-17 14:45:42', NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `about`
--
ALTER TABLE `about`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_order_num` (`order_num`),
  ADD KEY `idx_category` (`category`);

--
-- Chỉ mục cho bảng `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_last_activity` (`last_activity`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_status` (`status`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `about`
--
ALTER TABLE `about`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


--
-- Cơ sở dữ liệu: `fashion_company` insert cho bảng `posts`
--

INSERT INTO posts (id, title, content, thumbnail, created_at) VALUES (
  0,
  'Bên Trong Nâng Cấp Atelier Của Chúng Tôi',
  'Sau nhiều tháng lên kế hoạch, việc làm mới atelier đã hoàn tất. Không gian mới cân bằng giữa công nghệ thủ công hiện đại và các chi tiết truyền thống tạo nên dấu ấn của thương hiệu.
Mỗi bàn làm việc hiện kết hợp công cụ dựng rập kỹ thuật số với thiết bị may đo thủ công, giúp các nghệ nhân linh hoạt thử nghiệm mà không đánh mất sự tinh tế cảm quan mà khách hàng mong đợi.
Chúng tôi cũng tạo nên một không gian cộng tác, nơi đội ngũ thiết kế, merchandising và sản xuất có thể xem mẫu cùng nhau. Kết quả: chu kỳ phát triển nhanh hơn, câu chuyện sản phẩm phong phú hơn và ít thỏa hiệp giữa ý tưởng và thực thi.',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
  '2025-02-14 10:00:00'
);

INSERT INTO posts (id, title, content, thumbnail, created_at) VALUES (
  1,
  'Bên Trong Phòng Thí Nghiệm Nhuộm Bền Vững Mới',
  'Phòng thí nghiệm nhuộm mới của chúng tôi sử dụng hệ thống lọc tuần hoàn khép kín, giúp giảm gần 70% lượng nước thải.
Các chuyên gia pha màu giờ đây có thể thử nghiệm sắc độ theo từng mẻ siêu nhỏ, rút ngắn thời gian phát triển mà không tốn nhiều nguyên liệu.
Phòng lab còn tích hợp hệ thống AI so khớp màu, đảm bảo độ đồng nhất giữa các đối tác sản xuất toàn cầu.',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
  '2025-03-01 09:00:00'
);

INSERT INTO posts (id, title, content, thumbnail, created_at) VALUES (
  2,
  'Cái Nhìn Đầu Tiên Về Bộ Sưu Tập Xuân 2025',
  'Mùa này khám phá sự tương phản giữa cấu trúc và sự thoải mái, sử dụng chất liệu nhuộm từ thực vật.
Các nhà thiết kế thử nghiệm khóa mô-đun và phom dáng chuyển đổi, có thể biến đổi theo chuyển động.
Bảng màu trải dài từ xanh xô thơm nhẹ đến những tông hoa rực rỡ, lấy cảm hứng từ sắc xuân đầu mùa.',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
  '2025-01-20 12:00:00'
);

INSERT INTO posts (id, title, content, thumbnail, created_at) VALUES (
  3,
  'Gặp Gỡ Yuki: Người Thợ May Bậc Thầy Đằng Sau Những Thiết Kế Áo Khoác Huy Hiệu Của Chúng Tôi',
  'Yuki gia nhập atelier hơn 12 năm trước và đã trở thành hình mẫu cho kỹ nghệ may đo chính xác.
Triết lý của cô kết hợp kỹ thuật thủ công truyền thống với sự hỗ trợ chọn lọc của máy móc để đảm bảo độ bền.
Cô cũng hướng dẫn các học viên mới, tập trung vào những kỹ thuật thủ công tinh tế tạo nên chất lượng cao cấp.',
  'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=1200&q=80',
  '2025-02-02 15:00:00'
);

INSERT INTO posts (id, title, content, thumbnail, created_at) VALUES (
  4,
  'Vải Sinh Học: Tương Lai Của Chất Liệu Xa Xỉ',
  'Chương trình vải sinh học của chúng tôi tập trung vào sợi tái tạo từ tảo, tre và cellulose nuôi cấy trong phòng thí nghiệm.
Những chất liệu này giữ được độ rủ sang trọng trong khi giảm đáng kể tác động môi trường.
Các sản phẩm thử nghiệm cho thấy độ thoáng khí và độ bền vượt trội so với chất liệu thông thường.',
  'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
  '2025-03-10 08:00:00'
);

INSERT INTO posts (id, title, content, thumbnail, created_at) VALUES (
  5,
  'Hồi Sinh Kho Lưu Trữ: Tái Tưởng Những Biểu Tượng Cho Một Thế Hệ Mới',
  'Dự án hồi sinh kho lưu trữ bắt đầu bằng việc phân loại hàng nghìn bản phác thảo, mẫu vải và nguyên mẫu.
Những phom dáng biểu tượng từ những năm 90 và đầu 2000 được diễn giải lại bằng chất liệu và kỹ thuật hiện đại.
Bộ sưu tập capsule này kết hợp hoài niệm với đổi mới, tôn vinh hành trình phát triển của thương hiệu.',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
  '2025-04-05 11:30:00'
);
