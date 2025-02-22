import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../fetures/authentication";
import postSlice from "../fetures/postslice";
import teamSlice from "../fetures/Teamslice";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
    postSlice: postSlice,
    teamSlice: teamSlice,
  },
});

export default store;
