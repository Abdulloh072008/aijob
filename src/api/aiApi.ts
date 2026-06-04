import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosRequest } from '../utils/token';

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AiResponse {
  answer: string;
  usage?: {
    queriesUsed: number;
    queriesLimit: number;
    cvAnalysesUsed: number;
    cvAnalysesLimit: number;
  };
}

// ── Ask AI Assistant ────────────────────────────────────────────────────────
export const askAi = createAsyncThunk<AiResponse, string>(
  'ai/ask',
  async (question, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.post('/api/Ai/ask', { question });
      return res.data.data ?? res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Analyze CV ──────────────────────────────────────────────────────────────
export const analyzeCv = createAsyncThunk<AiResponse, File>(
  'ai/analyzeCv',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosRequest.post('/api/Ai/analyze-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data ?? res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Draft Message ───────────────────────────────────────────────────────────
export const draftAiMessage = createAsyncThunk<AiResponse, { recipientId: string | number; context?: string }>(
  'ai/draftMessage',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.post('/api/Ai/draft-message', data);
      return res.data.data ?? res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Skill Gap Analysis ──────────────────────────────────────────────────────
export const analyzeSkillGap = createAsyncThunk<AiResponse, { jobId: string | number }>(
  'ai/skillGap',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.post('/api/Ai/skill-gap', data);
      return res.data.data ?? res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Draft Cover Letter ──────────────────────────────────────────────────────
export const draftCoverLetter = createAsyncThunk<AiResponse, { jobId: string | number }>(
  'ai/draftCoverLetter',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.post('/api/Ai/draft-cover-letter', data);
      return res.data.data ?? res.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
