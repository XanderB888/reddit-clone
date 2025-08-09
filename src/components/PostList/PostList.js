import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../features/posts/postsSlice';
import './PostList.css';
import PostCard from '../PostCard/PostCard';

function PostList () {
    const dispatch = useDispatch();
    const { items: posts, status } = useSelector((state) => state.posts);
    
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPosts());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <p>Loading posts...</p>;
    }

    if (status === 'failed') {
        return <p>Failed to load posts.</p>
    }
      
    return (
        <div className='post-list'>
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

export default PostList;