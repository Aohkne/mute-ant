// src/redux/features/blogs/editSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Blog {
  id?: number;
  author: string;
  title: string;
  content?: string;
  description: string;
  status: string;
  thumbnail: string;
  images: string[];
  created_date: string;
}

interface EditState {
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: EditState = {
  success: false,
  loading: false,
  error: null,
};

// Cấu hình Axios với baseURL
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thunk chỉnh sửa blog
export const editBlog = createAsyncThunk(
  "editBlog/editBlog",
  async (updatedBlog: Blog, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/blogs/${updatedBlog.id}`,
        updatedBlog
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  }
);

const editSlice = createSlice({
  name: "editBlog",
  initialState,
  reducers: {
    resetEditState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editBlog.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(editBlog.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(editBlog.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetEditState } = editSlice.actions;
export default editSlice.reducer;
