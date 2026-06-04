import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosRequest } from '../../utils/token';
import { type Job } from '../../api/jobApi';
import { type User } from '../../api/connectionApi';

export interface GlobalSearchResult {
  jobs: Job[];
  users: User[];
  posts: any[];
}

interface GlobalSearchState {
  results: GlobalSearchResult;
  query: string;
  loading: boolean;
}

const initialState: GlobalSearchState = {
  results: { jobs: [], users: [], posts: [] },
  query: '',
  loading: false,
};

export const performGlobalSearch = createAsyncThunk(
  'search/performGlobal',
  async (query: string) => {
    if (!query || query.length < 2) return { jobs: [], users: [], posts: [] };

    // In a real production app, you might have a single /api/Search endpoint.
    // Here we'll parallel fetch and filter for a rich demo experience.
    const [jobsRes, usersRes, postsRes] = await Promise.all([
      axiosRequest.get('/api/Job'),
      axiosRequest.get('/api/User/directory'),
      axiosRequest.get('/api/Post')
    ]);

    const jobs = (jobsRes.data.data ?? jobsRes.data).filter((j: Job) => 
      j.title.toLowerCase().includes(query.toLowerCase()) || 
      j.companyName.toLowerCase().includes(query.toLowerCase())
    );

    const users = (usersRes.data.data ?? usersRes.data).filter((u: User) => 
      u.fullName.toLowerCase().includes(query.toLowerCase()) || 
      u.username.toLowerCase().includes(query.toLowerCase())
    );

    const posts = (postsRes.data.data ?? postsRes.data).filter((p: any) => 
      p.content.toLowerCase().includes(query.toLowerCase())
    );

    return { jobs, users, posts };
  }
);

const globalSearchSlice = createSlice({
  name: 'globalSearch',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = { jobs: [], users: [], posts: [] };
      state.query = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(performGlobalSearch.pending, (state) => {
        state.loading = true;
      })
      .addCase(performGlobalSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      });
  },
});

export const { setQuery, clearResults } = globalSearchSlice.actions;
export default globalSearchSlice.reducer;
