import { createSlice } from '@reduxjs/toolkit';
import {
  addLanguage,
  addSkill,
  createEducation,
  createExperience,
  deleteEducation,
  deleteExperience,
  deleteLanguage,
  deleteSkill,
  fetchEducations,
  fetchExperiences,
  fetchLanguages,
  fetchMe,
  fetchProfile,
  fetchSkills,
  updateEducation,
  updateExperience,
  updateLanguage,
  type Analytics,
  type Education,
  type Experience,
  type Language,
  type Me,
  type Profile,
  type Skill
} from '../../api/profileApi';

interface ProfileState {
  me: Me | null;
  profile: Profile | null;
  analytics: Analytics | null;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  me: null,
  profile: null,
  analytics: null,
  experiences: [],
  educations: [],
  skills: [],
  languages: [],
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ── ME ──
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.me = action.payload;
      })

      // ── PROFILE ──
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      })

      // ── EXPERIENCE ──
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.experiences = action.payload;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.experiences.unshift(action.payload);
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        const i = state.experiences.findIndex(e => e.id === action.payload.id);
        if (i !== -1) state.experiences[i] = action.payload;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.experiences = state.experiences.filter(e => e.id !== action.payload);
      })

      // ── EDUCATION ──
      .addCase(fetchEducations.fulfilled, (state, action) => {
        state.educations = action.payload;
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        state.educations.unshift(action.payload);
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        const i = state.educations.findIndex(e => e.id === action.payload.id);
        if (i !== -1) state.educations[i] = action.payload;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.educations = state.educations.filter(e => e.id !== action.payload);
      })

      // ── SKILLS ──
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills = action.payload;
      })

      .addCase(addSkill.fulfilled, (state, action) => {
        state.skills.push(action.payload);  
      })

      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.skills = state.skills.filter(
          (sk) => sk.id !== action.payload
        );
      })
      // ── LANGUAGES ──
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.languages = action.payload;
      })
      .addCase(addLanguage.fulfilled, (state, action) => {
        state.languages.push(action.payload);
      })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        const i = state.languages.findIndex(l => l.id === action.payload.id);
        if (i !== -1) state.languages[i] = action.payload;
      })
      .addCase(deleteLanguage.fulfilled, (state, action) => {
        state.languages = state.languages.filter(l => l.id !== action.payload);
      });
  },
});

export default profileSlice.reducer;