import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url = "http://localhost:5000/";

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

//Api call for uploading post.
export const uploadPost = createAsyncThunk(
  "uploadPost",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/posts/uploadPost`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("token"), // Keep only the auth-token header
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

// Fetching search result api call.
export const fetchSearchResults = createAsyncThunk(
  "search/fetchResults",
  async (searchquery, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/api/team/search`, {
        params: { searchquery },
      });
      return response.data; // The response contains `team_response` and `user_response`
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
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
    });
    builder.addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.isLoading = false;
      state.searchResult = action.payload;
      state.error = null;
    });
    builder.addCase(fetchSearchResults.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || "Unknown error occurred.";
    });
  },
});

export default postSlice.reducer;
