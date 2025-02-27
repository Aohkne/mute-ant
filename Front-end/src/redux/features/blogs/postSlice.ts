import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Định nghĩa kiểu dữ liệu cho blog
export interface Blog {
  author: string;
  title: string;
  content: string;
  description: string;
  status: string;
  thumbnail: string;
  images: string[];
  created_date: string;
}

// State cho post new blog
interface PostState {
  loading: boolean;
  error: string | null;
  success: boolean;
  blogs: Blog[];
}

// Khởi tạo state
const initialState: PostState = {
  loading: false,
  error: null,
  success: false,
  blogs: [],
};

// Cấu hình Axios với baseURL
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tạo async thunk để post new blog
export const postNewBlog = createAsyncThunk(
  "post/postNewBlog",
  async (newBlog: Blog, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/blogs", newBlog);
      console.log(response);

      return response.data;
    } catch (error: any) {
      console.log("lỗi");
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra!");
    }
  }
);

const postSlice = createSlice({
  name: "postBlogs",
  initialState,
  reducers: {
    resetPostState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postNewBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postNewBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.loading = false;
        state.success = true;
        state.blogs.unshift(action.payload);
      })
      .addCase(postNewBlog.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPostState } = postSlice.actions;
export default postSlice.reducer;
