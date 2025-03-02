import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "lodash";

const getAuthorIdFromSession = () => {
  const sessionData = sessionStorage.getItem("user");
  if (sessionData) {
    const parsedSession = JSON.parse(sessionData);
    return parsedSession?.value?.userId || null;
  }

  return null;
};

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

export const fetchMessages = createAsyncThunk(
  "conversations/fetchMessages",
  async (conversationId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/conversation/${conversationId}`
      );
      // Lọc tin nhắn có sender khác "model"
      const filteredMessages = response.data.content.filter(
        (msg: any) => msg.sender !== "model" && msg.messageText !== ""
      );
      return { conversationId, messages: filteredMessages };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const conversationSlice = createSlice({
  name: "conversations",
  initialState: {
    conversations: [],
    messages: {},
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

        // Sắp xếp lại dữ liệu
        const newConversations = action.payload.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Nếu dữ liệu KHÁC thì mới cập nhật (tránh bị Redux bỏ qua do reference cũ)
        if (!_.isEqual(state.conversations, newConversations)) {
          state.conversations = newConversations;
        }
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
      });
  },
});

export default conversationSlice.reducer;
