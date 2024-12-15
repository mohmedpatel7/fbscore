import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = "http://localhost:5000/";

// Send OTP Async Thunk
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/auth/sendotp`, {
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
      console.log("Payload received:", payload); // Log the payload received

      // Construct FormData
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
        console.log(`FormData entry added: ${key} = ${payload[key]}`); // Log each field added to FormData
      });

      // Log all FormData entries for verification
      console.log("Final FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Make the API call
      console.log("Sending POST request to:", `${url}api/auth/signup`);
      const response = await fetch(`${url}api/auth/signup`, {
        method: "POST",
        body: formData, // Pass FormData as the request body
      });

      // Check response status
      console.log("Response status:", response.status);

      // If response is not OK, log the error details
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        return rejectWithValue(errorData);
      }

      // Log the success response
      const successData = await response.json();
      console.log("Success response data:", successData);
      return successData;
    } catch (error) {
      // Log any error caught during the process
      console.error("Sign Up Error:", error);
      return rejectWithValue({
        message: "Failed to sign up. Please try again.",
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
      state.data = action.payload;
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
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(SignUp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred."; // Use backend error or fallback
    });
  },
});

export default authSlice.reducer;
