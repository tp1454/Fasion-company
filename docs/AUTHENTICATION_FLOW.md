# 🔐 Hệ Thống Phân Quyền - Fashion Company

## 📋 Tổng Quan

Dự án sử dụng **Session-based Authentication** kết hợp với **Role-based Access Control (RBAC)** để quản lý đăng nhập và phân quyền người dùng.

### Các Role trong hệ thống:
- **👤 Customer**: Khách hàng thông thường (có thể xem sản phẩm, quản lý profile)
- **👨‍💼 Admin**: Quản trị viên (có toàn quyền quản lý hệ thống)

---

## 🔄 Luồng Hoạt Động Chi Tiết

### 1️⃣ **Đăng Nhập (Login Flow)**

```
┌─────────────┐          ┌─────────────┐          ┌──────────────┐
│   Browser   │          │   React     │          │   PHP API    │
│  (Frontend) │          │  AuthContext│          │   Backend    │
└──────┬──────┘          └──────┬──────┘          └──────┬───────┘
       │                        │                        │
       │  1. Nhập email/pass    │                        │
       │────────────────────────>│                        │
       │                        │                        │
       │                        │  2. POST /api/auth/login.php
       │                        │  { email, password }   │
       │                        │───────────────────────>│
       │                        │                        │
       │                        │                3. Query Database
       │                        │                   ✓ Verify password
       │                        │                        │
       │                        │                4. Create Session
       │                        │                   $_SESSION['user_id']
       │                        │                   $_SESSION['user_role']
       │                        │                   $_SESSION['user_email']
       │                        │                        │
       │                        │  5. Return user data   │
       │                        │<───────────────────────│
       │                        │  + Set-Cookie (PHPSESSID)
       │                        │                        │
       │  6. Save to state &    │                        │
       │     localStorage       │                        │
       │<───────────────────────│                        │
       │                        │                        │
       │  7. Redirect to /      │                        │
       │    or /admin/dashboard │                        │
       │<───────────────────────│                        │
```

#### 📝 Chi tiết từng bước:

**Bước 1-2: Frontend gửi request**
- File: `frontend/src/contexts/AuthContext.jsx`
- Function: `login(email, password)`
- Gửi POST request với credentials

**Bước 3: Backend xác thực**
- File: `backend/api/auth/login.php`
- Query database tìm user theo email
- Verify password bằng `password_verify()`
- Kiểm tra status (nếu locked → từ chối)

**Bước 4: Tạo Session**
- File: `backend/includes/session.php`
- Function: `loginUser($user)`
- Lưu thông tin vào `$_SESSION`:
  ```php
  $_SESSION['user_id'] = $user['id'];
  $_SESSION['user_email'] = $user['email'];
  $_SESSION['user_role'] = $user['role'];  // 'admin' or 'customer'
  $_SESSION['user_name'] = $user['full_name'];
  $_SESSION['user_avatar'] = $user['avatar'];
  ```

**Bước 5-6: Frontend lưu trữ**
- Lưu vào React State (AuthContext)
- Lưu vào localStorage (backup)
- Cookie `PHPSESSID` được tự động lưu bởi browser

---

### 2️⃣ **Kiểm Tra Đăng Nhập (Check Auth Flow)**

```
┌─────────────┐          ┌─────────────┐          ┌──────────────┐
│   Browser   │          │   React     │          │   PHP API    │
└──────┬──────┘          └──────┬──────┘          └──────┬───────┘
       │                        │                        │
       │                        │  1. App Load/Refresh   │
       │                        │    useEffect()         │
       │                        │                        │
       │                        │  2. GET /api/auth/check.php
       │                        │  (withCredentials: true)
       │                        │───────────────────────>│
       │                        │  Cookie: PHPSESSID     │
       │                        │                        │
       │                        │                3. Start Session
       │                        │                   session_start()
       │                        │                        │
       │                        │                4. Check $_SESSION
       │                        │                   ✓ user_id exists?
       │                        │                   ✓ user_role exists?
       │                        │                        │
       │                        │  5. Return auth status │
       │                        │<───────────────────────│
       │                        │  { authenticated: true,│
       │                        │    user: {...} }       │
       │                        │                        │
       │  6. Update React State │                        │
       │     setUser(userData)  │                        │
       │<───────────────────────│                        │
       │                        │                        │
       │  7. Render UI          │                        │
       │    (Show user menu)    │                        │
```

#### 📝 Chi tiết từng bước:

**Bước 1-2: Auto-check khi load app**
- File: `frontend/src/contexts/AuthContext.jsx`
- Chạy trong `useEffect()` khi app khởi động
- Gửi GET request kèm cookie

