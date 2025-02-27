import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Blog {
  id: number;
  author: string;
  title: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  images?: string[];
  status?: string;
  created_date?: string;
  updated_date?: string;
}

interface Pagination {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  },
};

export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (page: number = 0, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs?page=${page}&size=10&sort=id,asc`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.blogs = action.payload.content;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default blogSlice.reducer;
