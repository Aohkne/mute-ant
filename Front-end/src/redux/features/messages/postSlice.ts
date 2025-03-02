import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Message {
  conversationId: number;
  sender: string;
  messageText: string;
  isActive: boolean;
}

interface PostState {
  loading: boolean;
  error: string | null;
  success: boolean;
  messages: Message[];
}

const initialState: PostState = {
  loading: false,
  error: null,
  success: false,
  messages: [],
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const postMessage = createAsyncThunk(
  "post/postMessage",
  async (
    messageData: {
      conversationId: number;
      sender: string;
      messageText: string;
      isActive: true;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/messages", messageData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra!");
    }
  }
);

const postSlice = createSlice({
  name: "postMessage",
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
      .addCase(postMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        postMessage.fulfilled,
        (state, action: PayloadAction<Message>) => {
          state.loading = false;
          state.success = true;
          state.messages.push(action.payload);
        }
      )
      .addCase(postMessage.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPostState } = postSlice.actions;
export default postSlice.reducer;
