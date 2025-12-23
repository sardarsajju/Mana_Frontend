import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../Custom/Api_url";

export const loginuser = createAsyncThunk(
  "auth/loginuser",
  async ({ Email, Password }, thunkApi) => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        Email,
        Password,
      });

      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);


const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginuser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginuser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("user_id", action.payload.user_id);
      })
      .addCase(loginuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;
