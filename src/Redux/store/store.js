import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../fetures/authentication";
import postSlice from "../fetures/postslice";
import teamSlice from "../fetures/Teamslice";
import matchOfficialSlice from "../fetures/Matchofficial";
import AdminSlice from "../fetures/AdminSlice";

const store = configureStore({
  reducer: {
    AdminSlice: AdminSlice,
    authSlice: authSlice,
    postSlice: postSlice,
    teamSlice: teamSlice,
    matchOfficialSlice: matchOfficialSlice,
  },
});

export default store;
