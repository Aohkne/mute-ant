import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthorIdFromSession = () => {
  const sessionData = sessionStorage.getItem("user");
  if (sessionData) {
    const parsedSession = JSON.parse(sessionData);
    return parsedSession?.value?.userId || null;
  }
  return null;
};

// Fetch danh sách hội thoại
export const fetchConversations = createAsyncThunk(
  "conversations/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const authorId = getAuthorIdFromSession();
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations/author/${authorId}`
      );
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch tin nhắn theo conversationId
export const fetchMessages = createAsyncThunk(
  "conversations/fetchMessages",
  async (conversationId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/conversation/${conversationId}`
      );

      // Lọc tin nhắn hợp lệ (không phải bot, không rỗng)
      const filteredMessages = response.data.content.filter(
        (msg: any) => msg.sender !== "model" && msg.messageText !== ""
      );
      return { conversationId, messages: filteredMessages };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Gửi tin nhắn mới
export const sendMessage = createAsyncThunk(
  "conversations/sendMessage",
  async (
    {
      conversationId,
      messageText,
    }: { conversationId: number; messageText: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/messages`,
        {
          conversationId,
          messageText,
        }
      );
      return { conversationId, message: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const conversationSlice = createSlice({
  name: "conversations",
  initialState: {
    conversations: [],
    messages: {} as Record<number, { messageText: string }[]>,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.payload.conversationId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as any;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(message);
      });
  },
});

export default conversationSlice.reducer;
