import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./loginslice";

const store = configureStore({
  reducer: {
    login: loginReducer, 
  },
});

export default store;
