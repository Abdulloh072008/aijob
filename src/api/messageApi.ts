import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosRequest } from '../utils/token';

export interface User {
  id: number | string;
  fullName: string;
  username: string;
  avatarUrl?: string;
  title?: string;
}

export interface Conversation {
  id: number | string;
  participant1Id: number | string;
  participant2Id: number | string;
  createdAt: string;
  participant1?: User;
  participant2?: User;
  otherUser?: User; 
  lastMessage?: Message;
}

export interface Message {
  id: number | string;
  conversationId: number | string;
  senderId: number | string;
  content: string;
  createdAt: string;
  sender?: User;
}

// ── Conversations ────────────────────────────────────────────────────────────
export const fetchConversations = createAsyncThunk<Conversation[]>(
  'message/fetchConversations',
  async () => {
    const res = await axiosRequest.get('/api/Conversation');
    return res.data.data ?? res.data;
  }
);

export const createConversation = createAsyncThunk<Conversation, { participantId: string | number }>(
  'message/createConversation',
  async (data) => {
    const res = await axiosRequest.post('/api/Conversation', data);
    return res.data.data ?? res.data;
  }
);

// ── Messages ────────────────────────────────────────────────────────────────
export const fetchChatHistory = createAsyncThunk<Message[], string | number>(
  'message/fetchHistory',
  async (conversationId) => {
    const res = await axiosRequest.get(`/api/Message/by-conversation/${conversationId}`);
    return res.data.data ?? res.data;
  }
);

export const sendMessage = createAsyncThunk<Message, { conversationId: string | number; content: string }>(
  'message/send',
  async (data) => {
    const res = await axiosRequest.post('/api/Message', data);
    return res.data.data ?? res.data;
  }
);

// ── Users for New Chat ──────────────────────────────────────────────────────
export const searchUsers = createAsyncThunk<User[], string>(
  'message/searchUsers',
  async (query) => {
    const res = await axiosRequest.get(`/api/User/directory`);
    const users = res.data.data ?? res.data;

    if (!Array.isArray(users)) return [];

    const q = query.toLowerCase();
    return users.filter((u) => 
      (u.fullName || '').toLowerCase().includes(q) || 
      (u.username || u.userName || '').toLowerCase().includes(q)
    );
  }
);

