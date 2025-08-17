import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../../features/posts/postsSlice';
import PostCard from '../PostCard/PostCard';
import './PostList.css';

function PostList({ posts, status }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <p>Loading posts...</p>;
  }

  if (status === 'failed') {
    return <p>Failed to load posts.</p>;
  }

  return (
    <div className="post-list">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>No posts match your criteria.</p>
      )}
    </div>
  );
}

export default PostList;