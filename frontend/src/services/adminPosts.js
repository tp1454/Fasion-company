import instance from './api';

// Admin Posts service helpers

export const fetchAdminPosts = async (params = {}) => {
  try {
    // params: page, limit, search
    const res = await instance.get('/admin/posts.php', { params });
    return res.data;
  } catch (err) {
    console.error('fetchAdminPosts error', err);
    throw err;
  }
};

export const fetchAdminPost = async (id) => {
  try {
    const res = await instance.get('/posts.php', { params: { id } });
    return res.data;
  } catch (err) {
    console.error('fetchAdminPost error', err);
    throw err;
  }
};

export const createAdminPost = async (payload) => {
  try {
    // payload: { title, content, thumbnail }
    const res = await instance.post('/admin/posts.php', payload);
    return res.data;
  } catch (err) {
    console.error('createAdminPost error', err);
    throw err;
  }
};

export const updateAdminPost = async (id, payload) => {
  try {
    const res = await instance.put(`/admin/posts.php?id=${id}`, payload);
    return res.data;
  } catch (err) {
    console.error('updateAdminPost error', err);
    throw err;
  }
};

export const deleteAdminPost = async (id) => {
  try {
    const res = await instance.delete(`/admin/posts.php?id=${id}`);
    return res.data;
  } catch (err) {
    console.error('deleteAdminPost error', err);
    throw err;
  }
};

// Image upload helper - reuses existing upload-about-image endpoint
export const uploadPostImage = async (file) => {
  try {
    const form = new FormData();
    form.append('image', file);
    const res = await instance.post('/admin/upload-about-image.php', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data; // { success, url }
  } catch (err) {
    console.error('uploadPostImage error', err);
    throw err;
  }
};

export default {
  fetchAdminPosts,
  fetchAdminPost,
  createAdminPost,
  updateAdminPost,
  deleteAdminPost,
  uploadPostImage,
};
