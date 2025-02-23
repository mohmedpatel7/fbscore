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

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    data: null,
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
  },
});

export default authSlice.reducer;
