import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../components/axiosInstance';





export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (projectNumber) => {
    const response = await axiosInstance.get(`/data${projectNumber}`); 
    return response.data;
  }
);

const initialState = {
  data: [],

};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});


export default dataSlice.reducer;
