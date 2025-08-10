import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (subreddit = 'popular') => {
        const response = await axios.get(
            `https://cors-anywhere.herokuapp.com/https://www.reddit.com/r/${subreddit}.json`,
        {
            headers: { 'X-Requested-With': 'XMLHttpRequest'}
        }
        );
        
        return response.data.data.children.map((child) => ({
            id: child.data.id,
            title: child.data.title,
            subreddit: child.data.subreddit,
            author: child.data.author,
            comments: child.data.num_comments,
            score: child.data.score,
        }));
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        items: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchPosts.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.items = action.payload;
        })
        .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
    }
});

export default postsSlice.reducer;