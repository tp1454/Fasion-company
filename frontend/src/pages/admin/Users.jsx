import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        role: '',
        status: '',
        page: 1
    });

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: filters.page,
                limit: 10,
                ...(filters.search && { search: filters.search }),
                ...(filters.role && { role: filters.role }),
                ...(filters.status && { status: filters.status })
            });

            const response = await axios.get(
                `http://localhost/Fashion-company/backend/api/admin/users.php?${params}`,
                { withCredentials: true }
            );

            setUsers(response.data.data);
            setPagination(response.data.pagination);
        } catch (err) {
            alert('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        if (!confirm('Bạn có chắc muốn thay đổi trạng thái người dùng này?')) return;

        try {
            const newStatus = currentStatus === 'active' ? 'locked' : 'active';
            await axios.put(
                'http://localhost/Fashion-company/backend/api/admin/users.php',
                { id: userId, action: 'toggle_status', status: newStatus },
                { withCredentials: true }
            );

            alert('Đã cập nhật trạng thái');
            fetchUsers();
        } catch (err) {
            alert('Lỗi khi cập nhật trạng thái');
        }
    };

    const handleResetPassword = async (userId) => {
        if (!confirm('Bạn có chắc muốn reset mật khẩu cho người dùng này?')) return;

        try {
            const response = await axios.put(
                'http://localhost/Fashion-company/backend/api/admin/users.php',
                { id: userId, action: 'reset_password' },
                { withCredentials: true }
            );

            alert(response.data.message);
        } catch (err) {
            alert('Lỗi khi reset mật khẩu');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters({ ...filters, page: 1 });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo email, tên, SĐT..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                        >
                            <option value="">Tất cả vai trò</option>
                            <option value="customer">Khách hàng</option>
                            <option value="admin">Quản trị viên</option>
                        </select>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="locked">Đã khóa</option>
                        </select>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        </div>
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                                                        {user.full_name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {user.role === 'admin' ? 'Admin' : 'Customer'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                                                </button>
                                                <button
                                                    onClick={() => handleResetPassword(user.id)}
                                                    className="text-orange-600 hover:text-orange-900 mr-3"
                                                >
                                                    Reset MK
                                                </button>
                                                <Link
                                                    to={`/admin/users/${user.id}`}
                                                    className="text-gray-600 hover:text-gray-900"
                                                >
                                                    Chi tiết
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                                    <div className="text-sm text-gray-700">
                                        Hiển thị <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> đến{' '}
                                        <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> trong{' '}
                                        <span className="font-medium">{pagination.total}</span> kết quả
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                            disabled={filters.page === 1}
                                            className="px-3 py-1 border rounded-md disabled:opacity-50"
                                        >
                                            Trước
                                        </button>
                                        <button
                                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                            disabled={filters.page >= pagination.totalPages}
                                            className="px-3 py-1 border rounded-md disabled:opacity-50"
                                        >
                                            Sau
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
