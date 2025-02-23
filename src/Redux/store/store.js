import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../fetures/authentication";
import postSlice from "../fetures/postslice";
import teamSlice from "../fetures/Teamslice";
import matchOfficialSlice from "../fetures/Matchofficial";

const store = configureStore({
  reducer: {
    authSlice: authSlice,
    postSlice: postSlice,
    teamSlice: teamSlice,
    matchOfficialSlice: matchOfficialSlice,
  },
});

export default store;
