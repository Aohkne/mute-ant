import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface RegisterState {
  full_name: string;
  username: string;
  password: string;
  rePassword: string;
  email: string;
  birthdate: string;
  gender: string;
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: RegisterState = {
  full_name: "",
  username: "",
  password: "",
  rePassword: "",
  email: "",
  birthdate: "",
  gender: "",
  loading: false,
  success: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    userData: Omit<RegisterState, "loading" | "success" | "error">,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/members/register/full`,
        { ...userData, role: "user", image: "", is_active: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegisterData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setRegisterData } = registerSlice.actions;
export default registerSlice.reducer;
