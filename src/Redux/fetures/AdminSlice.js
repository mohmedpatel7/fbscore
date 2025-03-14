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

//Fetching team requests.
export const fetchTeamRequests = createAsyncThunk(
  "fetchTeamRequests",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/admin/fetchTeamRequests`, {
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

//Api call for action on team req.
export const adminAcTeamReq = createAsyncThunk(
  "adminAcTeamReq",
  async ({ reqId, action }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/admin/adminAcTeam/${reqId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": token,
        },
        body: JSON.stringify({ action }),
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue({
        message: "Failed . Please try again.",
      });
    }
  }
);

//Fetching team requests.
export const fetchMatchOfficialReq = createAsyncThunk(
  "fetchMatchOfficialReq",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/admin/fetchMatchOfficialReq`, {
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

//Api call for action on team req.
export const adminAcMatchOfficialReq = createAsyncThunk(
  "adminAcMatchOfficialReq",
  async ({ reqId, action }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(
        `${url}api/admin/matchOfficialAction/${reqId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-token": token,
          },
          body: JSON.stringify({ action }),
        }
      );

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue({
        message: "Failed . Please try again.",
      });
    }
  }
);

//Api call for deleting entities (User/Team/MatchOfficial)
export const deleteEntity = createAsyncThunk(
  "deleteEntity",
  async ({ type, id }, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/admin/delete/${type}/${id}`, {
        method: "DELETE",
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

      // Refresh the corresponding data after successful deletion
      switch (type.toLowerCase()) {
        case "user":
          dispatch(fetchAllUsers());
          break;
        case "team":
          dispatch(fetchTeamTable());
          break;
        case "matchofficial":
          dispatch(fetchMatchOfficials());
          break;
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        message: "Failed to delete. Please try again.",
      });
    }
  }
);

//Fetching totals.
export const fetchTotals = createAsyncThunk(
  "fetchTotals",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("admintoken");
      if (!token) {
        return rejectWithValue({
          message: "Authentication token is missing. Please log in again.",
        });
      }

      const response = await fetch(`${url}api/admin/counts`, {
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

      return response.json();
    } catch (error) {
      return rejectWithValue({
        message: "Failed to fetch match officials. Please try again later.",
      });
    }
  }
);

// Api call for deleting all post.
export const deletePost = createAsyncThunk(
  "deletePost",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/admin/deletePost/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "admin-token": localStorage.getItem("admintoken"), // Keep only the auth-token header
        },
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        return rejectWithValue(errorData);
      }

      return response.json();
    } catch (error) {
      return rejectWithValue({
        message: "Internal server error..!",
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
    teamReq: null,
    matchOfficialReq: null,
    deleteStatus: null,
    totalUsers: null,
    error: null,
  },
  reducers: {
    // Add these reducers for optimistic updates
    updateTeams: (state, action) => {
      state.teamsTable = action.payload;
    },
    updateUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    updateOfficials: (state, action) => {
      state.matchOfficials = action.payload;
    },
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

    //Handle fetching team requests
    builder.addCase(fetchTeamRequests.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTeamRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.teamReq = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTeamRequests.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
    });

    //Handle action team requests
    builder.addCase(adminAcTeamReq.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(adminAcTeamReq.fulfilled, (state, action) => {
      state.isLoading = false;
      state.teamReq = action.payload;
      state.error = null;
    });
    builder.addCase(adminAcTeamReq.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
    });

    //Handle fetching match official requests
    builder.addCase(fetchMatchOfficialReq.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMatchOfficialReq.fulfilled, (state, action) => {
      state.isLoading = false;
      state.matchOfficialReq = action.payload;
      state.error = null;
    });
    builder.addCase(fetchMatchOfficialReq.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
    });

    //Handle action match official requests
    builder.addCase(adminAcMatchOfficialReq.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(adminAcMatchOfficialReq.fulfilled, (state, action) => {
      state.isLoading = false;
      state.matchOfficialReq = action.payload;
      state.error = null;
    });
    builder.addCase(adminAcMatchOfficialReq.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
    });

    //Handle delete entity
    builder.addCase(deleteEntity.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.deleteStatus = null;
    });
    builder.addCase(deleteEntity.fulfilled, (state, action) => {
      state.isLoading = false;
      state.deleteStatus = action.payload;
      state.error = null;
    });
    builder.addCase(deleteEntity.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
      state.deleteStatus = null;
    });

    //Handle delete entity
    builder.addCase(fetchTotals.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.deleteStatus = null;
    });
    builder.addCase(fetchTotals.fulfilled, (state, action) => {
      state.isLoading = false;
      state.totalUsers = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTotals.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
      state.deleteStatus = null;
    });

    //Handle delete post
    builder.addCase(deletePost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.deleteStatus = null;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.deleteStatus = action.payload;
      state.error = null;
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message;
      state.deleteStatus = null;
    });
  },
});

export default AdminSlice.reducer;
