import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../fetures/authentication";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
  },
});

export default store;
