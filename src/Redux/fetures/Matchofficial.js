import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = "http://localhost:5000/";

// Send OTP Async Thunk
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/match/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is not OK
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData); // Send backend error to the reducer
      }

      return await response.json(); // Return success data
    } catch (error) {
      return rejectWithValue({
        message: "Failed to send OTP. Please try again.",
      });
    }
  }
);

// Sign Up Async Thunk
export const SignUp = createAsyncThunk(
  "auth/SignUp",
  async (payload, { rejectWithValue }) => {
    try {
      // Make the API call
      const response = await fetch(`${url}api/match/matchOfficialSignup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure JSON format
        },
        body: JSON.stringify(payload), // Send JSON directly
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      // Return the success response
      return await response.json();
    } catch (error) {
      return rejectWithValue({
        message: "Failed to sign up. Please try again.",
      });
    }
  }
);

//Sign In Api call..
export const Signin = createAsyncThunk(
  "Signin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/match/matchOfficialSignin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      localStorage.removeItem("teamtoken");
      localStorage.removeItem("usertoken");
      localStorage.setItem("matchOfficialtoken", data.matchOfficialtoken);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to sign in. Please try again.",
      });
    }
  }
);

// Api call for forgot Password .
export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/match/forgotpassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return response.json();
    } catch (error) {
      return rejectWithValue({ message: "Failed to fethc player details!" });
    }
  }
);

export const fetchedTeamlist = createAsyncThunk(
  "fetchedTeamlist",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("matchOfficialtoken");
      if (!token) return rejectWithValue({ message: "Authorization failed!" });

      const response = await fetch(`${url}api/match/getTeamNames`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "matchofficial-token": token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      return rejectWithValue({ message: "Failed to fethc player details!" });
    }
  }
);

// Api call for creating match.
export const createMatch = createAsyncThunk(
  "createMatch",
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("matchOfficialtoken");
      if (!token) return rejectWithValue({ message: "Authorization failed!" });

      const response = await fetch(`${url}api/match/createMatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "matchofficial-token": token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return response.json();
    } catch (error) {
      return rejectWithValue({ message: "Failed to fethc player details!" });
    }
  }
);

// Fetching sign in official matches list.
export const fetchMatches = createAsyncThunk(
  "fetchMatches",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("matchOfficialtoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/match/signinMatches`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "matchofficial-token": token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return response.json();
    } catch (error) {
      return rejectWithValue({
        message: "Failed to fetches matches list for team!",
      });
    }
  }
);

// Fetching match details.
export const fetchMatchDetails = createAsyncThunk(
  "matchDetails",
  async (matchId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("matchOfficialtoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/match/matchDetails/${matchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "matchofficial-token": token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to fetches matches list for team!",
      });
    }
  }
);

// Matchofficial Slice
const matchofficialSlice = createSlice({
  name: "matchofficial",
  initialState: {
    isLoading: false,
    matchData: null,
    updateUser: null,
    teamList: null,
    matchCreation: null,
    matchesList: null,
    matchDetails: null,
    error: null, // Error string or object from backend
  },

  extraReducers: (builder) => {
    // Handle sendOtp cases
    builder.addCase(sendOtp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sendOtp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.matchData = action.payload;
      state.error = null;
    });
    builder.addCase(sendOtp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred."; // Use backend error or fallback
    });

    // Handle SignUp cases
    builder.addCase(SignUp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(SignUp.fulfilled, (state, action) => {
      state.isLoading = false;
      localStorage.removeItem("usertoken");
      localStorage.removeItem("teamtoken");
      localStorage.removeItem("matchOfficialtoken");
      state.matchData = action.payload;
      state.error = null;
    });
    builder.addCase(SignUp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred."; // Use backend error or fallback
    });

    //Handle Sign in cases.
    builder.addCase(Signin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(Signin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.matchData = action.payload;
      state.error = null;
    });
    builder.addCase(Signin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
    });

    //Handle update user password cases.
    builder.addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.updateUser = action.payload;
      state.error = null;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    //Handle fetching team list cases.
    builder.addCase(fetchedTeamlist.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchedTeamlist.fulfilled, (state, action) => {
      state.isLoading = false;
      state.teamList = action.payload;
      state.error = null;
    });
    builder.addCase(fetchedTeamlist.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    //Handle match create cases.
    builder.addCase(createMatch.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createMatch.fulfilled, (state, action) => {
      state.isLoading = false;
      state.matchCreation = action.payload;
      state.error = null;
    });
    builder.addCase(createMatch.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    //Handle fetching match list.
    builder.addCase(fetchMatches.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMatches.fulfilled, (state, action) => {
      state.isLoading = false;
      state.matchesList = action.payload;
      state.error = null;
    });
    builder.addCase(fetchMatches.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    //Handle match details feching.
    builder.addCase(fetchMatchDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMatchDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.matchDetails = action.payload;
      state.error = null;
    });
    builder.addCase(fetchMatchDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });
  },
});

export default matchofficialSlice.reducer;
