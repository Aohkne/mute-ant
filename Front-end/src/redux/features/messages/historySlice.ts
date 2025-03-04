import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatHistory = createAsyncThunk(
  "chatHistory/fetchChatHistory",
  async (conversationId: number) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/conversation/${conversationId}`
    );
    return response.data.content;
  }
);

interface Message {
  id: number;
  conversationId: number;
  sender: string;
  messageText: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

interface ChatHistoryState {
  messages: Message[];
  conversationId: number | null;
  loading: boolean;
}

const initialState: ChatHistoryState = {
  messages: [],
  conversationId: null,
  loading: false,
};

const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState,
  reducers: {
    setConversationId: (state, action) => {
      state.conversationId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatHistory.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setConversationId } = chatHistorySlice.actions;
export default chatHistorySlice.reducer;
