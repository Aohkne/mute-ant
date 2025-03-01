import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`
      );

      console.log(response.data + " 12321");

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

interface DeleteState {
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: DeleteState = {
  success: false,
  loading: false,
  error: null,
};

const deleteSlice = createSlice({
  name: "deleteBlog",
  initialState,
  reducers: {
    resetDeleteState: (state) => {
      state.success = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetDeleteState } = deleteSlice.actions;
export default deleteSlice.reducer;
