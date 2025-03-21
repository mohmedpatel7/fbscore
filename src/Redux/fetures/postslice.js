import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = "https://fbscore-backend.vercel.app/";

// Api call for fetching all posts
export const fetchPosts = createAsyncThunk(
  "fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/posts/post`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        return rejectWithValue(errorData);
      }

      // Return the success response
      const data = await response.json();
      return data.response.posts;
    } catch (error) {
      return rejectWithValue({
        message: "Internal server error..!",
      });
    }
  }
);

//Api call for uploading post for user.
export const uploadPost = createAsyncThunk(
  "uploadPost",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/posts/uploadPost`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("usertoken"), // Keep only the auth-token header
        },
        body: payload, // Directly pass the FormData object
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        return rejectWithValue(errorData);
      }

      return await response.json(); // Return the response data
    } catch (error) {
      return rejectWithValue({
        message: "Internal server error..! ",
      });
    }
  }
);

//Api call for uploading post for team owner.
export const uploadTeamPost = createAsyncThunk(
  "uploadTeamPost",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/posts/uploadTeamPost`, {
        method: "POST",
        headers: {
          "team-token": localStorage.getItem("teamtoken"), // Keep only the auth-token header
        },
        body: payload, // Directly pass the FormData object
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        return rejectWithValue(errorData);
      }

      return await response.json(); // Return the response data
    } catch (error) {
      return rejectWithValue({
        message: "Internal server error..! ",
      });
    }
  }
);

// Api call for fetching all for signin team.
export const fetchTeamPosts = createAsyncThunk(
  "fetchTeamPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/posts/signInTeamPost`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "team-token": localStorage.getItem("teamtoken"), // Keep only the auth-token header
        },
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        return rejectWithValue(errorData);
      }

      // Return the success response
      const data = await response.json();
      return data.posts;
    } catch (error) {
      return rejectWithValue({
        message: "Internal server error..!",
      });
    }
  }
);

// Api call for fetching all for signin team.
export const deleteTeamPosts = createAsyncThunk(
  "deleteTeamPosts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/posts/deleteTeamPost/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "team-token": localStorage.getItem("teamtoken"), // Keep only the auth-token header
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

// Api call for fetching all for signin team.
export const fetchUserPosts = createAsyncThunk(
  "fetchUserPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/posts/siginUserPost`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("usertoken"), // Keep only the auth-token header
        },
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        return rejectWithValue(errorData);
      }

      // Return the success response
      const data = await response.json();
      return data.posts;
    } catch (error) {
      return rejectWithValue({
        message: "Internal server error..!",
      });
    }
  }
);

// Api call for fetching all for signin team.
export const deleteUserPosts = createAsyncThunk(
  "deleteUserPosts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/posts/deletePost/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("usertoken"), // Keep only the auth-token header
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

// Fetching all matches.signin not required.
export const fetchAllMatches = createAsyncThunk(
  "fetchAllMatches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/match/matches`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error occurred" }));
        return rejectWithValue(errorData);
      }

      // Return the success response
      const data = await response.json();
      return data.matches;
    } catch (error) {
      return rejectWithValue({
        message: "Internal server error..!",
      });
    }
  }
);

// Fetching match details.
export const fetchMatchDetails = createAsyncThunk(
  "matchDetails",
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${url}api/match/commonMatchDetails/${matchId}`,
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
      const response = await fetch(`${url}api/match/getTeamDetails/${teamid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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

export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (searchquery, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${url}api/team/search?searchquery=${encodeURIComponent(searchquery)}`,
        {
          method: "GET", // Ensure it's a GET request
          headers: {
            "Content-Type": "application/json", // Set correct headers
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Parse response as JSON
      return data; // Contains `team_response` and `user_response`
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    posts: [],
    isLoading: false,
    matches: null,
    matchDetails: null,
    otherTeamData: null,
    searchResult: null,
    teamPost: null,
    userPost: null,
    error: null,
  },

  extraReducers: (builder) => {
    // Handle fetching all posts cases
    builder.addCase(fetchPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
      state.error = null;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message;
    });

    // Handle fetching team posts cases
    builder.addCase(fetchTeamPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTeamPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.teamPost = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTeamPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message;
    });

    // Handle fetching user posts cases
    builder.addCase(fetchUserPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userPost = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUserPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message;
    });

    //Handle upload post cases
    builder.addCase(uploadPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
    });
    builder.addCase(uploadPost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred."; // Use backend error or fallback
    });

    //Handle upload team post cases
    builder.addCase(uploadTeamPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadTeamPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
    });
    builder.addCase(uploadTeamPost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred."; // Use backend error or fallback
    });

    //Handle fetching all matches cases.
    builder.addCase(fetchAllMatches.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllMatches.fulfilled, (state, action) => {
      state.isLoading = false;
      state.matches = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAllMatches.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload.message;
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

    //handle fetch search result cases.
    builder.addCase(fetchSearchResults.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.searchResult = null; // Reset search results on new request
    });
    builder.addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.isLoading = false;
      state.searchResult = action.payload; // Correctly store API response
      state.error = null;
    });
    builder.addCase(fetchSearchResults.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload; // Fix error handling
    });
  },
});

export default postSlice.reducer;
