import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RichTextEditor from '../../components/editor/RichTextEditor';
import {
  createAdminPost,
  updateAdminPost,
  fetchAdminPost,
  uploadPostImage,
} from '../../services/adminPosts';

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const res = await fetchAdminPost(id);
        const data = res?.data?.[0] || res?.data || {};
        setTitle(data.title || '');
        setContent(data.content || '');
        setThumbnail(data.thumbnail || '');
      } catch (err) {
        console.error('Load post for edit', err);
      }
    };
    load();
  }, [id, isEdit]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadPostImage(file);
      if (res?.success && res.url) {
        setThumbnail(res.url);
      } else if (res?.url) {
        setThumbnail(res.url);
      } else {
        alert(res?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Tiêu đề và nội dung là bắt buộc');
      return;
    }

    setIsSaving(true);
    try {
      const payload = { title: title.trim(), content, thumbnail };
      if (isEdit) {
        await updateAdminPost(id, payload);
        alert('Cập nhật thành công');
      } else {
        await createAdminPost(payload);
        alert('Tạo bài viết thành công');
      }
      navigate('/admin/posts');
    } catch (err) {
      console.error('Save error', err);
      alert('Lưu thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Sửa bài viết' : 'Tạo bài viết mới'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hình đại diện (URL)</label>
          <input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
          <div className="mt-2">
            <label className="inline-block mr-2 text-sm">Or upload:</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            {isUploading && <span className="ml-2 text-sm text-gray-500">Đang tải...</span>}
          </div>
          {thumbnail && (
            <div className="mt-3">
              <img src={thumbnail} alt="thumbnail" className="max-h-40 object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nội dung</label>
          <div className="mt-2">
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate('/admin/posts')}>Hủy</button>
        </div>
      </form>
    </section>
  );
}
