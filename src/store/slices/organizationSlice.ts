import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchOrgProfile,
  fetchOrgProfileById,
  fetchOrgJobs,
  createJobPost,
  updateJobPost,
  deleteJobPost,
  fetchOrgApplicants,
  updateApplicantStatus,
  updateOrgProfile,
} from "../../api/organizationapi";

export interface JobPost {
  id: string;
  title: string;
  description: string;
  location: string;
  salary?: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote";
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead/Manager" | "Executive";
  skills: string[];
  status: "active" | "closed" | "draft";
  applicantsCount: number;
  createdAt: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  jobId: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: string;
  resumeUrl?: string;
}

export interface OrgProfile {
  id: string;
  name: string;
  industry: string;
  website: string;
  description: string;
  location: string;
  size: string;
  logoUrl?: string;
   fullName?: string;
  organizationName?: string;
}

interface OrganizationState {
  profile: OrgProfile | null;
  jobs: JobPost[];
  applicants: Applicant[];
  stats: { totalJobs: number; activeJobs: number; totalApplicants: number; pendingReviews: number };
  loading: { profile: boolean; jobs: boolean; applicants: boolean; postingJob: boolean; updatingApplicant: boolean };
  error: string | null;
}

const initialState: OrganizationState = {
  profile: null,
  jobs: [],
  applicants: [],
  stats: { totalJobs: 0, activeJobs: 0, totalApplicants: 0, pendingReviews: 0 },
  loading: { profile: false, jobs: false, applicants: false, postingJob: false, updatingApplicant: false },
  error: null,
};

const calculateStats = (jobs: JobPost[], applicants: Applicant[]) => ({
  totalJobs: jobs.length,
  activeJobs: jobs.filter((j) => j.status === "active").length,
  totalApplicants: applicants.length,
  pendingReviews: applicants.filter((a) => a.status === "pending").length,
});

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    clearOrgError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgProfile.pending, (state) => { state.loading.profile = true; })
      .addCase(fetchOrgProfile.fulfilled, (state, action: PayloadAction<OrgProfile>) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchOrgProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrgProfileById.pending, (state) => {
        state.loading.profile = true; 
      })

      .addCase(fetchOrgProfileById.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload; 
      })

      .addCase(fetchOrgProfileById.rejected, (state, action) => {
        state.loading.profile = false; 
        state.error = action.payload as string;
      })
      .addCase(fetchOrgJobs.pending, (state) => { state.loading.jobs = true; })
      .addCase(fetchOrgJobs.fulfilled, (state, action: PayloadAction<JobPost[]>) => {
        state.loading.jobs = false;
        state.jobs = action.payload;
        state.stats = calculateStats(state.jobs, state.applicants);
      })
      .addCase(fetchOrgJobs.rejected, (state, action) => {
        state.loading.jobs = false;
        state.error = action.payload as string;
      })
      .addCase(createJobPost.pending, (state) => { state.loading.postingJob = true; })
      .addCase(createJobPost.fulfilled, (state, action: PayloadAction<JobPost>) => {
        state.loading.postingJob = false;
        state.jobs.unshift(action.payload);
        state.stats = calculateStats(state.jobs, state.applicants);
      })
      .addCase(createJobPost.rejected, (state, action) => {
        state.loading.postingJob = false;
        state.error = action.payload as string;
      })
      .addCase(updateJobPost.fulfilled, (state, action: PayloadAction<JobPost>) => {
        const index = state.jobs.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        state.stats = calculateStats(state.jobs, state.applicants);
      })
      .addCase(deleteJobPost.fulfilled, (state, action: PayloadAction<string>) => {
        state.jobs = state.jobs.filter((j) => j.id !== action.payload);
        state.stats = calculateStats(state.jobs, state.applicants);
      })
      .addCase(fetchOrgApplicants.pending, (state) => { state.loading.applicants = true; })
      .addCase(fetchOrgApplicants.fulfilled, (state, action: PayloadAction<Applicant[]>) => {
        state.loading.applicants = false;
        state.applicants = action.payload;
        state.stats = calculateStats(state.jobs, state.applicants);
      })
      .addCase(fetchOrgApplicants.rejected, (state, action) => {
        state.loading.applicants = false;
        state.error = action.payload as string;
      })
      .addCase(updateApplicantStatus.fulfilled, (state, action: PayloadAction<{ applicantId: string; status: Applicant["status"] }>) => {
        const applicant = state.applicants.find((a) => a.id === action.payload.applicantId);
        if (applicant) applicant.status = action.payload.status;
        state.stats = calculateStats(state.jobs, state.applicants);
      })
      .addCase(updateOrgProfile.fulfilled, (state, action: PayloadAction<OrgProfile>) => {
        state.profile = action.payload;
      });

  },
});

export const { clearOrgError } = organizationSlice.actions;
export default organizationSlice.reducer;