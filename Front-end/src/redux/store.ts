"user client";

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";

import authReducer from "./features/auth/authSlice";
import registerReducer from "./features/auth/registerSlice";

import accountsReducer from "./features/accounts/accountsSlice";

import blogsReducer from "./features/blogs/blogSlice";
import postBlogsReducer from "./features/blogs/postSlice";
import editBlogReducer from "./features/blogs/editSlice";
import blogDetailReducer from "./features/blogs/blogDetailSlice";
import deleteBlogReducer from "./features/blogs/deleteSlice";

import conversationReducer from "./features/conversation/conversationSlice";
import postConversationReducer from "./features/conversation/postSlice";
import conversationStatsReducer from "./features/conversation/conversationSlice";

import postMessageReducer from "./features/messages/postSlice";
import chatHistoryReducer from "./features/messages/historySlice";
import dtoReducer from "./features/messages/dtoSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,

    auth: authReducer,
    register: registerReducer,

    accounts: accountsReducer,

    blogs: blogsReducer,
    postBlogs: postBlogsReducer,
    editBlog: editBlogReducer,
    blogDetail: blogDetailReducer,
    deleteBlog: deleteBlogReducer,

    conversations: conversationReducer,
    postConversation: postConversationReducer,
    conversationStats: conversationStatsReducer,

    postMessage: postMessageReducer,
    chatHistory: chatHistoryReducer,
    dtoMessage: dtoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
