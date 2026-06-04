import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosRequest } from '../utils/token';

export interface Notification {
  id: number;
  type: 'connection_request' | 'connection_accepted' | 'post_like' | 'post_comment' | 'job_alert' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  senderId?: number;
  sender?: {
    id: number;
    fullName: string;
    username: string;
    profilePicture?: string;
    role?: string;
  };
  relatedId?: number; // Post ID, Connection ID, etc.
}

export const fetchNotifications = createAsyncThunk<Notification[]>(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.get('/api/Notification');
      return res.data.data ?? res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAsRead = createAsyncThunk<number, number>(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      await axiosRequest.put(`/api/Notification/${id}/read`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await axiosRequest.put('/api/Notification/read-all');
      return true;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
