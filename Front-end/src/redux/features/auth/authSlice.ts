import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AuthState } from "../../../types/auth/authTypes";

// Define async thunk for login
export const loginUserAsync = createAsyncThunk(
  "auth/loginUser",
  async (username: string, thunkAPI) => {
    try {
      const response = await axios.post("https://api.example.com/login", {
        username,
      });
      return response.data; // Assuming API returns user data
    } catch (error: unknown) {
      // Type error as any or define a specific type
      const typedError = error as { response: { data: any } }; // Adjust this type as per actual structure
      return thunkAPI.rejectWithValue(typedError.response.data);
    }
  }
);

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        // Optionally set loading state here
      })
      .addCase(
        loginUserAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isAuthenticated = true;
          state.user = action.payload; // Assuming payload is user data
        }
      )
      .addCase(loginUserAsync.rejected, (state, action: PayloadAction<any>) => {
        // Optionally handle error state here
      });
  },
});

// Make sure to use default export for authSlice reducer
export default authSlice.reducer;
export const { logout } = authSlice.actions;
