import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [], //List of posts
    status: 'idle', //idle | loading | succeeded | failed
    error: null
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts(state, action) {
            state.items = action.payload;
        }
    }
});

export const { setPosts } = postsSlice.actions;
export default postsSlice.reducer;