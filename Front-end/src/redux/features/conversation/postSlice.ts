import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Conversation {
  userId: number;
  isActive: boolean;
}

interface ConversationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  conversations: Conversation[];
}

const initialState: ConversationState = {
  loading: false,
  error: null,
  success: false,
  conversations: [],
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getUserIdFromSession = () => {
  const sessionData = sessionStorage.getItem("user");
  if (sessionData) {
    const parsedSession = JSON.parse(sessionData);
    return parsedSession?.value?.userId || null;
  }

  return null;
};

export const createConversation = createAsyncThunk(
  "conversation/createConversation",

  async (_, { rejectWithValue }) => {
    const userId = getUserIdFromSession();
    if (!userId) return rejectWithValue("User ID không hợp lệ!");

    try {
      const response = await axiosInstance.post("/conversations", {
        userId,
        isActive: true,
      });
      return response.data;
    } catch (error: any) {
      console.log(error);

      return rejectWithValue(error.response?.data || "Có lỗi xảy ra!");
    }
  }
);

const conversationSlice = createSlice({
  name: "postConversation",
  initialState,
  reducers: {
    resetConversationState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createConversation.fulfilled,
        (state, action: PayloadAction<Conversation>) => {
          state.loading = false;
          state.success = true;
          state.conversations.unshift(action.payload);
        }
      )
      .addCase(
        createConversation.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetConversationState } = conversationSlice.actions;
export default conversationSlice.reducer;
