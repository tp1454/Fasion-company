import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import { fetchAdminPosts, deleteAdminPost } from '../../services/adminPosts';

const PAGE_SIZE = 10;

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const load = async (page = 1, q = '') => {
    setIsLoading(true);
    try {
      const res = await fetchAdminPosts({ page, limit: PAGE_SIZE, search: q || undefined });
      const data = res?.data || [];
      const pagination = res?.pagination || {};
      setPosts(Array.isArray(data) ? data : []);
      setTotalPages(pagination.totalPages ?? 1);
      setCurrentPage(pagination.page ?? page);
    } catch (err) {
      console.error('Load posts error', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(currentPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    const v = e.target.value;
    setSearch(v);
    setCurrentPage(1);
    load(1, v);
  };

  const handlePage = (page) => {
    setCurrentPage(page);
    load(page, search);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa bài viết này?')) return;
    try {
      await deleteAdminPost(id);
      load(currentPage, search);
    } catch (err) {
      console.error('Delete post error', err);
      alert('Xóa thất bại');
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Bài viết</h1>
          <p className="text-sm text-gray-600">Tìm kiếm, tạo, sửa và xóa bài viết.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Tìm bài viết"
            className="rounded border px-3 py-2"
          />

          <Link to="/admin/posts/new" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">Thêm bài mới</Link>
        </div>
      </div>

      {isLoading ? (
        <div>Đang tải...</div>
      ) : posts.length === 0 ? (
        <div className="rounded border border-dashed p-8 text-center text-gray-600">Chưa có bài viết nào.</div>
      ) : (
        <div>
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((p) => (
              <article key={p.id} className="bg-white rounded shadow p-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{p.created_at}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/admin/posts/${p.id}`} className="text-sm text-blue-600">Sửa</Link>
                  <button onClick={() => handleDelete(p.id)} className="text-sm text-red-600">Xóa</button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePage} />
          </div>
        </div>
      )}
    </section>
  );
}
