import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetail();
    }, [id]);

    const fetchUserDetail = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost/Fashion-company/backend/api/admin/users.php?id=${id}`,
                { withCredentials: true }
            );
            setUser(response.data);
        } catch (err) {
            alert('Không thể tải thông tin người dùng');
            navigate('/admin/users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!confirm('Bạn có chắc muốn thay đổi trạng thái người dùng này?')) return;

        try {
            const newStatus = user.status === 'active' ? 'locked' : 'active';
            await axios.put(
                'http://localhost/Fashion-company/backend/api/admin/users.php',
                { id: user.id, action: 'toggle_status', status: newStatus },
                { withCredentials: true }
            );

            alert('Đã cập nhật trạng thái');
            fetchUserDetail();
        } catch (err) {
            alert('Lỗi khi cập nhật trạng thái');
        }
    };

    const handleResetPassword = async () => {
        if (!confirm('Bạn có chắc muốn reset mật khẩu cho người dùng này?')) return;

        try {
            const response = await axios.put(
                'http://localhost/Fashion-company/backend/api/admin/users.php',
                { id: user.id, action: 'reset_password' },
                { withCredentials: true }
            );

            alert(response.data.message);
        } catch (err) {
            alert('Lỗi khi reset mật khẩu');
        }
    };

    const handleChangeRole = async () => {
        if (!confirm('Bạn có chắc muốn thay đổi vai trò người dùng này?')) return;

        try {
            const newRole = user.role === 'admin' ? 'customer' : 'admin';
            await axios.put(
                'http://localhost/Fashion-company/backend/api/admin/users.php',
                { id: user.id, action: 'change_role', role: newRole },
                { withCredentials: true }
            );

            alert('Đã thay đổi vai trò');
            fetchUserDetail();
        } catch (err) {
            alert('Lỗi khi thay đổi vai trò');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Không tìm thấy người dùng</p>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="mt-4 text-indigo-600 hover:text-indigo-800"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Chi tiết người dùng</h1>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        ← Quay lại
                    </button>
                </div>

                {/* User Info Card */}
                <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                    <div className="px-6 py-8">
                        <div className="flex items-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-medium">
                                {user.full_name.charAt(0)}
                            </div>
                            <div className="ml-6">
                                <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">ID</label>
                                <p className="text-gray-900">{user.id}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                <p className="text-gray-900">{user.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Họ và tên</label>
                                <p className="text-gray-900">{user.full_name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
                                <p className="text-gray-900">{user.phone || 'Chưa cập nhật'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Vai trò</label>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Trạng thái</label>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {user.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Email đã xác thực</label>
                                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${user.email_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {user.email_verified ? 'Đã xác thực' : 'Chưa xác thực'}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Ngày tạo</label>
                                <p className="text-gray-900">
                                    {new Date(user.created_at).toLocaleString('vi-VN')}
                                </p>
                            </div>

                            {user.updated_at && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Cập nhật lần cuối</label>
                                    <p className="text-gray-900">
                                        {new Date(user.updated_at).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            )}

                            {user.last_login && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Đăng nhập lần cuối</label>
                                    <p className="text-gray-900">
                                        {new Date(user.last_login).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác quản lý</h3>
                    <div className="space-y-3">
                        <button
                            onClick={handleToggleStatus}
                            className={`w-full px-4 py-2 rounded-md font-medium ${user.status === 'active'
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                        >
                            {user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                        </button>

                        <button
                            onClick={handleResetPassword}
                            className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium"
                        >
                            Reset mật khẩu
                        </button>

                        <button
                            onClick={handleChangeRole}
                            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium"
                        >
                            Chuyển thành {user.role === 'admin' ? 'Khách hàng' : 'Quản trị viên'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
