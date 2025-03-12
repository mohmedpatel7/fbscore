import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = "http://localhost:5000/";

//Api call for admin sign in.
export const Signin = createAsyncThunk(
  "Signin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/admin/adminSignin`, {
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
      localStorage.removeItem("teamtoken");
      // Store token in localStorage
      localStorage.setItem("admintoken", data.admintoken);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to sign in. Please try again.",
      });
    }
  }
);

//Fetching all teams data.
export const fetchTeamTable = createAsyncThunk(
  "fetchTeamTable",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/admin/getTeams`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "admin-token": token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data.response; // Return only the `response` field
    } catch (error) {
      return rejectWithValue({
        message: "Failed to fetch user details. Please try again later.",
      });
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/admin/getAllUsers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("admintoken"),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || "Failed to fetch users");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch users");
    }
  }
);

//Fetching match officials data
export const fetchMatchOfficials = createAsyncThunk(
  "fetchMatchOfficials",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/admin/getMatchOfficial`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "admin-token": token,
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
        message: "Failed to fetch match officials. Please try again later.",
      });
    }
  }
);

//admin slice.
const AdminSlice = createSlice({
  name: "admin",
  initialState: {
    isLoading: false,
    admin: null,
    teamsTable: null,
    allUsers: null,
    matchOfficials: null,
    error: null,
  },

  extraReducers: (builder) => {
    //Handle Sign in cases.
    builder.addCase(Signin.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(Signin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.admin = action.payload;
      state.error = null;
    });
    builder.addCase(Signin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
    });

    //Handle fetching team table.
    builder.addCase(fetchTeamTable.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTeamTable.fulfilled, (state, action) => {
      state.isLoading = false;
      state.teamsTable = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTeamTable.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
    });

    //Handle fetching team table.
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allUsers = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
    });

    //Handle fetching match officials
    builder.addCase(fetchMatchOfficials.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMatchOfficials.fulfilled, (state, action) => {
      state.isLoading = false;
      state.matchOfficials = action.payload;
      state.error = null;
    });
    builder.addCase(fetchMatchOfficials.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
    });
  },
});

export default AdminSlice.reducer;
