import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Blog {
  id: number;
  author: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  images: string[];
  status: string;
  created_date: string;
  updated_date: string;
}

interface BlogState {
  blog: Blog | null;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blog: null,
  loading: false,
  error: null,
};

// Async action để fetch blog theo ID
export const fetchBlogById = createAsyncThunk(
  "blogDetail/fetchById",
  async (id: number) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`
    );
    return res.data.content;
  }
);

const blogDetailSlice = createSlice({
  name: "blogDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch blog";
      });
  },
});

export default blogDetailSlice.reducer;
