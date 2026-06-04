  import { createAsyncThunk } from '@reduxjs/toolkit';
  import { axiosRequest } from '../utils/token';

  export interface Me {
    id: number;
    fullName: string;
    email: string;
    role?: string;
  }

  export interface Profile {
    id: number;
    userId: number;
    bio: string;
    title: string;
    location: string;
    avatarUrl: string;
    bannerUrl: string;
    connectionsCount: number;
  }

  export interface Analytics {
    profileViews: number;
    searchAppearances: number;
  }

  export interface Experience {
    id: number;
    userId: number;
    title: string;
    location: string;
    company: string;
    employmentType?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    isCurrent?: boolean;
  }

  export type ExperienceInput = Omit<Experience, 'id'>;

  export interface Education {
    id: number;
    userId: number;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    school?: string;
    description?: string;
  }

  export type EducationInput = Omit<Education, 'id'>;

  export interface Skill {
    id: number;
    userId: number;
    skillName: string;
  }

  export interface Language {
    id: number;
    profileId: number;
    language: string;
    proficiency: string;
  }
  export const fetchMe = createAsyncThunk<Me>(
    'profile/fetchMe',
    async () => {
      const res = await axiosRequest.get('/api/User/me');
      return res.data.data ?? res.data;
    }
  );

  export const fetchProfile = createAsyncThunk<Profile, string>(
    'profile/fetchProfile',
    async (userId) => {
      const res = await axiosRequest.get(`/api/Profile/by-user/${userId}`);
      return res.data.data ?? res.data;
    }
  );

  export const fetchAnalytics = createAsyncThunk<Analytics, string>(
    'profile/fetchAnalytics',
    async (userId) => {
      const res = await axiosRequest.get(`/api/Profile/${userId}/analytics`);
      return res.data.data ?? res.data;
    }
  );

  export const upsertProfile = createAsyncThunk<Profile, Partial<Profile>>(
    'profile/upsertProfile',
    async (data) => {
      const res = await axiosRequest.post('/api/Profile', data);
      return res.data.data ?? res.data;
    }
  );

  export const fetchExperiences = createAsyncThunk<Experience[], string>(
    'profile/fetchExperiences',
    async (userId) => {
      const res = await axiosRequest.get(`/api/UserExperience/by-user/${userId}`);
      return res.data.data ?? res.data;
    }
  );

  export const createExperience = createAsyncThunk<
    Experience,
    ExperienceInput
  >('profile/createExperience', async (data) => {
    const res = await axiosRequest.post('/api/UserExperience', data);
    return res.data.data ?? res.data;
  });

  export const updateExperience = createAsyncThunk<
    Experience,
    { id: number; data: ExperienceInput }
  >('profile/updateExperience', async ({ id, data }) => {
    const res = await axiosRequest.put(`/api/UserExperience/${id}`, data);
    return res.data.data ?? res.data;
  });

  export const deleteExperience = createAsyncThunk<number, number>(
    'profile/deleteExperience',
    async (id) => {
      await axiosRequest.delete(`/api/UserExperience/${id}`);
      return id;
    }
  );


  export const fetchEducations = createAsyncThunk<Education[], string>(
    'profile/fetchEducations',
    async (userId) => {
      const res = await axiosRequest.get(`/api/UserEducation/by-user/${userId}`);
      return res.data.data ?? res.data;
    }
  );

  export const createEducation = createAsyncThunk<
    Education,
    EducationInput
  >('profile/createEducation', async (data) => {
    const res = await axiosRequest.post('/api/UserEducation', data);
    return res.data.data ?? res.data;
  });

  export const updateEducation = createAsyncThunk<
    Education,
    { id: number; data: EducationInput }
  >('profile/updateEducation', async ({ id, data }) => {
    const res = await axiosRequest.put(`/api/UserEducation/${id}`, data);
    return res.data.data ?? res.data;
  });

  export const deleteEducation = createAsyncThunk<number, number>(
    'profile/deleteEducation',
    async (id) => {
      await axiosRequest.delete(`/api/UserEducation/${id}`);
      return id;
    }
  );


  export const fetchSkills = createAsyncThunk<Skill[], string>(
    'profile/fetchSkills',
    async (userId) => {
      const res = await axiosRequest.get(`/api/UserSkill/by-user/${userId}`);
      return res.data.data ?? res.data;
    }
  );

  export const addSkill = createAsyncThunk<
    Skill,
    { userId: number; skillName: string }
  >('profile/addSkill', async (data) => {
    const res = await axiosRequest.post('/api/UserSkill', data);
    return res.data.data ?? res.data;
  });

  export const deleteSkill = createAsyncThunk<number, number>(
    'profile/deleteSkill',
    async (skillId) => {
      await axiosRequest.delete(`/api/UserSkill/${skillId}`);
      return skillId;
    }
  );


  export const fetchLanguages = createAsyncThunk<Language[], string>(
    'profile/fetchLanguages',
    async (profileId) => {
      const res = await axiosRequest.get(`/api/ProfileLanguage/by-profile/${profileId}`);
      return res.data.data ?? res.data;
    }
  );

  export const addLanguage = createAsyncThunk<
    Language,
    { profileId: number; language: string; proficiency: string }
  >('profile/addLanguage', async (data) => {
    const res = await axiosRequest.post('/api/ProfileLanguage', data);
    return res.data.data ?? res.data;
  });

  export const updateLanguage = createAsyncThunk<
    Language,
    { id: number; data: { language: string; proficiency: string } }
  >('profile/updateLanguage', async ({ id, data }) => {
    const res = await axiosRequest.put(`/api/ProfileLanguage/${id}`, data);
    return res.data.data ?? res.data;
  });

  export const deleteLanguage = createAsyncThunk<number, number>(
    'profile/deleteLanguage',
    async (id) => {
      await axiosRequest.delete(`/api/ProfileLanguage/${id}`);
      return id;
    }
  );