import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Debug message to confirm file loads
console.log('🚨 POSTSLICE LOADED - This should show when the page loads');

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ subreddit = '', after = '' }) => {
    console.log('🎯 STARTING fetchPosts with subreddit:', subreddit, 'after:', after);
    
    const url = subreddit 
      ? `http://localhost:5000/api/posts/${subreddit}`
      : `http://localhost:5000/api/posts`;
    
    console.log('🌐 About to request URL:', url);
    
    try {
      const response = await axios.get(url, {
        params: {
          after: after, // Reddit pagination parameter
          limit: 25
        }
      });
      console.log('✅ fetchPosts SUCCESS! Got', response.data.posts.length, 'posts');
      return {
        posts: response.data.posts,
        after: response.data.after // Next page token from Reddit
      };
    } catch (error) {
      console.error('❌ fetchPosts ERROR:', error.response?.status);
      console.error('❌ Error message:', error.response?.data || error.message);
      console.error('❌ Full error:', error);
      throw error;
    }
  }
);

export const loadMorePosts = createAsyncThunk(
  'posts/loadMorePosts', 
  async ({ subreddit = '', after }) => {
    console.log('📄 Loading more posts, after:', after);
    const url = subreddit 
      ? `http://localhost:5000/api/posts/${subreddit}`
      : `http://localhost:5000/api/posts`;
      
    try {
      const response = await axios.get(url, {
        params: {
          after: after,
          limit: 25
        }
      });
      
      return {
        posts: response.data.posts,
        after: response.data.after
      };
    } catch (error) {
      console.error('❌ Load more error:', error);
      throw error;
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    loadMoreStatus: 'idle', // separate status for load more
    error: null,
    after: null, // pagination token for next page
    hasMore: true // whether there are more posts to load
  },
  reducers: {
    setPosts(state, action) {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Initial fetch
      .addCase(fetchPosts.pending, (state) => {
        console.log('⏳ Redux: fetchPosts.pending - setting status to loading');
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        console.log('✅ Redux: fetchPosts.fulfilled - got', action.payload.posts.length, 'posts');
        state.status = 'succeeded';
        state.items = action.payload.posts; // Replace all posts
        state.after = action.payload.after;
        state.hasMore = action.payload.after !== null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        console.log('❌ Redux: fetchPosts.rejected - error:', action.error.message);
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Load more posts
      .addCase(loadMorePosts.pending, (state) => {
        state.loadMoreStatus = 'loading';
      })
      .addCase(loadMorePosts.fulfilled, (state, action) => {
        console.log('📄 Redux: loadMorePosts.fulfilled - got', action.payload.posts.length, 'more posts');
        state.loadMoreStatus = 'succeeded';
        state.items = [...state.items, ...action.payload.posts]; 
        state.after = action.payload.after;
        state.hasMore = action.payload.after !== null;
      })
      .addCase(loadMorePosts.rejected, (state, action) => {
        console.log('❌ Redux: loadMorePosts.rejected - error:', action.error.message);
        state.loadMoreStatus = 'failed';
      });
  }
});

export const { setPosts } = postsSlice.actions;
//export { loadMorePosts }; 
export default postsSlice.reducer;