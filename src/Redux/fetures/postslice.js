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

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    // Handle fetching all posts cases
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload;
      state.error = null;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default postSlice.reducer;
