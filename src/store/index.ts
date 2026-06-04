import { configureStore } from '@reduxjs/toolkit';
import postReducer from './slices/postSlice';
import profileReducer from './slices/profileSlice';
import messageReducer from './slices/messageSlice';
import userReducer from './slices/userSlice';
import jobReducer from './slices/jobSlice';
import globalSearchReducer from './slices/globalSearchSlice';
import connectionsReducer from '../store/slices/connectionSlice'
import notificationReducer from './slices/notificationSlice';
import aiReducer from './slices/aiSlice';
import organizationReducer from "./slices/organizationSlice";
export const store = configureStore({
  reducer: {
    posts: postReducer,
    profile: profileReducer,
    messages: messageReducer,
    users: userReducer,
    jobs: jobReducer,
    globalSearch: globalSearchReducer,
    connections: connectionsReducer,
    notifications: notificationReducer,
    ai: aiReducer,
    organization: organizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
