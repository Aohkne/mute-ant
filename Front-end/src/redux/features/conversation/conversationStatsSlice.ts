import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface DailyBreakdown {
  [date: string]: number;
}

interface ConversationStats {
  monthlyTotal: number;
  month: number;
  year: number;
  dailyBreakdown: DailyBreakdown;
}

interface ConversationStatsState {
  loading: boolean;
  error: string | null;
  data: ConversationStats | null;
}

const initialState: ConversationStatsState = {
  loading: false,
  error: null,
  data: null,
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Async action để fetch dữ liệu
export const fetchConversationStats = createAsyncThunk(
  "conversationStats/fetch",
  async (
    { year, month }: { year: number; month: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/conversations/stats/monthly-total/${year}/${month}`
      );
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Có lỗi xảy ra!");
    }
  }
);

const conversationStatsSlice = createSlice({
  name: "conversationStats",
  initialState,
  reducers: {
    resetConversationStats: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchConversationStats.fulfilled,
        (state, action: PayloadAction<ConversationStats>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(
        fetchConversationStats.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetConversationStats } = conversationStatsSlice.actions;
export default conversationStatsSlice.reducer;
