import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ChangePassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirm: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            await axios.put(
                'http://localhost/Fashion-company/backend/api/user/password.php',
                formData,
                { withCredentials: true }
            );

            alert('Đổi mật khẩu thành công!');
            navigate('/profile');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert('Lỗi khi đổi mật khẩu');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu hiện tại <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="current_password"
                                name="current_password"
                                type="password"
                                required
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.current_password ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                value={formData.current_password}
                                onChange={handleChange}
                            />
                            {errors.current_password && (
                                <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu mới <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="new_password"
                                name="new_password"
                                type="password"
                                required
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.new_password ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                value={formData.new_password}
                                onChange={handleChange}
                            />
                            {errors.new_password && (
                                <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">Tối thiểu 6 ký tự</p>
                        </div>

                        <div>
                            <label htmlFor="new_password_confirm" className="block text-sm font-medium text-gray-700">
                                Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="new_password_confirm"
                                name="new_password_confirm"
                                type="password"
                                required
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.new_password_confirm ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                value={formData.new_password_confirm}
                                onChange={handleChange}
                            />
                            {errors.new_password_confirm && (
                                <p className="mt-1 text-sm text-red-600">{errors.new_password_confirm}</p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
