import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface MessagesState {
  request: number;
  response: number;
  loading: boolean;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: MessagesState = {
  request: 0,
  response: 0,
  loading: false,
  error: null,
};

// Thunk để fetch dữ liệu từ API
export const fetchTotalMessages = createAsyncThunk(
  "messages/fetchTotalMessages",
  async (sender: "user" | "model", { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/count/sender/${sender}`
      );
      return { sender, totalMessages: response.data.content.totalMessages };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch data"
      );
    }
  }
);

const messagesSlice = createSlice({
  name: "dtoMessage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalMessages.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.sender === "user") {
          state.request = action.payload.totalMessages;
        } else {
          state.response = action.payload.totalMessages;
        }
      })
      .addCase(fetchTotalMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default messagesSlice.reducer;
