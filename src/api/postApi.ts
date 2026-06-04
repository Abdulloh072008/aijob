import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosRequest } from '../utils/token';

const mapPost = (p) => ({
  ...p,
  authorId: p.userId,
  likesCount: p.likeCount ?? p.likesCount ?? 0,
  commentsCount: p.commentCount ?? p.commentsCount ?? 0,
  repostsCount: p.repostCount ?? p.repostsCount ?? 0,
  isLiked: p.likedByMe ?? p.isLiked ?? false,
  authorAvatar: p.authorImageUrl ?? p.authorAvatar,
});

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    { method: 'POST', body: formData }
  );
  const data = await response.json();
  return data.data.url;
};

export const fetchFeed = createAsyncThunk('posts/fetchFeed', async () => {
  const response = await axiosRequest.get('/api/Post');
  const posts = response.data.data ?? response.data;
  return Array.isArray(posts) ? posts.map(mapPost) : [];
});

export const createPost = createAsyncThunk('posts/createPost', async (postData: { content: string; imageUrl?: string | null }) => {
  const response = await axiosRequest.post('/api/Post', {
    content: postData.content,
    imageUrl: postData.imageUrl ?? null,
  });
  return mapPost(response.data.data ?? response.data);
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, content }: { id: number; content: string }) => {
  const response = await axiosRequest.put(`/api/Post/${id}`, { content });
  return mapPost(response.data.data ?? response.data);
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id: number) => {
  await axiosRequest.delete(`/api/Post/${id}`);
  return id;
});

export const toggleLike = createAsyncThunk('posts/toggleLike', async (postId: number) => {
  await axiosRequest.post(`/api/Post/${postId}/like`);
  return postId;
});

export const repost = createAsyncThunk('posts/repost', async (postId: number) => {
  const response = await axiosRequest.post(`/api/Post/${postId}/repost`);
  return { originalPostId: postId, newPost: mapPost(response.data.data ?? response.data) };
});

export const addComment = createAsyncThunk('posts/addComment', async ({ postId, content }: { postId: number; content: string }) => {
  const response = await axiosRequest.post(`/api/Post/${postId}/comments`, { content });
  return { postId, comment: response.data.data ?? response.data };
});

export const fetchComments = createAsyncThunk('posts/fetchComments', async (postId: number) => {
  const response = await axiosRequest.get(`/api/Post/${postId}/comments`);
  return { postId, comments: response.data.data ?? response.data };
});

export const deleteComment = createAsyncThunk('posts/deleteComment', async ({ postId, commentId }: { postId: number; commentId: number }) => {
  await axiosRequest.delete(`/api/Post/${postId}/comments/${commentId}`);
  return { postId, commentId };
});