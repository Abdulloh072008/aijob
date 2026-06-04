import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "../utils/token";

// =======================
// ORGANIZATION PROFILE
// =======================

export const fetchOrgProfile = createAsyncThunk(
  "organization/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.get("/api/Organization/mine");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Profile fetch failed"
      );
    }
  }
);

export const fetchOrgProfileById = createAsyncThunk(
  "organization/fetchProfileById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.get(`/api/Organization/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Profile ID fetch failed"
      );
    }
  }
);


// =======================
// JOBS (IMPORTANT FIX HERE)
// =======================

// GET JOBS (correct endpoint - NOT JobApplication)
export const fetchOrgJobs = createAsyncThunk(
  "organization/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.get(
        "/api/Job/by-organization/mine"
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Job list sync failed"
      );
    }
  }
);


// CREATE JOB POST (FIXED)
// ❌ DO NOT use /JobApplication
// ✅ Use /Job or /JobPost (depending on backend)

export const createJobPost = createAsyncThunk(
  "organization/createJob",
  async (
    job: {
      title: string;
      description: string;
      location: string;
      employmentType: string;
      experienceLevel: string;
      salary: string;
      organizationId: number;
      skills: string[];
      status: "active";
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosRequest.post(
        "/api/Job", // ✅ FIXED ENDPOINT (IMPORTANT)
        job
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Vacancy posting failed"
      );
    }
  }
);

// UPDATE JOB POST
export const updateJobPost = createAsyncThunk(
  "organization/updateJob",
  async (
    { id, data }: { id: string; data },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosRequest.put(`/api/Job/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Job update failed"
      );
    }
  }
);


// =======================
// APPLICANTS
// =======================

export const fetchOrgApplicants = createAsyncThunk(
  "organization/fetchApplicants",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.get(
        "/api/JobApplication/by-organization/mine"
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Applicants sync failed"
      );
    }
  }
);


// =======================
// UPDATE PROFILE
// =======================

export const updateOrgProfile = createAsyncThunk(
  "organization/updateProfile",
  async (
    { id, data }: { id: string; data },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosRequest.put(
        `/api/Organization/${id}`,
        data
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Profile update failed"
      );
    }
  }
);


// =======================
// DELETE JOB
// =======================

export const deleteJobPost = createAsyncThunk(
  "organization/deleteJob",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.delete(
        `/api/Job/${id}` // ✅ FIXED (not JobApplication)
      );
      return res.data || id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Job delete failed"
      );
    }
  }
);


// =======================
// UPDATE APPLICATION STATUS
// =======================

export const updateApplicantStatus = createAsyncThunk(
  "organization/updateApplicantStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosRequest.patch(
        `/api/JobApplication/${id}/status`,
        { status }
      );

      return {
        applicantId: id,
        status: res.data?.status || status,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Status change failed"
      );
    }
  }
);