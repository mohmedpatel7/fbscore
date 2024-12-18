import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../fetures/authentication";
import postSlice from "../fetures/postslice";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
    postSlice: postSlice,
  },
});

export default store;
