import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../contexts/ToastContext';

export default function AdminFAQ() {
    const toast = useToast();
    const [faqs, setFaqs] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'Chung',
        order_num: 0,
        is_active: true
    });
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        page: 1
    });

    useEffect(() => {
        fetchFAQs();
    }, [filters]);

    const fetchFAQs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: filters.page,
                limit: 10,
                ...(filters.search && { search: filters.search }),
                ...(filters.category && { category: filters.category })
            });

            const response = await axios.get(
                `http://localhost/Fashion-company/backend/api/faqs.php?${params}`,
                {
                    withCredentials: true,
                    headers: { 'Authorization': 'admin' }
                }
            );

            if (response.data.success) {
                setFaqs(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            toast.error('Không thể tải danh sách FAQ');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingFaq) {
                // Update
                await axios.put(
                    `http://localhost/Fashion-company/backend/api/faqs.php?id=${editingFaq.id}`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Authorization': 'admin' }
                    }
                );
                toast.success('Cập nhật FAQ thành công!');
            } else {
                // Create
                await axios.post(
                    'http://localhost/Fashion-company/backend/api/faqs.php',
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Authorization': 'admin' }
                    }
                );
                toast.success('Tạo FAQ thành công!');
            }

            setShowModal(false);
            resetForm();
            fetchFAQs();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleEdit = (faq) => {
        setEditingFaq(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category || 'Chung',
            order_num: faq.order_num || 0,
            is_active: Boolean(faq.is_active)
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa FAQ này?')) return;

        try {
            await axios.delete(
                `http://localhost/Fashion-company/backend/api/faqs.php?id=${id}`,
                {
                    withCredentials: true,
                    headers: { 'Authorization': 'admin' }
                }
            );
            toast.success('Xóa FAQ thành công!');
            fetchFAQs();
        } catch (err) {
            toast.error('Lỗi khi xóa FAQ');
        }
    };

    const resetForm = () => {
        setEditingFaq(null);
        setFormData({
            question: '',
            answer: '',
            category: 'Chung',
            order_num: 0,
            is_active: true
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý FAQ</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        + Thêm FAQ
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Tìm kiếm câu hỏi hoặc câu trả lời..."
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                        />
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                        >
                            <option value="">Tất cả danh mục</option>
                            <option value="Chung">Chung</option>
                            <option value="Đặt hàng">Đặt hàng</option>
                            <option value="Thanh toán">Thanh toán</option>
                            <option value="Vận chuyển">Vận chuyển</option>
                            <option value="Đổi trả">Đổi trả</option>
                        </select>
                    </div>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Câu hỏi</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thứ tự</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lượt xem</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {faqs.map((faq) => (
                                        <tr key={faq.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                    {faq.question}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {faq.category || 'Chung'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {faq.order_num || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${faq.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {faq.is_active ? 'Hoạt động' : 'Ẩn'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {faq.views || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(faq)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(faq.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                                    <div className="text-sm text-gray-700">
                                        Trang {pagination.page} / {pagination.totalPages} (Tổng: {pagination.total})
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingFaq ? 'Chỉnh sửa FAQ' : 'Thêm FAQ mới'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Câu hỏi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Câu trả lời <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Danh mục
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Chung">Chung</option>
                                        <option value="Đặt hàng">Đặt hàng</option>
                                        <option value="Thanh toán">Thanh toán</option>
                                        <option value="Vận chuyển">Vận chuyển</option>
                                        <option value="Đổi trả">Đổi trả</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Thứ tự hiển thị
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.order_num}
                                        onChange={(e) => setFormData({ ...formData, order_num: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                    Hiển thị công khai
                                </label>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    {editingFaq ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
