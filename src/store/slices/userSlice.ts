import { createSlice } from '@reduxjs/toolkit';
import { fetchDirectory, type User } from '../../api/connectionApi';

interface UserState {
  directory: User[];
  loading: boolean;
}

const initialState: UserState = {
  directory: [],
  loading: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDirectory.pending, (state) => { state.loading = true; })
      .addCase(fetchDirectory.fulfilled, (state, action) => {
        state.loading = false;
        state.directory = action.payload;
      });
  },
});

export default userSlice.reducer;
