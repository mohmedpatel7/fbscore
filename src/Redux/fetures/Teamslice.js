import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = "http://localhost:5000/";

// Send OTP Async Thunk
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/team/sendotp`, {
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
      console.error("Send OTP Error:", error);
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
      // Construct FormData
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });

      // Make the API call
      const response = await fetch(`${url}api/team/createTeam`, {
        method: "POST",
        body: formData, // Pass FormData as the request body
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
      const response = await fetch(`${url}api/team/teamSignin`, {
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
      localStorage.removeItem("usertoken");
      localStorage.removeItem("matchOfficialtoken");
      // Store token in localStorage
      localStorage.setItem("teamtoken", data.teamtoken);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to sign in. Please try again.",
      });
    }
  }
);

//Fetching sign in team details Async thunk.
export const fetchTeamDetails = createAsyncThunk(
  "fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("teamtoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/team/getTeamDetails`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "team-token": token,
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

//Fetching all users which are not in any team.Sign in reuired for team owner.
export const fetchAvailableUsers = createAsyncThunk(
  "fetchAvailableUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("teamtoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/player/usersWithoutTeam`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "team-token": token,
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

export const SendPlayerReq = createAsyncThunk(
  "SendPlayerReq",
  async ({ userId, playerNo }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("teamtoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/team/sendPlayerReq/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "team-token": token,
        },
        body: JSON.stringify({ playerNo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        return rejectWithValue(errorData);
      }

      // Return the success response
      return await response.json();
    } catch (error) {
      return rejectWithValue({
        message: "Failed to send request. Please try again later.",
      });
    }
  }
);

// team Slice
const teamSlice = createSlice({
  name: "team",
  initialState: {
    isLoading: false,
    teamData: null,
    availableUsers: null,
    playerReq: null,
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
      state.teamData = action.payload;
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
      state.teamData = action.payload;
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
      state.teamData = action.payload;
      state.error = null;
    });
    builder.addCase(Signin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
    });

    //Handle fetch userdetails cases.
    builder.addCase(fetchTeamDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTeamDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.teamData = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTeamDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    //Handle fetch available users cases.
    builder.addCase(fetchAvailableUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAvailableUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.availableUsers = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAvailableUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });

    //Handle send player request cases.
    builder.addCase(SendPlayerReq.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(SendPlayerReq.fulfilled, (state, action) => {
      state.isLoading = false;
      state.playerReq = action.payload;
      state.error = null;
    });
    builder.addCase(SendPlayerReq.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });
  },
});

export default teamSlice.reducer;
