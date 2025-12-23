import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    login_id: null,
    name: "",
    role: "",
  },
  reducers: {
    setUser: (state, action) => {
      state.login_id = action.payload.login_id;
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
    logoutUser: (state) => {
      state.login_id = null;
      state.name = "";
      state.role = "";
    }
  }
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