**Bước 3-4: Backend kiểm tra session**
- File: `backend/api/auth/check.php`
- Function: `isLoggedIn()` trong `session.php`
- Kiểm tra `$_SESSION['user_id']` và `$_SESSION['user_email']`

**Bước 5-6: Trả về kết quả**
- Nếu có session → `{ authenticated: true, user: {...} }`
- Nếu không → `{ authenticated: false, user: null }`
- Frontend cập nhật state

---

### 3️⃣ **Bảo Vệ Route (Protected Route Flow)**

```
┌─────────────┐          ┌─────────────┐          ┌──────────────┐
│   Browser   │          │   React     │          │ ProtectedRoute│
└──────┬──────┘          └──────┬──────┘          └──────┬───────┘
       │                        │                        │
       │  1. Click vào          │                        │
       │     /profile hoặc      │                        │
       │     /admin/dashboard   │                        │
       │────────────────────────>│                        │
       │                        │                        │
       │                        │  2. Check AuthContext  │
       │                        │───────────────────────>│
       │                        │                        │
       │                        │                3. Check:
       │                        │                   • user exists?
       │                        │                   • adminOnly?
       │                        │                   • user.role === 'admin'?
       │                        │                        │
       │                        │  4a. ✅ Allowed        │
       │                        │      Render children   │
       │  Display Page          │<───────────────────────│
       │<───────────────────────│                        │
       │                        │                        │
       │                   OR   │  4b. ❌ Not logged in  │
       │                        │      <Navigate to="/login"/>
       │  Redirect to /login    │<───────────────────────│
       │<───────────────────────│                        │
       │                        │                        │
       │                   OR   │  4c. ❌ Not admin      │
       │                        │      <Navigate to="/" />
       │  Redirect to /         │<───────────────────────│
       │<───────────────────────│                        │
```

#### 📝 Chi tiết từng bước:

**Component: ProtectedRoute**
- File: `frontend/src/components/auth/ProtectedRoute.jsx`
- Props: `children` (component cần bảo vệ), `adminOnly` (boolean)

**Logic kiểm tra:**
```javascript
// 1. Nếu đang loading → hiển thị spinner
if (loading) return <LoadingSpinner />

// 2. Nếu chưa đăng nhập → redirect login
if (!user) return <Navigate to="/login" />

// 3. Nếu cần admin nhưng user không phải admin → redirect home
if (adminOnly && user.role !== 'admin') return <Navigate to="/" />

// 4. Pass tất cả → render children
return children
```

**Cách sử dụng trong App.jsx:**
```jsx
// Route cho user thông thường
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />

// Route chỉ cho admin
<Route path="/admin/dashboard" element={
  <ProtectedRoute adminOnly>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

### 4️⃣ **Bảo Vệ API (Backend Authorization)**

```
┌─────────────┐          ┌─────────────┐          ┌──────────────┐
│   Browser   │          │   React     │          │   PHP API    │
└──────┬──────┘          └──────┬──────┘          └──────┬───────┘
       │                        │                        │
       │  1. Request to         │                        │
       │     /api/admin/users   │                        │
       │────────────────────────>│                        │
       │                        │                        │
       │                        │  2. GET /api/admin/users
       │                        │  (withCredentials: true)
       │                        │───────────────────────>│
       │                        │  Cookie: PHPSESSID     │
       │                        │                        │
       │                        │                3. Start Session
       │                        │                   startSecureSession()
       │                        │                        │
       │                        │                4. Check Auth
       │                        │                   ✓ $_SESSION['user_id']?
       │                        │                   ✓ $_SESSION['user_role']?
       │                        │                        │
       │                        │                5. Check Admin
       │                        │                   ❌ role !== 'admin'
       │                        │                        │
       │                        │  6. Return 403 Forbidden
       │                        │<───────────────────────│
       │  Show error toast      │  { error: 'Admin access required' }
       │<───────────────────────│                        │
       │                        │                        │
       │                   OR   │                7. ✅ Is Admin
       │                        │                   Execute query
       │                        │                   Return data
       │  Display data          │<───────────────────────│
       │<───────────────────────│                        │
