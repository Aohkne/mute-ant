"user client";

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";

import authReducer from "./features/auth/authSlice";
import accountsReducer from "./features/accounts/accountsSlice";

import blogsReducer from "./features/blogs/blogSlice";
import postBlogsReducer from "./features/blogs/postSlice";
import editBlogReducer from "./features/blogs/editSlice";
import blogDetailReducer from "./features/blogs/blogDetailSlice";
import deleteBlogReducer from "./features/blogs/deleteSlice";

import postConversationReducer from "./features/conversation/postSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    accounts: accountsReducer,

    blogs: blogsReducer,
    postBlogs: postBlogsReducer,
    editBlog: editBlogReducer,
    blogDetail: blogDetailReducer,
    deleteBlog: deleteBlogReducer,

    postConversation: postConversationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
