import { createSlice } from '@reduxjs/toolkit';
import { fetchJobs, fetchJobById, applyToJob, toggleSaveJob, type Job } from '../../api/jobApi';

interface JobState {
  jobs: Job[];
  selectedJob: Job | null;
  loading: boolean;
  detailsLoading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  selectedJob: null,
  loading: false,
  detailsLoading: false,
  error: null,
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true; })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
        if (!state.selectedJob && action.payload.length > 0) {
          state.selectedJob = action.payload[0];
        }
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      })
      .addCase(fetchJobById.pending, (state) => { state.detailsLoading = true; })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedJob = action.payload;
      })
      .addCase(toggleSaveJob.fulfilled, (state, action) => {
        const job = state.jobs.find(j => j.id === action.payload);
        if (job) job.isSaved = !job.isSaved;
        if (state.selectedJob?.id === action.payload) {
          state.selectedJob.isSaved = !state.selectedJob.isSaved;
        }
      });
  },
});

export const { setSelectedJob } = jobSlice.actions;
export default jobSlice.reducer;