```

#### 📝 Chi tiết từng bước:

**Backend Authorization Pattern:**
- File: `backend/api/admin/*.php`

**Kiểm tra authentication:**
```php
// 1. Start session
startSecureSession();

// 2. Check nếu user đã đăng nhập
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

// 3. Check role admin
if ($_SESSION['user_role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Admin access required']);
    exit;
}

// 4. Nếu pass → Xử lý request
```

**Helper Functions trong session.php:**
```php
// Kiểm tra đăng nhập
isLoggedIn()  // Kiểm tra $_SESSION['user_id']

// Kiểm tra admin
isAdmin()  // Kiểm tra role === 'admin'

// Require login (auto return 401)
requireLogin()

// Require admin (auto return 403)
requireAdmin()
```

---

### 5️⃣ **Đăng Xuất (Logout Flow)**

```
┌─────────────┐          ┌─────────────┐          ┌──────────────┐
│   Browser   │          │   React     │          │   PHP API    │
└──────┬──────┘          └──────┬──────┘          └──────┬───────┘
       │                        │                        │
       │  1. Click "Đăng xuất" │                        │
       │────────────────────────>│                        │
       │                        │                        │
       │                        │  2. POST /api/auth/logout.php
       │                        │───────────────────────>│
       │                        │                        │
       │                        │                3. Destroy Session
       │                        │                   $_SESSION = []
       │                        │                   session_destroy()
       │                        │                   Clear cookie
       │                        │                        │
       │                        │  4. Return success     │
       │                        │<───────────────────────│
       │                        │                        │
       │  5. Clear React State  │                        │
       │     setUser(null)      │                        │
       │     localStorage.clear()│                        │
       │<───────────────────────│                        │
       │                        │                        │
       │  6. Redirect to /      │                        │
       │<───────────────────────│                        │
```

#### 📝 Chi tiết từng bước:

**Bước 1-2: Frontend trigger logout**
- File: `frontend/src/contexts/AuthContext.jsx`
- Function: `logout()`

**Bước 3: Backend destroy session**
- File: `backend/api/auth/logout.php`
- Function: `logoutUser()` trong `session.php`
- Xóa tất cả session data
- Xóa session cookie
- Hủy session

**Bước 4-5: Frontend cleanup**
- Clear React state
- Clear localStorage
- Redirect về trang chủ

---

## 🛡️ Bảo Mật (Security Features)

### 1. **Session Security**
```php
// File: backend/includes/session.php

ini_set('session.cookie_httponly', 1);  // Chống XSS
ini_set('session.cookie_secure', isset($_SERVER['HTTPS']));  // HTTPS only
ini_set('session.use_only_cookies', 1);  // Chỉ dùng cookie
ini_set('session.cookie_samesite', 'Lax');  // Chống CSRF
ini_set('session.gc_maxlifetime', 1800);  // Timeout 30 phút
```

### 2. **Session Regeneration**
- Regenerate session ID mỗi 5 phút
- Regenerate khi đăng nhập
- Chống **Session Fixation Attack**

### 3. **Password Security**
- Sử dụng `password_hash()` để mã hóa
- Sử dụng `password_verify()` để kiểm tra
- Không bao giờ lưu password dạng plain text

### 4. **CORS Configuration**
```php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');  // Cho phép cookie
```

### 5. **Multi-layer Protection**
- ✅ Frontend: ProtectedRoute component
- ✅ Backend: Session check trong mỗi API
- ✅ Database: Role column trong users table

---

## 📂 Cấu Trúc File

```
Fashion-company/
├── frontend/src/
│   ├── contexts/
│   │   └── AuthContext.jsx           # 🔐 Quản lý authentication state
│   ├── components/
│   │   └── auth/
│   │       └── ProtectedRoute.jsx    # 🛡️ Bảo vệ route frontend
│   └── pages/
│       ├── auth/
│       │   ├── Login.jsx             # 📝 Form đăng nhập
│       │   └── Register.jsx          # 📝 Form đăng ký
│       └── admin/                    # 👨‍💼 Admin pages (chỉ admin)
│
└── backend/
    ├── includes/
    │   └── session.php               # 🔧 Helper functions cho session
    ├── api/
    │   ├── auth/
    │   │   ├── login.php             # 🔑 API đăng nhập
    │   │   ├── logout.php            # 🚪 API đăng xuất
    │   │   └── check.php             # ✅ API kiểm tra auth
    │   └── admin/                    # 🔒 Protected APIs (chỉ admin)
    │       ├── users.php
    │       ├── upload-about-image.php
    │       └── ...
    └── config/
        └── db.php                    # 🗄️ Database connection
```

---

## 🎯 Luồng Xác Thực Hoàn Chỉnh

```
🌐 Browser                 ⚛️ React App              🐘 PHP Backend           🗄️ Database
    │                          │                          │                      │
    │  1. Access /login        │                          │                      │
    ├─────────────────────────>│                          │                      │
    │                          │                          │                      │
    │  2. Enter credentials    │                          │                      │
    ├─────────────────────────>│  3. POST login.php       │                      │
    │                          ├─────────────────────────>│  4. Query user       │
    │                          │                          ├─────────────────────>│
    │                          │                          │  5. Return user data │
    │                          │                          │<─────────────────────┤
    │                          │  6. Create session       │                      │
    │                          │     Save to $_SESSION    │                      │
    │                          │<─────────────────────────┤                      │
    │  7. Save to state        │                          │                      │
    │     + localStorage       │                          │                      │
    │<─────────────────────────┤                          │                      │
    │  8. Set cookie (PHPSESSID)                          │                      │
    │<────────────────────────────────────────────────────┤                      │
    │                          │                          │                      │
    │  9. Access /admin/users  │                          │                      │
    ├─────────────────────────>│  10. Check ProtectedRoute│                      │
    │                          │      ✓ user exists?      │                      │
    │                          │      ✓ adminOnly?        │                      │
    │                          │      ✓ role === admin?   │                      │
    │                          │                          │                      │
    │                          │  11. GET users.php       │                      │
    │                          ├─────────────────────────>│  12. Check session   │
    │                          │      (send cookie)       │      ✓ user_id?      │
    │                          │                          │      ✓ user_role?    │
    │                          │                          │      ✓ === 'admin'?  │
    │                          │                          │                      │
    │                          │                          │  13. Query users     │
    │                          │                          ├─────────────────────>│
    │                          │                          │  14. Return data     │
    │                          │                          │<─────────────────────┤
    │                          │  15. Return JSON         │                      │
    │                          │<─────────────────────────┤                      │
    │  16. Display page        │                          │                      │
    │<─────────────────────────┤                          │                      │
```

---

## 💡 Các Trường Hợp Đặc Biệt

### ❌ Khi Session Hết Hạn (30 phút)
```
User → Request API → Backend check session → Session expired
                                          ↓
                              Return 401 Unauthorized
                                          ↓
                          Frontend detect → Clear state → Redirect /login
```

### ❌ Khi User Bị Khóa (status = 'locked')
```
User → Login → Backend check status → Status = 'locked'
                                          ↓
                              Return 403 Forbidden
                              "Tài khoản đã bị khóa"
```

### ❌ Khi Customer Truy Cập Admin Route
```
Customer → /admin/dashboard → ProtectedRoute check → role !== 'admin'
                                                           ↓
                                                   Redirect to /
```

### ✅ Khi Admin Truy Cập
```
Admin → /admin/dashboard → ProtectedRoute check → ✓ user exists
                                                 → ✓ role === 'admin'
                                                 ↓
                                           Render page
```

---

## 🔍 Debug & Testing

### Kiểm tra Session trong PHP:
```php
// Thêm vào đầu file API
session_start();
error_log('Session data: ' . print_r($_SESSION, true));
```

### Kiểm tra Auth trong React:
```javascript
// Thêm vào component
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  console.log('Current user:', user);
  console.log('Is admin:', user?.role === 'admin');
}
```

### Kiểm tra Cookie trong Browser:
1. Mở **DevTools** (F12)
2. Tab **Application** → **Cookies**
3. Tìm `PHPSESSID`

---

## 📚 Tóm Tắt

| Thành phần | Vai trò | File chính |
|-----------|---------|-----------|
| **AuthContext** | Quản lý state authentication | `frontend/src/contexts/AuthContext.jsx` |
| **ProtectedRoute** | Bảo vệ route frontend | `frontend/src/components/auth/ProtectedRoute.jsx` |
| **Session Functions** | Helper functions PHP | `backend/includes/session.php` |
| **Login API** | Xử lý đăng nhập | `backend/api/auth/login.php` |
| **Check API** | Kiểm tra session | `backend/api/auth/check.php` |
| **Admin APIs** | Protected endpoints | `backend/api/admin/*.php` |

---

## 🚀 Flow Nhanh (TL;DR)

1. **Login**: Email/Pass → Verify → Create Session → Save cookie + state
2. **Check**: Load app → Check session → Update state
3. **Access**: Click route → ProtectedRoute check → Allow/Deny
4. **API Call**: Request → Check session + role → Return data/error
5. **Logout**: Clear session → Clear state → Redirect

---

## 🎓 Best Practices

✅ **DO:**
- Luôn kiểm tra session trong mỗi API protected
- Sử dụng `withCredentials: true` khi gọi API
- Regenerate session ID định kỳ
- Hash password với `password_hash()`
- Set session timeout (30 phút)

❌ **DON'T:**
- Lưu password plain text
- Trust frontend validation alone
- Skip backend authorization check
- Expose sensitive data in error messages
- Use weak session configuration

---

**📅 Created:** November 18, 2025  
**👨‍💻 Author:** Fashion Company Dev Team  
**🔄 Version:** 1.0
