import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosRequest } from '../utils/token';

export interface Job {
  id: number | string;
  title: string;
  companyName: string;
  location: string;
  salary?: string;
  experienceLevel?: string;
  educationLevel?: string;
  description: string;
  postedAt: string;
  aiMatchScore?: number;
  skills: string[];
  recruiter?: {
    fullName: string;
    title: string;
    avatarUrl?: string;
  };
  isSaved?: boolean;
}

export const fetchJobs = createAsyncThunk<Job[]>('jobs/fetchJobs', async () => {
  const res = await axiosRequest.get('/api/Job');
  return res.data.data ?? res.data;
});

export const fetchJobById = createAsyncThunk<Job, string | number>('jobs/fetchJobById', async (id) => {
  const res = await axiosRequest.get(`/api/Job/${id}`);
  return res.data.data ?? res.data;
});

export const applyToJob = createAsyncThunk<void, string | number>('jobs/apply', async (id) => {
  await axiosRequest.post(`/api/Job/apply/${id}`);
});

export const toggleSaveJob = createAsyncThunk<string | number, string | number>('jobs/save', async (id) => {
  await axiosRequest.post(`/api/Job/save/${id}`);
  return id;
});
