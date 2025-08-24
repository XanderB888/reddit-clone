import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Debug message to confirm file loads
console.log('🚨 POSTSLICE LOADED - This should show when the page loads');

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (subreddit = '') => {
    console.log('🎯 STARTING fetchPosts with subreddit:', subreddit);
    console.log('🎯 Type of subreddit:', typeof subreddit);
    
    const url = subreddit 
      ? `http://localhost:5000/api/posts/${subreddit}`
      : `http://localhost:5000/api/posts`;
    
    console.log('🌐 About to request URL:', url);
    
    try {
      const response = await axios.get(url);
      console.log('✅ fetchPosts SUCCESS! Got', response.data.length, 'posts');
      console.log('✅ First post title:', response.data[0]?.title);
      return response.data;
    } catch (error) {
      console.error('❌ fetchPosts ERROR:', error.response?.status);
      console.error('❌ Error message:', error.response?.data || error.message);
      console.error('❌ Full error:', error);
      throw error;
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null
  },
  reducers: {
    setPosts(state, action) {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        console.log('⏳ Redux: fetchPosts.pending - setting status to loading');
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        console.log('✅ Redux: fetchPosts.fulfilled - got', action.payload.length, 'posts');
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        console.log('❌ Redux: fetchPosts.rejected - error:', action.error.message);
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;