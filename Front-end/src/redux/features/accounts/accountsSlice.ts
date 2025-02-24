import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  id: number;
  image: string;
  fullName: string;
  birthdate: string;
  gender: string;
  role: string;
}

interface AccountsState {
  users: User[];
  totalPages: number;
  totalElements: number;
  loading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  users: [],
  totalPages: 0,
  totalElements: 0,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "accounts/fetchUsers",
  async (params: {
    page: number;
    size: number;
    sort: string[];
    gender: string;
    searchTerm: string;
  }) => {
    const { page, size, sort, gender, searchTerm } = params;

    const queries = [`role%3Duser`];
    if (gender) queries.push(`gender%3D${gender}`);
    if (searchTerm)
      queries.push(`fullName%3D${encodeURIComponent(searchTerm)}`);

    const query = queries
      .map((item, index) => (index === 0 ? `${item}` : ` &${item}`))
      .join("");

    console.log(query);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/accounts`,
      {
        params: {
          q: query,
          page,
          size,
          sort: sort.join(","),
        },
      }
    );
    return {
      users: response.data.content,
      totalPages: response.data.pagination.totalPages,
      totalElements: response.data.pagination.totalElements,
    };
  }
);

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users.";
      });
  },
});

export default accountsSlice.reducer;
