import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

export default function EditProfile() {
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const [formData, setFormData] = useState({
        full_name: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost/Fashion-company/backend/api/user/profile.php', {
                withCredentials: true
            });
            setFormData({
                full_name: response.data.full_name || '',
                phone: response.data.phone || ''
            });
            if (response.data.avatar) {
                setAvatarPreview(`http://localhost/Fashion-company/backend/uploads/avatars/${response.data.avatar}`);
            }
        } catch (err) {
            alert('Không thể tải thông tin');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file ảnh');
                return;
            }
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Kích thước file không được vượt quá 2MB');
                return;
            }
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatar) {
            alert('Vui lòng chọn ảnh trước');
            return;
        }

        setUploadingAvatar(true);
        const formDataAvatar = new FormData();
        formDataAvatar.append('avatar', avatar);

        try {
            const response = await axios.post(
                'http://localhost/Fashion-company/backend/api/user/avatar.php',
                formDataAvatar,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            alert('Cập nhật ảnh đại diện thành công!');
            setAvatar(null);

            // Update user in context
            const user = JSON.parse(localStorage.getItem('user'));
            updateUser({
                ...user,
                avatar: response.data.avatar
            });
        } catch (err) {
            alert(err.response?.data?.error || 'Lỗi khi upload ảnh');
        } finally {
            setUploadingAvatar(false);
        }
    };

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
        setSaving(true);

        try {
            const response = await axios.put(
                'http://localhost/Fashion-company/backend/api/user/profile.php',
                formData,
                { withCredentials: true }
            );

            // Update user in context
            const profileResponse = await axios.get('http://localhost/Fashion-company/backend/api/user/profile.php', {
                withCredentials: true
            });
            updateUser({
                ...JSON.parse(localStorage.getItem('user')),
                full_name: profileResponse.data.full_name
            });

            alert('Cập nhật thông tin thành công!');
            navigate('/profile');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert('Lỗi khi cập nhật thông tin');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Chỉnh sửa thông tin</h2>

                    {/* Avatar Upload Section */}
                    <div className="mb-8 pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Ảnh đại diện</h3>
                        <div className="flex items-center space-x-6">
                            <div className="flex-shrink-0">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-medium">
                                        {formData.full_name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    id="avatar"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="avatar"
                                    className="cursor-pointer inline-block px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Chọn ảnh
                                </label>
                                {avatar && (
                                    <button
                                        type="button"
                                        onClick={handleUploadAvatar}
                                        disabled={uploadingAvatar}
                                        className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {uploadingAvatar ? 'Đang tải lên...' : 'Tải lên'}
                                    </button>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    JPG, PNG hoặc GIF. Tối đa 2MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                required
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.full_name ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                value={formData.full_name}
                                onChange={handleChange}
                            />
                            {errors.full_name && (
                                <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Số điện thoại
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
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
