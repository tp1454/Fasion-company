import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RichTextEditor from '../../components/editor/RichTextEditor';
import { useToast } from '../../contexts/ToastContext';

export default function AdminAbout() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [aboutData, setAboutData] = useState({
        title: '',
        content: '',
        mission: '',
        vision: '',
        history: '',
        values: '',
        images: []
    });
    const [imageUrls, setImageUrls] = useState(['', '', '']);
    const [uploading, setUploading] = useState([false, false, false]);

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                'http://localhost/Fashion-company/backend/api/about.php',
                { withCredentials: true }
            );

            if (response.data.success && response.data.data) {
                const data = response.data.data;
                setAboutData(data);

                // Set image URLs if available
                if (data.images && Array.isArray(data.images)) {
                    setImageUrls([
                        data.images[0] || '',
                        data.images[1] || '',
                        data.images[2] || ''
                    ]);
                }
            }
        } catch (err) {
            toast.error('Không thể tải thông tin giới thiệu');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Update images array with current imageUrls
            const dataToSave = {
                ...aboutData,
                images: imageUrls.filter(url => url.trim() !== '')
            };

            await axios.put(
                'http://localhost/Fashion-company/backend/api/about.php',
                dataToSave,
                {
                    withCredentials: true,
                    headers: { 'Authorization': 'admin' }
                }
            );
            toast.success('Cập nhật thành công!');
            setEditingField(null);
            fetchAbout(); // Reload data
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUrlChange = (index, value) => {
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = value;
        setImageUrls(newImageUrls);
    };

    const handleImageUpload = async (index, file) => {
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.warning('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.warning('Kích thước file không được vượt quá 5MB');
            return;
        }

        // Set uploading state
        const newUploading = [...uploading];
        newUploading[index] = true;
        setUploading(newUploading);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(
                'http://localhost/Fashion-company/backend/api/admin/upload-about-image.php',
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                const fullUrl = `http://localhost${response.data.url}`;
                const newImageUrls = [...imageUrls];
                newImageUrls[index] = fullUrl;
                setImageUrls(newImageUrls);
                toast.success('Upload ảnh thành công!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Có lỗi khi upload ảnh');
        } finally {
            const newUploading = [...uploading];
            newUploading[index] = false;
            setUploading(newUploading);
        }
    };

    const handleRemoveImage = (index) => {
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = '';
        setImageUrls(newImageUrls);
    };

    const handleFieldClick = (field) => {
        setEditingField(field);
    };

    const handleChange = (field, value) => {
        setAboutData({
            ...aboutData,
            [field]: value
        });
    };

    const EditableSection = ({ field, children, className = "", isCard = false }) => {
        const isEditing = editingField === field;

        return (
            <div
                className={`relative group ${className}`}
                onClick={() => !isEditing && handleFieldClick(field)}
            >
                {!isEditing && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded cursor-pointer">
                            ✏️ Click để sửa
                        </span>
                    </div>
                )}
                {isEditing && (
                    <div className={`absolute ${isCard ? 'top-2 right-2' : 'top-4 right-4'} flex gap-2 z-20`}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingField(null);
                            }}
                            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSave();
                            }}
                            disabled={saving}
                            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {saving ? 'Đang lưu...' : '💾 Lưu'}
                        </button>
                    </div>
                )}
                {children}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
                <div className="container mx-auto px-4">
                    <EditableSection field="title" className="cursor-pointer">
                        {editingField === 'title' ? (
                            <input
                                type="text"
                                className="text-4xl md:text-5xl font-bold text-center mb-4 w-full bg-white text-gray-900 px-4 py-2 rounded"
                                value={aboutData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
                                {aboutData.title || 'Giới thiệu'}
                            </h1>
                        )}
                    </EditableSection>
                    <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
                        Khám phá câu chuyện của chúng tôi
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {/* Content Section */}
                    <EditableSection field="content" className="bg-white rounded-lg shadow-md p-8 mb-12 cursor-pointer">
                        {editingField === 'content' ? (
                            <div onClick={(e) => e.stopPropagation()}>
                                <RichTextEditor
                                    content={aboutData.content}
                                    onChange={(html) => handleChange('content', html)}
                                    placeholder="Nhập nội dung giới thiệu..."
                                />
                            </div>
                        ) : (
                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: aboutData.content || '<p className="text-gray-500">Click để thêm nội dung...</p>' }}
                            />
                        )}
                    </EditableSection>

                    {/* Mission, Vision, Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {/* Mission */}
                        <EditableSection field="mission" isCard={true} className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 rounded-full p-3 mr-4">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Sứ mệnh</h2>
                            </div>
                            {editingField === 'mission' ? (
                                <div onClick={(e) => e.stopPropagation()}>
                                    <RichTextEditor
                                        content={aboutData.mission}
                                        onChange={(html) => handleChange('mission', html)}
                                        placeholder="Nhập sứ mệnh..."
                                    />
                                </div>
                            ) : (
                                <div
                                    className="prose"
                                    dangerouslySetInnerHTML={{ __html: aboutData.mission || '<p className="text-gray-400">Click để thêm sứ mệnh...</p>' }}
                                />
                            )}
                        </EditableSection>

                        {/* Vision */}
                        <EditableSection field="vision" isCard={true} className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 rounded-full p-3 mr-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Tầm nhìn</h2>
                            </div>
                            {editingField === 'vision' ? (
                                <div onClick={(e) => e.stopPropagation()}>
                                    <RichTextEditor
                                        content={aboutData.vision}
                                        onChange={(html) => handleChange('vision', html)}
                                        placeholder="Nhập tầm nhìn..."
                                    />
                                </div>
                            ) : (
                                <div
                                    className="prose"
                                    dangerouslySetInnerHTML={{ __html: aboutData.vision || '<p className="text-gray-400">Click để thêm tầm nhìn...</p>' }}
                                />
                            )}
                        </EditableSection>

                        {/* Values */}
                        <EditableSection field="values" isCard={true} className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 rounded-full p-3 mr-4">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Giá trị</h2>
                            </div>
                            {editingField === 'values' ? (
                                <div onClick={(e) => e.stopPropagation()}>
                                    <RichTextEditor
                                        content={aboutData.values}
                                        onChange={(html) => handleChange('values', html)}
                                        placeholder="Nhập giá trị cốt lõi..."
                                    />
                                </div>
                            ) : (
                                <div
                                    className="prose"
                                    dangerouslySetInnerHTML={{ __html: aboutData.values || '<p className="text-gray-400">Click để thêm giá trị...</p>' }}
                                />
                            )}
                        </EditableSection>
                    </div>

                    {/* History */}
                    <EditableSection field="history" className="bg-white rounded-lg shadow-md p-8 mb-12 cursor-pointer">
                        <div className="flex items-center mb-6">
                            <div className="bg-yellow-100 rounded-full p-3 mr-4">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">Lịch sử hình thành</h2>
                        </div>
                        {editingField === 'history' ? (
                            <div onClick={(e) => e.stopPropagation()}>
                                <RichTextEditor
                                    content={aboutData.history}
                                    onChange={(html) => handleChange('history', html)}
                                    placeholder="Nhập lịch sử hình thành..."
                                />
                            </div>
                        ) : (
                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: aboutData.history || '<p className="text-gray-400">Click để thêm lịch sử...</p>' }}
                            />
                        )}
                    </EditableSection>

                    {/* Images Section */}
                    <EditableSection field="images" className="bg-white rounded-lg shadow-md p-8 cursor-pointer">
                        <div className="flex items-center mb-6">
                            <div className="bg-pink-100 rounded-full p-3 mr-4">
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">Hình ảnh</h2>
                        </div>

                        {editingField === 'images' ? (
                            <div onClick={(e) => e.stopPropagation()} className="space-y-6">
                                <p className="text-sm text-gray-600 mb-4">
                                    📤 Upload hình ảnh từ máy tính (tối đa 3 ảnh, mỗi ảnh &lt; 5MB)
                                </p>
                                {[0, 1, 2].map((index) => (
                                    <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Hình ảnh {index + 1}
                                        </label>

                                        {/* Upload Button */}
                                        <div className="flex gap-2 mb-3">
                                            <label className="flex-1 cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) handleImageUpload(index, file);
                                                        e.target.value = ''; // Reset input
                                                    }}
                                                    className="hidden"
                                                    disabled={uploading[index]}
                                                />
                                                <div className={`px-4 py-2 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700 transition ${uploading[index] ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                    {uploading[index] ? '⏳ Đang upload...' : '📁 Chọn file'}
                                                </div>
                                            </label>

                                            {imageUrls[index] && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                                    disabled={uploading[index]}
                                                >
                                                    🗑️ Xóa
                                                </button>
                                            )}
                                        </div>

                                        {/* Preview */}
                                        {imageUrls[index] && (
                                            <div className="mt-3">
                                                <img
                                                    src={imageUrls[index]}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-48 object-cover rounded-md border border-gray-200"
                                                    onError={(e) => {
                                                        if (!e.target.dataset.errorHandled) {
                                                            e.target.dataset.errorHandled = 'true';
                                                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3EInvalid Image%3C/text%3E%3C/svg%3E';
                                                        }
                                                    }}
                                                />
                                                <p className="text-xs text-gray-500 mt-2 break-all">
                                                    {imageUrls[index]}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {imageUrls.filter(url => url).length > 0 ? (
                                    imageUrls.filter(url => url).map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`About ${index + 1}`}
                                                className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                                                onError={(e) => {
                                                    if (!e.target.dataset.errorHandled) {
                                                        e.target.dataset.errorHandled = 'true';
                                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%239ca3af"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                                                    }
                                                }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center text-gray-400 py-8">
                                        <p>Click để thêm hình ảnh...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </EditableSection>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gray-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Hãy trở thành một phần của chúng tôi</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Khám phá bộ sưu tập thời trang mới nhất và trải nghiệm phong cách sống hiện đại
                    </p>
                </div>
            </section>
        </div>
    );
}
