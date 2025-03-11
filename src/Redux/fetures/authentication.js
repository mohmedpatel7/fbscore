import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = "http://localhost:5000/";

// Send OTP Async Thunk
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/auth/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
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
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });

      const response = await fetch(`${url}api/auth/signup`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      localStorage.removeItem("teamtoken");
      localStorage.removeItem("matchOfficialtoken");
      localStorage.setItem("usertoken", data.usertoken);

      return data;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to sign up. Please try again.",
      });
    }
  }
);

// Sign In Async Thunk
export const Signin = createAsyncThunk(
  "auth/Signin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();

      localStorage.removeItem("teamtoken");
      localStorage.removeItem("matchOfficialtoken");
      localStorage.setItem("usertoken", data.usertoken);

      return data;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to sign in. Please try again.",
      });
    }
  }
);

// Fetch User Details Async Thunk
export const fetchUserDetails = createAsyncThunk(
  "auth/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("usertoken");

      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/auth/getuser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to fetch user details. Please try again later.",
      });
    }
  }
);

// Fetch team requests for signin user.
export const fetchTeamReq = createAsyncThunk(
  "fetchTeamReq",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("usertoken");

      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/player/getTeamReq`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to fetch user details. Please try again later.",
      });
    }
  }
);

// Api call for user action on team req.
export const reqAction = createAsyncThunk(
  "reqAction",
  async ({ action, reqId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("usertoken");

      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/player/userAction/${reqId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify({ action }), // Send action as expected
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue({
        message: "Failed to process the request. Please try again.",
      });
    }
  }
);

// Fetching match details.
export const fetchMatchDetails = createAsyncThunk(
  "matchDetails",
  async (matchId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("usertoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/auth/matchDetails/${matchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
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

// Function for fetching other team details.
export const fetchOtherTeamDetails = createAsyncThunk(
  "fetchOtherTeamDetails",
  async (teamid, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("usertoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/auth/getTeamDetails/${teamid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data; // Return only the `response` field
    } catch (error) {
      return rejectWithValue({
        message: "Failed to fetch user details. Please try again later.",
      });
    }
  }
);

// Fetching squad player profile.
export const fetchPlayerProfile = createAsyncThunk(
  "fetchPlayerProfile",
  async (playerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("usertoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(
        `${url}api/auth/getPlayerDetails/${playerId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );

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

// Api call for updating user details.
export const updateUserDetails = createAsyncThunk(
  "updateUserDetails",
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("usertoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/auth/updateUserDetails`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
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

// Api call for forgot Password .
export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/auth/forgotpassword`, {
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

// Fetching squad player profile.
export const fetchOtherUser = createAsyncThunk(
  "fetchOtherUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${url}api/auth/getPlayerDetailsByUserId/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    data: null,
    teamReq: null,
    matchDetails: null,
    otherTeamData: null,
    playerProfile: null,
    updateUser: null,
    userProfile: null,
    error: null,
  },
  extraReducers: (builder) => {
    // Send OTP
    builder.addCase(sendOtp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sendOtp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(sendOtp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    // Sign Up
    builder.addCase(SignUp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(SignUp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(SignUp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    // Sign In
    builder.addCase(Signin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(Signin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(Signin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
    });

    // Fetch User Details
    builder.addCase(fetchUserDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUserDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    // Fetch team request cases
    builder.addCase(fetchTeamReq.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTeamReq.fulfilled, (state, action) => {
      state.isLoading = false;
      state.teamReq = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTeamReq.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    // User action on team req cases.
    builder.addCase(reqAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(reqAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.teamReq = action.payload;
      state.error = null;
    });
    builder.addCase(reqAction.rejected, (state, action) => {
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

    //handle fetch other team details.
    builder.addCase(fetchOtherTeamDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOtherTeamDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.otherTeamData = action.payload;
      state.error = null;
    });
    builder.addCase(fetchOtherTeamDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    //Handle player profile cases.
    builder.addCase(fetchPlayerProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPlayerProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.playerProfile = action.payload;
      state.error = null;
    });
    builder.addCase(fetchPlayerProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    //Handle update user profile cases.
    builder.addCase(updateUserDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.updateUser = action.payload;
      state.error = null;
    });
    builder.addCase(updateUserDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
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

    //Handle user profile feching.
    builder.addCase(fetchOtherUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOtherUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userProfile = action.payload;
      state.error = null;
    });
    builder.addCase(fetchOtherUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });
  },
});

export default authSlice.reducer;
